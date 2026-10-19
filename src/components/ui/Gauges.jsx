const RISK_LEVELS = ['Low', 'Low to Moderate', 'Moderate', 'Moderately High', 'High', 'Very High'];
const RISK_COLORS = ['#2f9e5b', '#7bbf4a', '#d9c23b', '#e9a23b', '#e2703a', '#c63a2f'];

/** Semi-circular riskometer with six bands and a needle. */
export function Riskometer({ risk, size = 220 }) {
  const idx = Math.max(0, RISK_LEVELS.indexOf(risk));
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const seg = Math.PI / RISK_LEVELS.length;
  const arc = (i) => {
    const a0 = Math.PI + i * seg + 0.02;
    const a1 = Math.PI + (i + 1) * seg - 0.02;
    const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`;
  };
  const needleA = Math.PI + (idx + 0.5) * seg;
  const nx = cx + (r - 22) * Math.cos(needleA);
  const ny = cy + (r - 22) * Math.sin(needleA);
  return (
    <figure style={{ margin: 0, textAlign: 'center' }}>
      <svg width={size} height={size / 2 + 22} viewBox={`0 0 ${size} ${size / 2 + 22}`} role="img" aria-label={`Riskometer: ${risk}`} style={{ margin: '0 auto' }}>
        {RISK_LEVELS.map((l, i) => (
          <path key={l} d={arc(i)} stroke={RISK_COLORS[i]} strokeWidth="18" fill="none" opacity={i === idx ? 1 : 0.35} />
        ))}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="7" fill="var(--ink)" />
      </svg>
      <figcaption style={{ fontWeight: 700, marginTop: -4 }}>{risk}</figcaption>
      <div className="xs muted">Investors understand their principal will be at {risk.toLowerCase()} risk</div>
    </figure>
  );
}

/** Ring meter for a 0–10 score. */
export function ScoreRing({ label, value, size = 92, hint }) {
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  const color = value >= 7 ? 'var(--up)' : value >= 4 ? 'var(--accent)' : 'var(--down)';
  const word = value >= 7 ? 'Strong' : value >= 4 ? 'Average' : 'Weak';
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label} ${value} of 10`} style={{ margin: '0 auto' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-2)" strokeWidth="8" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={`${(value / 10) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontFamily="var(--font-num)" fontWeight="600" fontSize="22" fill="var(--ink)">
          {value}
        </text>
      </svg>
      <div style={{ fontWeight: 600, marginTop: 6 }}>{label}</div>
      <div className="xs" style={{ color }}>{word}</div>
      {hint && <div className="xs muted" style={{ marginTop: 4 }}>{hint}</div>}
    </div>
  );
}
