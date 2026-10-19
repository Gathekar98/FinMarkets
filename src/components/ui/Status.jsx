/** Loading skeletons, error boxes and the live badge, shared by every data-driven page. */

export function Skeleton({ h = 16, w = '100%', r = 6, style }) {
  return <span className="skel" style={{ height: h, width: w, borderRadius: r, ...style }} aria-hidden />;
}

export function SkeletonRows({ rows = 6, h = 44 }) {
  return (
    <div style={{ display: 'grid', gap: 8, padding: 16 }} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} h={h} />)}
    </div>
  );
}

export function ErrorBox({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="error-box" role="alert">
      <span>{error.message || 'Something went wrong loading this data.'}</span>
      {onRetry && <button className="btn btn-sm" onClick={onRetry}>Retry</button>}
    </div>
  );
}

export function LiveBadge({ state, time }) {
  const open = state === 'REGULAR';
  return (
    <span className={`live-badge${open ? ' on' : ''}`} title={time ? `Last update ${new Date(time).toLocaleString('en-IN')}` : undefined}>
      <span className="dot" aria-hidden />
      {open ? 'Live · 15 min delayed' : 'Market closed'}
    </span>
  );
}
