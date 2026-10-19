import { Link } from 'react-router-dom';
import { pct, tone } from '../../utils/format';

export function Stars({ value, size }) {
  return (
    <span className="stars" style={size ? { fontSize: size } : undefined} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= value ? '' : 'off'}>★</span>
      ))}
    </span>
  );
}

export function Change({ value, pill, digits = 2, arrow = true }) {
  const t = tone(value);
  return (
    <span className={`change ${t}${pill ? ' pill' : ''}`}>
      {arrow && t !== 'flat' && <span aria-hidden>{t === 'up' ? '▲' : '▼'}</span>}
      {pct(value, digits)}
    </span>
  );
}

export function SectionHead({ eyebrow, title, text, link, linkLabel = 'View all' }) {
  return (
    <div className="sec-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 style={{ marginTop: eyebrow ? 6 : 0 }}>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {link && (
        <Link to={link} className="link-arrow">
          {linkLabel} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

export function Seg({ options, value, onChange, label }) {
  return (
    <div className="seg" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={o} role="tab" aria-selected={value === o} className={value === o ? 'active' : ''} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function Tabs({ options, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {options.map((o) => (
        <button key={o} role="tab" aria-selected={value === o} className={`tab${value === o ? ' active' : ''}`} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function Chips({ options, value, onChange }) {
  return (
    <div className="chips">
      {options.map((o) => (
        <button key={o} className={`chip${value === o ? ' active' : ''}`} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function PageHero({ crumbs = [], eyebrow, title, lead, children }) {
  return (
    <section className="page-hero">
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        {crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} style={{ display: 'contents' }}>
                <span aria-hidden>/</span>
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span className="here">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && <h1 style={{ marginTop: eyebrow ? 8 : 0 }}>{title}</h1>}
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function RiskBadge({ risk }) {
  const map = { Low: 'badge-up', 'Low to Moderate': 'badge-up', Moderate: 'badge-accent', High: 'badge-down', 'Very High': 'badge-down' };
  return <span className={`badge ${map[risk] || ''}`}>{risk} risk</span>;
}
