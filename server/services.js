// Business logic on top of the providers: scores, ratings, derived stats.

import * as yahoo from './providers/yahoo.js';
import * as amfi from './providers/amfi.js';
import { cached, pool, MIN, HOUR } from './lib/cache.js';
import { STOCKS, sectorOf, INDIAN_INDICES, SECTOR_INDICES, GLOBAL_INDICES, COMMODITIES } from './universe/stocks.js';

const CR = 1e7; // 1 crore in rupees
const capOf = (mcap) => (mcap == null ? null : mcap >= 1e12 ? 'Large' : mcap >= 3e11 ? 'Mid' : 'Small');
export const tickerOf = (symbol) => symbol.replace(/\.(NS|BO)$/, '');
export const toSymbol = (t) => (/\.(NS|BO)$/i.test(t) || t.startsWith('^') || t.includes('=') ? t.toUpperCase() : `${t.toUpperCase()}.NS`);

/* ------------------------------------------------------------------ market */

export const marketOverview = () =>
  cached('svc:overview', MIN, async () => {
    const all = [...INDIAN_INDICES, ...SECTOR_INDICES, ...GLOBAL_INDICES, ...COMMODITIES];
    const qs = await yahoo.quotes(all.map((x) => x.symbol));
    const q = new Map(qs.map((x) => [x.symbol, x]));
    const pick = (list) =>
      list.map((x) => q.get(x.symbol) && { ...x, value: q.get(x.symbol).price, change: q.get(x.symbol).change, changePct: q.get(x.symbol).changePct, high52: q.get(x.symbol).high52, low52: q.get(x.symbol).low52, time: q.get(x.symbol).time }).filter(Boolean);

    const usdinr = q.get('INR=X')?.price;
    const commodities = pick(COMMODITIES).map((c) => {
      if (c.convert && usdinr) {
        const perGram = (c.value * usdinr) / 31.1035;
        return { ...c, value: c.convert === 'gold' ? perGram * 10 : perGram * 1000, unit: '₹' };
      }
      return { ...c, unit: c.symbol === 'BZ=F' ? '$' : '₹' };
    });

    const stocks = await stockQuotes();
    const breadth = {
      advances: stocks.filter((s) => s.changePct > 0).length,
      declines: stocks.filter((s) => s.changePct < 0).length,
      unchanged: stocks.filter((s) => s.changePct === 0).length,
      universe: stocks.length,
    };
    const nifty = q.get('^NSEI');
    return {
      asOf: nifty?.time || Date.now(),
      marketState: nifty?.marketState || null,
      indian: pick(INDIAN_INDICES),
      sectors: pick(SECTOR_INDICES),
      global: pick(GLOBAL_INDICES),
      commodities,
      breadth,
    };
  });

/* ------------------------------------------------------------------ stocks */

const stockQuotes = () =>
  cached('svc:stockQuotes', MIN, async () => {
    const qs = await yahoo.quotes(STOCKS.map((s) => s.symbol));
    return qs.filter((q) => q.price != null).map((q) => ({
      ...q,
      ticker: tickerOf(q.symbol),
      sector: sectorOf(q.symbol),
      cap: capOf(q.marketCap),
      mcapCr: q.marketCap ? q.marketCap / CR : null,
    }));
  });

/** Fundamentals for the whole universe, refreshed in the background (slow to build cold). */
let fundamentalsWarm = null;
export const universeFundamentals = () =>
  cached('svc:fundamentals', 12 * HOUR, async () => {
    const res = await pool(STOCKS, 4, (s) => yahoo.summary(s.symbol));
    return Object.fromEntries(STOCKS.map((s, i) => [s.symbol, res[i]]).filter(([, v]) => v));
  }, { disk: true });
export function warmFundamentals() {
  fundamentalsWarm ||= universeFundamentals().catch((e) => console.warn('[warm] fundamentals', e.message)).finally(() => { fundamentalsWarm = null; });
  return fundamentalsWarm;
}

