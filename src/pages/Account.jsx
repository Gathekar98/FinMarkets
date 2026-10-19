import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useWatchlist } from '../api/userData';
import { useApi, LIVE } from '../api/client';
import { Change, PageHero, Stars } from '../components/ui/Bits';
import { num } from '../utils/format';

function Watchlist() {
  const { items, toggle } = useWatchlist();
  const stocks = items.filter((i) => i.kind === 'Stock').map((i) => i.ref);
  const funds = items.filter((i) => i.kind === 'Fund').map((i) => i.ref);
  const url = items.length ? `/api/prices?stocks=${stocks.join(',')}&funds=${funds.join(',')}` : null;
  const { data } = useApi(url, { refresh: LIVE });

  return (
    <section id="watchlist" className="card" style={{ scrollMarginTop: 120 }}>
      <div className="card-head"><h3>Watchlist</h3><span className="xs muted">{items.length} items · prices refresh every minute</span></div>
      {items.length === 0 ? (
        <div className="empty small">Nothing here yet. Use “+ Watchlist” on any stock or fund page to follow it.</div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Name</th><th>Type</th><th className="r">Price / NAV</th><th className="r">1D</th><th /></tr></thead>
            <tbody>
              {items.map((i) => {
                const live = i.kind === 'Stock' ? data?.stocks?.[i.ref] : data?.funds?.[i.ref];
                return (
                  <tr key={i.id}>
                    <td><Link className="cell-title" to={i.kind === 'Stock' ? `/stocks/${i.ref}` : `/funds/${i.ref}`}>{i.name || live?.name || i.ref}</Link>
                      {i.kind === 'Fund' && live?.rating && <div><Stars value={live.rating} size={11} /></div>}</td>
                    <td><span className="badge">{i.kind}</span></td>
                    <td className="r num">{live ? `₹${num(live.price ?? live.nav)}` : '—'}</td>
                    <td className="r">{live?.changePct != null ? <Change value={live.changePct} arrow={false} /> : '—'}</td>
                    <td className="r"><button className="btn btn-ghost btn-sm" onClick={() => toggle(i.kind, i.ref)} aria-label={`Remove ${i.name}`}>✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function Account() {
  const { user, displayName, updateProfile, updatePassword, signOut } = useAuth();
  const [name, setName] = useState(displayName);
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState(null);

  const save = async (fn, ok) => {
    try { await fn(); setMsg({ ok: true, text: ok }); } catch (e) { setMsg({ ok: false, text: e.message }); }
  };

  return (
    <>
      <PageHero crumbs={[{ label: 'Account' }]} eyebrow="Your account" title={`Hello, ${displayName || 'investor'}`} lead={user?.email} />
      <section className="section tight">
        <div className="wrap" style={{ display: 'grid', gap: 20 }}>
          <Watchlist />
          <div className="grid-2">
            <form className="card card-pad" style={{ display: 'grid', gap: 14 }} onSubmit={(e) => { e.preventDefault(); save(() => updateProfile(name.trim()), 'Profile updated.'); }}>
              <h3>Profile</h3>
              <div className="field"><label htmlFor="ac-name">Full name</label><input id="ac-name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="field"><label htmlFor="ac-email">Email</label><input id="ac-email" className="input" value={user?.email || ''} disabled /></div>
              <button className="btn btn-primary" style={{ justifySelf: 'start' }}>Save profile</button>
            </form>
            <form className="card card-pad" style={{ display: 'grid', gap: 14 }} onSubmit={(e) => { e.preventDefault(); if (pw.length < 8) return setMsg({ ok: false, text: 'Password must be at least 8 characters.' }); save(() => updatePassword(pw).then(() => setPw('')), 'Password changed.'); }}>
              <h3>Change password</h3>
              <div className="field"><label htmlFor="ac-pw">New password</label><input id="ac-pw" type="password" className="input" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn btn-primary">Update password</button>
                <button type="button" className="btn" onClick={signOut}>Sign out</button>
              </div>
            </form>
          </div>
          {msg && <div className={`form-msg ${msg.ok ? 'ok' : 'err'}`} role="status">{msg.text}</div>}
        </div>
      </section>
    </>
  );
}
