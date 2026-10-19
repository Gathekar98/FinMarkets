import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { navItems } from './nav';
import { num } from '../../utils/format';
import { api, useApi, LIVE } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="finMarkets home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="8" fill="var(--brand)" />
        <path d="M7 22l6-7 4 4 8-10" stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>fin<b>Markets</b></span>
    </Link>
  );
}

function TickerTape() {
  const { data } = useApi('/api/market/overview', { refresh: LIVE });
  if (!data) return <div className="ticker" style={{ height: 33 }} aria-hidden />;
  const items = [...data.indian.slice(0, 6), ...data.global.slice(0, 4), ...data.commodities];
  const row = (
    <>
      {items.map((x) => (
        <span className="tick" key={x.symbol}>
          <span className="tick-name">{x.name}</span>
          <span className="num">{num(x.value)}</span>
          <span className={`num ${x.changePct >= 0 ? 'up' : 'down'}`}>{x.changePct >= 0 ? '▲' : '▼'} {Math.abs(x.changePct).toFixed(2)}%</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="ticker" aria-label="Market ticker, 15 minutes delayed">
      <div className="ticker-track">
        {row}
        {row}
      </div>
    </div>
  );
}

function Search() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const term = q.trim();

  useEffect(() => {
    if (term.length < 2) { setResults([]); return undefined; }
    setBusy(true);
    const t = setTimeout(() => {
      api(`/api/search?q=${encodeURIComponent(term)}`)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setBusy(false));
    }, 250);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const to = (r) => (r.type === 'Fund' ? `/funds/${r.id}` : `/stocks/${r.id}`);
  const go = (r) => { setQ(''); setOpen(false); navigate(to(r)); };

  return (
    <div className="search" ref={ref}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Enter' && results[0] && go(results[0])}
        placeholder="Search any stock or fund…"
        aria-label="Search stocks and mutual funds"
      />
      {open && term.length >= 2 && (
        <div className="search-pop">
          {busy && results.length === 0 && <div className="empty small">Searching…</div>}
          {!busy && results.length === 0 && <div className="empty small">No matches for “{q}”</div>}
          {results.map((r) => (
            <button key={`${r.type}-${r.id}`} onClick={() => go(r)}>
              <span className={`badge ${r.type === 'Fund' ? 'badge-brand' : 'badge-accent'}`}>{r.type}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ display: 'block', fontWeight: 600 }}>{r.label}</span>
                <span className="xs muted">{r.sub}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { user, displayName, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) return <Link to="/login" className="btn btn-sm hide-sm">Sign in</Link>;

  const initials = displayName.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="user-menu" ref={ref}>
      <button className="avatar" onClick={() => setOpen((o) => !o)} aria-label="Account menu" aria-expanded={open}>{initials}</button>
      {open && (
        <div className="user-pop" role="menu">
          <div className="user-pop-head">
            <strong>{displayName}</strong>
            <span className="xs muted">{user.email}</span>
          </div>
          <Link to="/portfolio" role="menuitem" onClick={() => setOpen(false)}>My portfolio</Link>
          <Link to="/account#watchlist" role="menuitem" onClick={() => setOpen(false)}>Watchlist</Link>
          <Link to="/account" role="menuitem" onClick={() => setOpen(false)}>Account settings</Link>
          <button role="menuitem" onClick={async () => { setOpen(false); await signOut(); navigate('/'); }}>Sign out</button>
        </div>
      )}
    </div>
  );
}

function DrawerAuth() {
  const { user, signOut } = useAuth();
  if (user) {
    return (
      <>
        <Link to="/account" className="btn btn-block">My account</Link>
        <button className="btn btn-ghost btn-block" onClick={signOut}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <Link to="/login" className="btn btn-block">Sign in</Link>
      <Link to="/signup" className="btn btn-primary btn-block">Create free account</Link>
    </>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('fm-theme') || ''; } catch { return ''; }
  });
  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    else document.documentElement.removeAttribute('data-theme');
    try { theme ? localStorage.setItem('fm-theme', theme) : localStorage.removeItem('fm-theme'); } catch { /* ignore */ }
  }, [theme]);
  const isDark = theme ? theme === 'dark' : window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return (
    <button className="icon-btn" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      )}
    </button>
  );
}

export default function Header() {
  const [drawer, setDrawer] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();

  useEffect(() => { setDrawer(false); setOpenMenu(null); }, [location.pathname, location.search, location.hash]);

  return (
    <header className="site-header">
      <TickerTape />
      <div className="header-main">
        <div className="wrap header-row">
          <Logo />
          <nav className="nav" aria-label="Primary">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`nav-item${openMenu === item.label ? ' open' : ''}`}
                onMouseEnter={() => item.columns && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <NavLink to={item.to} className="nav-link">
                  {item.label}
                  {item.columns && <span className="caret" aria-hidden>▾</span>}
                </NavLink>
                {item.columns && (
                  <div className="mega" role="menu">
                    <div className="mega-inner">
                      {item.columns.map((col) => (
                        <div key={col.title}>
                          <div className="mega-title">{col.title}</div>
                          {col.links.map((l) => (
                            <Link key={l.label} to={l.to} className="mega-link" role="menuitem">
                              <span>{l.label}</span>
                              {l.desc && <small>{l.desc}</small>}
                            </Link>
                          ))}
                        </div>
                      ))}
                      {item.promo && (
                        <Link to={item.promo.to} className="mega-promo">
                          <span className="badge badge-accent">Premium</span>
                          <strong>{item.promo.title}</strong>
                          <span>{item.promo.text}</span>
                          <span className="link-arrow" style={{ color: 'var(--accent)' }}>Learn more →</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="header-actions">
            <Search />
            <ThemeToggle />
            <Link to="/pricing" className="btn btn-accent btn-sm hide-sm">Subscribe</Link>
            <UserMenu />
            <button className="icon-btn burger" onClick={() => setDrawer(true)} aria-label="Open menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      {drawer && (
        <div className="drawer-backdrop" onClick={() => setDrawer(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()} aria-label="Menu">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Logo />
              <button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close menu">✕</button>
            </div>
            {navItems.map((item) => (
              <details key={item.label} className="drawer-group" open={false}>
                <summary>
                  <Link to={item.to}>{item.label}</Link>
                  {item.columns && <span aria-hidden>+</span>}
                </summary>
                {item.columns?.flatMap((c) => c.links).map((l) => (
                  <Link key={l.label} to={l.to} className="drawer-link">{l.label}</Link>
                ))}
              </details>
            ))}
            <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
              <Link to="/pricing" className="btn btn-accent btn-block">Subscribe</Link>
              <DrawerAuth />
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