/** Percentile (0..1) of each value in `vals`; nulls stay null. */
function percentiles(vals) {
  const sorted = vals.filter((v) => v != null && Number.isFinite(v)).sort((a, b) => a - b);
  const n = sorted.length;
  return vals.map((v) => {
    if (v == null || !Number.isFinite(v) || n < 2) return null;
    let lo = 0;
    while (lo < n && sorted[lo] < v) lo++;
    return lo / (n - 1);
  });
}

const mean = (xs) => {
  const v = xs.filter((x) => x != null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};

/** Q/G/V/M scores (0–10) relative to the tracked universe, plus a 1–5 star rating. */
function scoreAll(rows, fund) {
  const f = (s) => fund[s.symbol] || {};
  const col = (fn) => percentiles(rows.map(fn));
  const roe = col((s) => f(s).roe);
  const margin = col((s) => f(s).profitMargin);
  const lev = col((s) => (f(s).debtToEquity != null ? -f(s).debtToEquity : null));
  const rev = col((s) => f(s).revenueGrowth);
  const earn = col((s) => f(s).earningsGrowth);
  const pe = col((s) => (s.pe != null && s.pe > 0 ? -s.pe : null));
  const pb = col((s) => (s.pb != null && s.pb > 0 ? -s.pb : null));
  const mom1 = col((s) => s.change52Pct);
  const mom2 = col((s) => (s.avg200 ? s.price / s.avg200 : null));

  return rows.map((s, i) => {
    const to10 = (x) => (x == null ? null : Math.round(x * 10));
    const scores = {
      quality: to10(mean([roe[i], margin[i], lev[i]])),
      growth: to10(mean([rev[i], earn[i]])),
      valuation: to10(mean([pe[i], pb[i]])),
      momentum: to10(mean([mom1[i], mom2[i]])),
    };
    const avg = mean(Object.values(scores));
    const rating = avg == null ? null : avg >= 7 ? 5 : avg >= 5.8 ? 4 : avg >= 4.4 ? 3 : avg >= 3 ? 2 : 1;
    const fu = f(s);
    return { ...s, roe: fu.roe ?? null, profitMargin: fu.profitMargin ?? null, debtToEquity: fu.debtToEquity ?? null, scores, rating };
  });
}

export async function stockList() {
  const [rows, fund] = await Promise.all([stockQuotes(), cachedFundamentalsOrEmpty()]);
  return { asOf: Math.max(...rows.map((r) => r.time || 0)), scored: Object.keys(fund).length > 0, rows: scoreAll(rows, fund) };
}

/** Never block a list request on the slow fundamentals build. */
async function cachedFundamentalsOrEmpty() {
  const t = new Promise((r) => setTimeout(() => r(null), 150));
  const v = await Promise.race([universeFundamentals().catch(() => null), t]);
  if (!v) warmFundamentals();
  return v || {};
}

export async function stockDetail(input) {
  const symbol = toSymbol(input);
  const [[quote], summary, financials, list] = await Promise.all([
    yahoo.quotes([symbol]),
    yahoo.summary(symbol).catch(() => null),
    yahoo.financials(symbol).catch(() => []),
    stockList(),
  ]);
  if (!quote || quote.price == null) return null;
  const inList = list.rows.find((r) => r.symbol === symbol);
  // Stocks outside the universe are scored against it so the scale stays comparable.
  let scored = inList;
  if (!scored) {
    const fund = await cachedFundamentalsOrEmpty();
    const extra = { ...quote, ticker: tickerOf(symbol), sector: summary?.sector || null, cap: capOf(quote.marketCap), mcapCr: quote.marketCap ? quote.marketCap / CR : null };
    scored = scoreAll([...list.rows, extra], { ...fund, [symbol]: summary || {} }).at(-1);
  }
  const sector = scored.sector;
  const peers = list.rows.filter((r) => r.sector === sector && r.symbol !== symbol).sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0)).slice(0, 6);
  return {
    ...scored,
    profile: summary,
    financials: financials.map((r) => ({ ...r, revenueCr: r.revenue != null ? r.revenue / CR : null, profitCr: r.profit != null ? r.profit / CR : null })),
    peers,
  };
}

