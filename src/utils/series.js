// Deterministic pseudo-random series so static charts look the same on every load.

export function seeded(seed) {
  let s = typeof seed === 'string' ? [...seed].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0 : seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random walk ending exactly at `end`, growing at `cagr` (%) a year over a span of `years`. */
export function walk(seed, points, end, { cagr = 12, vol = 0.018, years = 1 } = {}) {
  const rnd = seeded(seed);
  const drift = (Math.log(1 + cagr / 100) * years) / (points - 1);
  const raw = [1];
  for (let i = 1; i < points; i++) {
    const shock = (rnd() - 0.5) * 2 * vol;
    raw.push(raw[i - 1] * Math.exp(drift + shock));
  }
  const k = end / raw[raw.length - 1];
  return raw.map((v) => +(v * k).toFixed(2));
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Builds [{label, value}] for a chart range ending at the reference date (Oct 2026). */
export function rangeSeries(seed, end, range = '1Y', opts) {
  const cfg = { '1M': [22, 'd', 1 / 12], '6M': [26, 'w', 0.5], '1Y': [52, 'w', 1], '3Y': [36, 'm', 3], '5Y': [60, 'm', 5], MAX: [120, 'm', 10] }[range];
  const [n, unit, years] = cfg;
  const values = walk(`${seed}-${range}`, n, end, { ...opts, years });
  const ref = new Date(2026, 9, 16);
  return values.map((value, i) => {
    const d = new Date(ref);
    const back = n - 1 - i;
    if (unit === 'd') d.setDate(d.getDate() - Math.round(back * 1.4));
    if (unit === 'w') d.setDate(d.getDate() - back * 7);
    if (unit === 'm') d.setMonth(d.getMonth() - back);
    const label = unit === 'm' ? `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}` : `${d.getDate()} ${MONTHS[d.getMonth()]}`;
    return { label, value };
  });
}

export const spark = (seed, end, up = true) => walk(seed, 24, end, { cagr: up ? 40 : -30, vol: 0.012 });
