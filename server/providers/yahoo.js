// Market data adapter: Yahoo Finance (unofficial, ~15 min delayed for NSE/BSE).
// Every route uses only the functions exported here, so a licensed vendor
// (TrueData, Global Datafeeds, Kite, Upstox…) can replace this file without
// touching the API or the frontend.

import { cached, MIN, HOUR } from '../lib/cache.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
let session = null; // { cookie, crumb, at }

async function getSession(force = false) {
  if (session && !force && Date.now() - session.at < 6 * HOUR) return session;
  const r = await fetch('https://fc.yahoo.com', { headers: { 'User-Agent': UA }, redirect: 'manual' });
  const cookie = (r.headers.getSetCookie?.() || [r.headers.get('set-cookie') || ''])
    .map((c) => c.split(';')[0])
    .filter(Boolean)
    .join('; ');
  const c = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', { headers: { 'User-Agent': UA, Cookie: cookie } });
  const crumb = (await c.text()).trim();
  if (!crumb || crumb.includes('<')) throw new Error('Could not obtain Yahoo crumb');
  session = { cookie, crumb, at: Date.now() };
  return session;
}

async function getJson(url, { auth = false } = {}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const headers = { 'User-Agent': UA, Accept: 'application/json' };
    let u = url;
    if (auth) {
      const s = await getSession(attempt > 0);
      headers.Cookie = s.cookie;
      u += `${url.includes('?') ? '&' : '?'}crumb=${encodeURIComponent(s.crumb)}`;
    }
    const r = await fetch(u, { headers });
    if ((r.status === 401 || r.status === 403) && auth && attempt === 0) continue;
    if (!r.ok) throw new Error(`Yahoo ${r.status} for ${url.split('?')[0]}`);
    return r.json();
  }
  throw new Error('Yahoo auth failed');
}

const toQuote = (q) => ({
  symbol: q.symbol,
  name: q.longName || q.shortName || q.symbol,
  price: q.regularMarketPrice,
  change: q.regularMarketChange,
  changePct: q.regularMarketChangePercent,
  prevClose: q.regularMarketPreviousClose,
  open: q.regularMarketOpen,
  dayHigh: q.regularMarketDayHigh,
  dayLow: q.regularMarketDayLow,
  volume: q.regularMarketVolume,
  high52: q.fiftyTwoWeekHigh,
  low52: q.fiftyTwoWeekLow,
  change52Pct: q.fiftyTwoWeekChangePercent,
  avg50: q.fiftyDayAverage,
  avg200: q.twoHundredDayAverage,
  marketCap: q.marketCap, // in rupees
  pe: q.trailingPE ?? null,
  pb: q.priceToBook ?? null,
  eps: q.epsTrailingTwelveMonths ?? null,
  divYield: q.trailingAnnualDividendYield != null ? q.trailingAnnualDividendYield * 100 : (q.dividendYield ?? null),
  currency: q.currency,
  marketState: q.marketState,
  time: q.regularMarketTime ? q.regularMarketTime * 1000 : null,
});

/** Batched live quotes. Cached 60s per symbol set. */
export async function quotes(symbols) {
  const unique = [...new Set(symbols)];
  const chunks = [];
  for (let i = 0; i < unique.length; i += 50) chunks.push(unique.slice(i, i + 50));
  const results = await Promise.all(
    chunks.map((c) =>
      cached(`yq:${c.join(',')}`, MIN, async () => {
        const j = await getJson(`https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(c.join(','))}`, { auth: true });
        return (j.quoteResponse?.result || []).map(toQuote);
      }),
    ),
  );
  const bySymbol = new Map(results.flat().map((q) => [q.symbol, q]));
  return unique.map((s) => bySymbol.get(s)).filter(Boolean);
}

const RANGE = {
  '1D': ['1d', '5m'], '1M': ['1mo', '1d'], '6M': ['6mo', '1d'], '1Y': ['1y', '1d'],
  '3Y': ['3y', '1wk'], '5Y': ['5y', '1wk'], MAX: ['max', '1mo'],
};