/* ------------------------------------------------------------------- funds */

const CURATED = {
  wealth: (f) => f.rating >= 4 && ((f.type === 'Equity' && /Flexi Cap|Large Cap|Large & Mid Cap|Multi Cap|Value|Focused|Contra/.test(f.category)) || /Aggressive Hybrid/.test(f.category)),
  income: (f) => f.rating >= 4 && /Corporate Bond|Banking and PSU|Short Duration|Money Market|Liquid|Equity Savings|Conservative Hybrid|Arbitrage|Balanced Advantage/.test(f.category),
  tax: (f) => f.rating >= 4 && /ELSS/.test(f.category),
  index: (f) => f.rating >= 4 && f.type === 'Index',
};

export async function fundList({ q = '', type = '', category = '', minRating = 0, list = '', sort = '3y', dir = 'desc', limit = 50, offset = 0 }) {
  const u = await amfi.universe();
  const term = q.trim().toLowerCase();
  let rows = u.rows
    .filter((f) => !type || f.type === type)
    .filter((f) => !category || f.category === category)
    .filter((f) => !minRating || (f.rating || 0) >= minRating)
    .filter((f) => !list || CURATED[list]?.(f))
    .filter((f) => !term || f.name.toLowerCase().includes(term) || (f.amc || '').toLowerCase().includes(term));
  const key = (f) => (sort === 'rating' ? f.rating ?? -1 : sort === 'nav' ? f.nav : sort === 'name' ? f.name : f.ret[sort] ?? -999);
  rows.sort((a, b) => {
    const A = key(a); const B = key(b);
    const c = typeof A === 'string' ? A.localeCompare(B) : A - B;
    return dir === 'asc' ? c : -c;
  });
  const total = rows.length;
  rows = rows.slice(Number(offset), Number(offset) + Math.min(Number(limit), 200));
  return { asOf: u.asOf, total, rows };
}

export async function fundMeta() {
  const u = await amfi.universe();
  const counts = Object.fromEntries(Object.keys(CURATED).map((k) => [k, u.rows.filter(CURATED[k]).length]));
  const types = [...new Set(u.rows.map((r) => r.type))];
  return { asOf: u.asOf, total: u.rows.length, types, categories: u.categories.sort((a, b) => b.count - a.count), curated: counts };
}

/** Real stats from the full NAV history. */
function historyStats(points) {
  if (points.length < 30) return {};
  // Month-end series
  const monthly = [];
  let lastMonth = null;
  for (const p of points) {
    const d = new Date(p.t);
    const m = d.getFullYear() * 12 + d.getMonth();
    if (m !== lastMonth) monthly.push(p);
    else monthly[monthly.length - 1] = p;
    lastMonth = m;
  }
  const last3y = monthly.slice(-37);
  const rets = last3y.slice(1).map((p, i) => p.v / last3y[i].v - 1);
  const avg = rets.reduce((a, b) => a + b, 0) / (rets.length || 1);
  const sd = Math.sqrt(rets.reduce((a, b) => a + (b - avg) ** 2, 0) / Math.max(1, rets.length - 1)) * Math.sqrt(12) * 100;
  const annRet = (Math.pow(last3y.at(-1).v / last3y[0].v, 12 / Math.max(1, last3y.length - 1)) - 1) * 100;
  const sharpe = sd > 0 ? (annRet - 6.5) / sd : null;

  let peak = -Infinity; let maxDd = 0;
  for (const p of points) {
    peak = Math.max(peak, p.v);
    maxDd = Math.min(maxDd, p.v / peak - 1);
  }

  // SIP of ₹10,000 on the first NAV of each month, for 1/3/5/10 years
  const sip = [1, 3, 5, 10].map((years) => {
    const start = monthly.length - years * 12 - 1;
    if (start < 0) return null;
    let units = 0; let invested = 0;
    const flows = [];
    for (let i = start; i < monthly.length - 1; i++) {
      units += 10000 / monthly[i].v;
      invested += 10000;
      flows.push({ t: monthly[i].t, amt: -10000 });
    }
    const value = units * points.at(-1).v;
    flows.push({ t: points.at(-1).t, amt: value });
    return { years, invested, value: Math.round(value), xirr: xirr(flows) };
  }).filter(Boolean);

  return {
    stdDev: Math.round(sd * 100) / 100,
    sharpe: sharpe != null ? Math.round(sharpe * 100) / 100 : null,
    maxDrawdown: Math.round(maxDd * 10000) / 100,
    sip,
    inception: points[0].t,
  };
}

