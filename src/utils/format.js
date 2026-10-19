const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const inr0 = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const num = (v, digits = 2) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(v);

export const price = (v) => inr.format(v);
export const rupee = (v) => '₹' + inr0.format(Math.round(v));

/** Compact Indian notation: 1,25,000 -> ₹1.25 L, 3,40,00,000 -> ₹3.40 Cr */
export const rupeeShort = (v) => {
  const abs = Math.abs(v);
  if (abs >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return rupee(v);
};

/** Values already expressed in crore */
export const crore = (v) => `₹${inr0.format(Math.round(v))} Cr`;

export const pct = (v, digits = 2) => (v == null ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(digits)}%`);
export const pctPlain = (v, digits = 1) => (v == null ? '—' : `${v.toFixed(digits)}%`);

export const tone = (v) => (v > 0 ? 'up' : v < 0 ? 'down' : 'flat');
