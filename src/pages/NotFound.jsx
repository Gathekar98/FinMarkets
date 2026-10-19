import { Link } from 'react-router-dom';
import useSeo from '../seo/useSeo';
import { NOT_FOUND } from '../seo/meta';

export default function NotFound() {
  useSeo(NOT_FOUND);
  return (
    <section className="section">
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 560, padding: '60px var(--gutter)' }}>
        <div className="num" style={{ fontSize: 80, fontWeight: 600, color: 'var(--accent)' }}>404</div>
        <h1 style={{ fontSize: 32 }}>This page has been delisted</h1>
        <p className="muted" style={{ margin: '12px 0 24px' }}>The page you are looking for does not exist or has moved.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Go home</Link>
          <Link to="/funds" className="btn">Browse funds</Link>
        </div>
      </div>
    </section>
  );
}