function xirr(flows) {
  const t0 = flows[0].t;
  const f = (r) => flows.reduce((a, x) => a + x.amt / Math.pow(1 + r, (x.t - t0) / (365 * 86400000)), 0);
  let lo = -0.99; let hi = 5;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) lo = mid; else hi = mid;
  }
  return Math.round(((lo + hi) / 2) * 10000) / 100;
}

export async function fundDetail(code) {
  const u = await amfi.universe();
  const fund = u.byCode[code];
  if (!fund) return null;
  const hist = await amfi.history(code).catch(() => ({ points: [], meta: null }));
  const peers = u.rows.filter((r) => r.category === fund.category && r.code !== fund.code && r.ret['3y'] != null).sort((a, b) => b.ret['3y'] - a.ret['3y']).slice(0, 8);
  const rankList = u.rows.filter((r) => r.category === fund.category && r.ret['3y'] != null).sort((a, b) => b.ret['3y'] - a.ret['3y']);
  const rank = rankList.findIndex((r) => r.code === fund.code) + 1;
  return { ...fund, stats: historyStats(hist.points), rank: rank || null, rankOf: rankList.length, peers, schemeType: hist.meta?.scheme_type || null };
}

const FUND_RANGES = { '1M': 31, '6M': 183, '1Y': 366, '3Y': 3 * 366, '5Y': 5 * 366, MAX: Infinity };
export async function fundChart(code, range = '1Y') {
  const { points } = await amfi.history(code);
  const days = FUND_RANGES[range] ?? 366;
  const from = points.length ? points.at(-1).t - days * 86400000 : 0;
  let pts = points.filter((p) => p.t >= from);
  const step = Math.ceil(pts.length / 400);
  if (step > 1) pts = pts.filter((_, i) => i % step === 0 || i === pts.length - 1);
  return pts;
}

/* ------------------------------------------------------------------ search */

export async function search(q) {
  const term = q.trim().toLowerCase();
  if (term.length < 2) return [];
  const [u, list, remote] = await Promise.all([
    amfi.universe(),
    stockQuotes(),
    yahoo.search(q).catch(() => []),
  ]);
  const funds = u.rows.filter((f) => f.name.toLowerCase().includes(term)).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5)
    .map((f) => ({ type: 'Fund', id: String(f.code), label: f.name, sub: f.category }));
  const local = list.filter((s) => s.name.toLowerCase().includes(term) || s.ticker.toLowerCase().includes(term))
    .map((s) => ({ type: 'Stock', id: s.ticker, label: s.name, sub: `${s.ticker} · NSE` }));
  const seen = new Set(local.map((s) => s.id));
  const extra = remote.filter((r) => r.symbol.endsWith('.NS') && !seen.has(tickerOf(r.symbol)))
    .map((r) => ({ type: 'Stock', id: tickerOf(r.symbol), label: r.name, sub: `${tickerOf(r.symbol)} · ${r.exchange}` }));
  return [...local, ...extra].slice(0, 5).concat(funds);
}

export { yahoo, amfi };
