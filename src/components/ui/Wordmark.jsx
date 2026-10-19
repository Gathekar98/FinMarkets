// finMarkets wordmark — "Portfolio a": the a in Markets is a portfolio pie chart.
// Sized in em, so set font-size on the parent (or pass `size`) to scale it.
// Colours come from CSS variables, so it follows light/dark mode; `onDark` forces
// the light-on-navy palette (e.g. the footer).

export function PortfolioA({ className }) {
  // Two arcs on one ring: ~70% brand green, ~25% gold, small gaps between them.
  return (
    <svg className={className} viewBox="0 0 22 21" aria-hidden focusable="false">
      <circle cx="9.5" cy="11" r="7.5" fill="none" stroke="var(--wm-main)" strokeWidth="4" strokeDasharray="33 14.2" transform="rotate(-90 9.5 11)" />
      <circle cx="9.5" cy="11" r="7.5" fill="none" stroke="var(--wm-slice)" strokeWidth="4" strokeDasharray="12 35.2" strokeDashoffset="-34.5" transform="rotate(-90 9.5 11)" />
      <path d="M19.5 4V19" stroke="var(--wm-ink)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function Wordmark({ size, onDark = false, className = '' }) {
  return (
    <span
      className={`wordmark${onDark ? ' on-dark' : ''} ${className}`}
      style={size ? { fontSize: size } : undefined}
      role="img"
      aria-label="finMarkets"
    >
      <span className="wm-light" aria-hidden>fin</span>
      <span className="wm-bold" aria-hidden>M</span>
      <PortfolioA className="wm-a" />
      <span className="wm-bold" aria-hidden>rkets</span>
    </span>
  );
}
