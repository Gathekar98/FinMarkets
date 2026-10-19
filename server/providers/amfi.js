// Mutual fund data from AMFI (official, free) and mfapi.in (NAV history mirror of AMFI).
// AMFI publishes every scheme's NAV each business day (~9–11 PM IST).

import { cached, HOUR } from '../lib/cache.js';

const LATEST_URL = 'https://portal.amfiindia.com/spages/NAVAll.txt';
const HISTORY_URL = (d) => `https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?frmdt=${d}`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmtDate = (d) => `${String(d.getDate()).padStart(2, '0')}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
const parseDate = (s) => {
  const [dd, mon, yyyy] = s.trim().split('-');
  const m = MONTHS.findIndex((x) => x.toLowerCase() === mon.toLowerCase());
  return new Date(Number(yyyy), m >= 0 ? m : Number(mon) - 1, Number(dd));
};

/** AMFI's portal is occasionally slow or drops a request; retry with a per-attempt timeout. */
async function fetchText(url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 finMarkets' }, signal: AbortSignal.timeout(15000) });
      if (!r.ok) throw new Error(`AMFI ${r.status}`);
      return await r.text();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((res) => setTimeout(res, 500 * (i + 1)));
    }
  }
  throw lastErr;
}

/** Maps an AMFI section header to { type, category }. Returns null for schemes we skip (ETFs, closed-ended…). */
function classify(header) {
  const m = header.match(/^Open Ended Schemes\s*\(\s*(.+?)\s*\)\s*$/i);
  if (!m) return null;
  const inner = m[1];
  const idx = inner.indexOf(' - ');
  const kind = idx >= 0 ? inner.slice(0, idx) : inner;
  const rest = idx >= 0 ? inner.slice(idx + 3) : '';
  let cat = rest.replace(/\s*Funds?$/i, '').trim();
  // AMFI spells some categories several ways; collapse them.
  if (/ELSS/i.test(cat)) cat = 'ELSS';
  else if (/Sectoral|Thematic/i.test(cat)) cat = 'Sectoral / Thematic';
  else if (/Balanced Advantage|Dynamic Asset Allocation/i.test(cat)) cat = 'Balanced Advantage';
  if (/ETF/i.test(cat)) return null;
  if (/^Equity Scheme/i.test(kind)) return { type: 'Equity', category: cat === 'ELSS' ? 'ELSS (Tax Saver)' : cat };
  if (/^Hybrid Scheme/i.test(kind) && cat === 'Sectoral / Thematic') return { type: 'Hybrid', category: 'Other Hybrid' };
  if (/^Debt Scheme/i.test(kind)) return { type: 'Debt', category: cat };
  if (/^Hybrid Scheme/i.test(kind)) return { type: 'Hybrid', category: cat };
  if (/^Solution Oriented/i.test(kind)) return { type: 'Solution', category: cat };
  if (/^Other Scheme/i.test(kind)) {
    if (/Index/i.test(cat)) return { type: 'Index', category: 'Index Funds' };
    if (/Overseas/i.test(cat)) return { type: 'International', category: 'International FoF' };
    if (/FoF/i.test(cat)) return { type: 'FoF', category: 'Domestic FoF' };
    return { type: 'Other', category: cat || 'Other' };
  }
  return null;
}

const isDirectGrowth = (name, plan = '', option = '') => {
  const text = `${name} ${plan} ${option}`;
  return /direct/i.test(text) && /growth/i.test(text) && !/idcw|dividend|bonus|payout|reinvest/i.test(text);
};

/** Parses the latest NAVAll.txt into direct-growth open-ended schemes. */
function parseLatest(text) {
  const funds = [];
  let section = null;
  let amc = null;
  for (const lineRaw of text.split(/\r?\n/)) {
    const line = lineRaw.trim();
    if (!line) continue;
    if (/^Open Ended Schemes|^Close Ended Schemes|^Interval Fund/i.test(line)) {
      section = classify(line);
      continue;
    }
    if (!line.includes(';')) {
      amc = line;
      continue;
    }
    const p = line.split(';');
    if (!section || !/^\d+$/.test(p[0])) continue;
    const name = p[3];
    const plan = p.length >= 8 ? p[4] : '';
    const option = p.length >= 8 ? p[5] : '';
    const nav = parseFloat(p[p.length - 2]);
    if (!isDirectGrowth(name, plan, option) || !Number.isFinite(nav)) continue;
    funds.push({
      code: Number(p[0]),
      name: cleanName(name),
      amc,
      isin: p[1] && p[1] !== '-' ? p[1] : null,
      type: section.type,
      category: section.category,
      nav,
      date: p[p.length - 1].trim(),
    });
  }
  return funds;
}

const cleanName = (n) =>
  n.replace(/\s*[-–(]\s*direct\s*(plan)?\s*[-–)]?\s*(-\s*)?growth\s*(option|plan)?\s*\)?/i, '')
    .replace(/\s*-\s*direct\s*(plan)?/i, '')
    .replace(/\s*-?\s*growth(\s*option)?$/i, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\s\-–]+$/, '')
    .trim();

/** code -> nav for a historical file. */
function parseHistory(text) {
  const map = new Map();
  for (const line of text.split(/\r?\n/)) {
    const p = line.split(';');
    if (p.length < 4 || !/^\d+$/.test(p[0])) continue;
    const nav = parseFloat(p[p.length - 2]);
    if (Number.isFinite(nav)) map.set(Number(p[0]), nav);
  }
  return map;
}

export const latest = () => cached('amfi:latest', HOUR, async () => parseLatest(await fetchText(LATEST_URL)), { disk: true });

/** NAVs for all schemes on `date`, stepping back over weekends/holidays. Past files never change, so cache long. */
async function navsOn(date) {
  const d = new Date(date);
  for (let i = 0; i < 6; i++) {
    const key = fmtDate(d);
    const map = await cached(`amfi:hist:${key}`, 30 * 24 * HOUR, async () => {
      const m = parseHistory(await fetchText(HISTORY_URL(key)));
      return Object.fromEntries(m);
    }, { disk: true });
    if (Object.keys(map).length > 1000) return { date: key, map };
    d.setDate(d.getDate() - 1);
  }
  return { date: null, map: {} };
}

const RET_PERIODS = { '1d': null, '1m': 1 / 12, '6m': 0.5, '1y': 1, '3y': 3, '5y': 5, '10y': 10 };

const BUCKETS = [[0.9, 5], [0.675, 4], [0.325, 3], [0.1, 2], [0, 1]];

/**
 * Full universe with trailing returns and a return-based rating, recomputed when AMFI publishes.
 * Returns are point-to-point for ≤1Y and CAGR above that.
 */
export const universe = () =>
  cached('amfi:universe', HOUR, async () => {
    const funds = await latest();
    const asOf = parseDate(funds[0].date);

    const past = {};
    for (const [k, years] of Object.entries(RET_PERIODS)) {
      const d = new Date(asOf);
      if (years == null) d.setDate(d.getDate() - 1);
      else if (years < 1) d.setMonth(d.getMonth() - Math.round(years * 12));
      else d.setFullYear(d.getFullYear() - years);
      past[k] = await navsOn(d);
    }

    const rows = funds.map((f) => {
      const ret = {};
      for (const [k, years] of Object.entries(RET_PERIODS)) {
        const then = past[k].map[f.code];
        if (!then) { ret[k] = null; continue; }
        const g = f.nav / then;
        ret[k] = years == null || years <= 1 ? (g - 1) * 100 : (Math.pow(g, 1 / years) - 1) * 100;
        ret[k] = Math.round(ret[k] * 100) / 100;
      }
      return { ...f, ret, risk: riskFor(f) };
    });

    // Rating: percentile of 3Y (and 5Y when available) return within category.
    const byCat = groupBy(rows.filter((r) => r.ret['3y'] != null), (r) => r.category);
    for (const list of Object.values(byCat)) {
      if (list.length < 5) continue;
      const rank = (key) => {
        const vals = list.filter((r) => r.ret[key] != null).sort((a, b) => a.ret[key] - b.ret[key]);
        const n = vals.length;
        return new Map(vals.map((r, i) => [r.code, n > 1 ? i / (n - 1) : 0.5]));
      };
      const r3 = rank('3y');
      const r5 = rank('5y');
      const scored = list
        .map((r) => ({ r, s: r5.has(r.code) ? (r3.get(r.code) + r5.get(r.code)) / 2 : r3.get(r.code) }))
        .sort((a, b) => a.s - b.s);
      scored.forEach(({ r }, i) => {
        const pct = scored.length > 1 ? i / (scored.length - 1) : 0.5;
        r.rating = BUCKETS.find(([cut]) => pct >= cut)[1];
      });
    }

    const categories = Object.entries(groupBy(rows, (r) => `${r.type}|${r.category}`)).map(([k, list]) => {
      const [type, category] = k.split('|');
      const avg = (key) => {
        const v = list.map((r) => r.ret[key]).filter((x) => x != null);
        return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 100) / 100 : null;
      };
      return { type, category, count: list.length, ret: { '1y': avg('1y'), '3y': avg('3y'), '5y': avg('5y') } };
    });
    const catAvg = Object.fromEntries(categories.map((c) => [c.category, c.ret]));
    rows.forEach((r) => { r.catRet = catAvg[r.category]; });

    return { asOf: funds[0].date, rows, categories, byCode: Object.fromEntries(rows.map((r) => [r.code, r])) };
  });

function riskFor(f) {
  if (f.type === 'Debt') {
    if (/Overnight|Liquid|Money Market/i.test(f.category)) return 'Low to Moderate';
    if (/Credit Risk|Medium/i.test(f.category)) return 'Moderately High';
    return 'Moderate';
  }
  if (f.type === 'Hybrid') {
    if (/Arbitrage/i.test(f.category)) return 'Low';
    if (/Conservative|Equity Savings/i.test(f.category)) return 'Moderately High';
    if (/Aggressive/i.test(f.category)) return 'Very High';
    return 'High';
  }
  if (/Gold|Silver/i.test(f.name)) return 'High';
  return 'Very High';
}

const groupBy = (arr, fn) => arr.reduce((acc, x) => ((acc[fn(x)] ||= []).push(x), acc), {});

/** Full NAV history for a scheme (mfapi.in mirrors AMFI). Ascending [{t, v}]. */
export const history = (code) =>
  cached(`mfapi:${code}`, 6 * HOUR, async () => {
    const r = await fetch(`https://api.mfapi.in/mf/${code}`);
    if (!r.ok) throw new Error(`mfapi ${r.status}`);
    const j = await r.json();
    return {
      meta: j.meta,
      points: (j.data || [])
        .map((d) => ({ t: parseDate(d.date).getTime(), v: parseFloat(d.nav) }))
        .filter((p) => Number.isFinite(p.v))
        .reverse(),
    };
  });