/** Price history as [{t, v}]. Intraday cached 2 min, longer ranges 30 min. */
export async function chart(symbol, range = '1Y') {
  const [r, interval] = RANGE[range] || RANGE['1Y'];
  return cached(`yc:${symbol}:${range}`, range === '1D' ? 2 * MIN : 30 * MIN, async () => {
    const j = await getJson(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${r}&interval=${interval}`);
    const res = j.chart?.result?.[0];
    if (!res) throw new Error(`No chart for ${symbol}`);
    const close = res.indicators?.quote?.[0]?.close || [];
    return (res.timestamp || [])
      .map((t, i) => ({ t: t * 1000, v: close[i] }))
      .filter((p) => p.v != null);
  });
}

const raw = (x) => (x && typeof x === 'object' ? x.raw ?? null : x ?? null);

/** Company profile + key fundamentals. Cached 12h (changes quarterly). */
export async function summary(symbol) {
  return cached(`ys:${symbol}`, 12 * HOUR, async () => {
    const mods = 'assetProfile,financialData,defaultKeyStatistics,summaryDetail,majorHoldersBreakdown';
    const j = await getJson(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${mods}`, { auth: true });
    const r = j.quoteSummary?.result?.[0] || {};
    const fd = r.financialData || {};
    const ks = r.defaultKeyStatistics || {};
    const mh = r.majorHoldersBreakdown || {};
    return {
      sector: r.assetProfile?.sector || null,
      industry: r.assetProfile?.industry || null,
      about: r.assetProfile?.longBusinessSummary || null,
      website: r.assetProfile?.website || null,
      employees: r.assetProfile?.fullTimeEmployees || null,
      roe: raw(fd.returnOnEquity) != null ? raw(fd.returnOnEquity) * 100 : null,
      roa: raw(fd.returnOnAssets) != null ? raw(fd.returnOnAssets) * 100 : null,
      profitMargin: raw(fd.profitMargins) != null ? raw(fd.profitMargins) * 100 : null,
      operatingMargin: raw(fd.operatingMargins) != null ? raw(fd.operatingMargins) * 100 : null,
      revenueGrowth: raw(fd.revenueGrowth) != null ? raw(fd.revenueGrowth) * 100 : null,
      earningsGrowth: raw(fd.earningsGrowth) != null ? raw(fd.earningsGrowth) * 100 : null,
      debtToEquity: raw(fd.debtToEquity),
      currentRatio: raw(fd.currentRatio),
      bookValue: raw(ks.bookValue),
      beta: raw(ks.beta) ?? raw(r.summaryDetail?.beta),
      insidersPct: raw(mh.insidersPercentHeld) != null ? raw(mh.insidersPercentHeld) * 100 : null,
      institutionsPct: raw(mh.institutionsPercentHeld) != null ? raw(mh.institutionsPercentHeld) * 100 : null,
    };
  });
}

/** Annual revenue / net profit / EPS. Cached 24h. Values in rupees. */
export async function financials(symbol) {
  return cached(`yf:${symbol}`, 24 * HOUR, async () => {
    const now = Math.floor(Date.now() / 1000);
    const types = 'annualTotalRevenue,annualNetIncome,annualDilutedEPS';
    const j = await getJson(`https://query1.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(symbol)}?type=${types}&period1=${now - 8 * 365 * 86400}&period2=${now}`);
    const byYear = {};
    for (const series of j.timeseries?.result || []) {
      const type = series.meta?.type?.[0];
      for (const p of series[type] || []) {
        if (!p) continue;
        const year = `FY${p.asOfDate.slice(2, 4)}`;
        byYear[year] ||= { year, date: p.asOfDate };
        byYear[year][{ annualTotalRevenue: 'revenue', annualNetIncome: 'profit', annualDilutedEPS: 'eps' }[type]] = p.reportedValue?.raw ?? null;
      }
    }
    return Object.values(byYear).sort((a, b) => a.date.localeCompare(b.date));
  });
}

/** Search NSE/BSE equities by name or ticker. Cached 1h per query. */
export async function search(q) {
  return cached(`ysr:${q.toLowerCase()}`, HOUR, async () => {
    const j = await getJson(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0&region=IN`);
    return (j.quotes || [])
      .filter((x) => x.quoteType === 'EQUITY' && (x.symbol.endsWith('.NS') || x.symbol.endsWith('.BO')))
      .map((x) => ({ symbol: x.symbol, name: x.longname || x.shortname, exchange: x.exchDisp, sector: x.sectorDisp || null }));
  });
}
