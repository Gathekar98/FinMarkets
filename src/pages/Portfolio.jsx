import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { demoHoldings } from '../data/portfolio';
import { api, useApi, LIVE } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { useHoldings } from '../api/userData';
import { PageHero } from '../components/ui/Bits';
import { Donut } from '../components/ui/Charts';
import { ErrorBox } from '../components/ui/Status';
import { pct, rupee, rupeeShort } from '../utils/format';

const KINDS = ['Fund', 'Stock', 'Gold', 'FD', 'Other'];
const LIVE_KINDS = ['Fund', 'Stock'];

/** Annualised return for dated cash flows (bisection). */
function xirr(flows) {
  if (flows.length < 2) return null;
  const t0 = Math.min(...flows.map((f) => f.t));
  const npv = (r) => flows.reduce((a, f) => a + f.amt / Math.pow(1 + r, (f.t - t0) / 31557600000), 0);
  let lo = -0.99; let hi = 10;
  if (npv(lo) * npv(hi) > 0) return null;
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (npv(m) > 0) lo = m; else hi = m; }
  return ((lo + hi) / 2) * 100;
}

function PickInstrument({ kind, onPick }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState([]);
  useEffect(() => {
    if (q.trim().length < 2) { setRes([]); return undefined; }
    const t = setTimeout(() => api(`/api/search?q=${encodeURIComponent(q.trim())}`).then((r) => setRes(r.filter((x) => x.type === kind))).catch(() => setRes([])), 250);
    return () => clearTimeout(t);
  }, [q, kind]);
  return (
    <div className="field grow" style={{ position: 'relative' }}>
      <label htmlFor="pk-q">{kind === 'Fund' ? 'Find fund' : 'Find stock'}</label>
      <input id="pk-q" className="input" placeholder={kind === 'Fund' ? 'e.g. Parag Parikh Flexi Cap' : 'e.g. Infosys or INFY'} value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      {res.length > 0 && (
        <div className="search-pop" style={{ right: 0 }}>
          {res.map((r) => (
            <button type="button" key={r.id} onClick={() => { onPick(r); setQ(r.label); setRes([]); }}>
              <span style={{ flex: 1, textAlign: 'left' }}><strong style={{ display: 'block' }}>{r.label}</strong><span className="xs muted">{r.sub}</span></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AddForm({ onAdd }) {
  const empty = { kind: 'Fund', ref: null, name: '', units: '', invested: '', current: '', buy_date: '' };
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const liveKind = LIVE_KINDS.includes(form.kind);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (liveKind && !form.ref) return setErr(`Pick a ${form.kind.toLowerCase()} from the search results.`);
    if (!form.name.trim() || !Number(form.invested)) return setErr('Enter a name and the amount invested.');
    if (liveKind && !Number(form.units)) return setErr(form.kind === 'Fund' ? 'Enter the number of units you hold.' : 'Enter the number of shares you hold.');
    setBusy(true);
    try {
      await onAdd({
        kind: form.kind,
        ref: form.ref,
        name: form.name.trim(),
        units: liveKind ? Number(form.units) : null,
        invested: Number(form.invested),
        current: liveKind ? null : Number(form.current) || Number(form.invested),
        buy_date: form.buy_date || null,
      });
      setForm({ ...empty, kind: form.kind });
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} style={{ borderTop: '1px solid var(--line)' }}>
      <div className="filters" style={{ borderBottom: 0 }}>
        <div className="field">
          <label htmlFor="pk">Type</label>
          <select id="pk" className="select" value={form.kind} onChange={(e) => setForm({ ...empty, kind: e.target.value })}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select>
        </div>
        {liveKind
          ? <PickInstrument key={form.kind} kind={form.kind} onPick={(r) => setForm((f) => ({ ...f, ref: r.id, name: r.label }))} />
          : <div className="field grow"><label htmlFor="pn">Name</label><input id="pn" className="input" placeholder="e.g. SBI Fixed Deposit" value={form.name} onChange={set('name')} /></div>}
        {liveKind && <div className="field"><label htmlFor="pu">{form.kind === 'Fund' ? 'Units' : 'Shares'}</label><input id="pu" className="input" type="number" min="0" step="any" value={form.units} onChange={set('units')} /></div>}
        <div className="field"><label htmlFor="pi">Invested (₹)</label><input id="pi" className="input" type="number" min="0" value={form.invested} onChange={set('invested')} /></div>
        {!liveKind && <div className="field"><label htmlFor="pc">Current value (₹)</label><input id="pc" className="input" type="number" min="0" value={form.current} onChange={set('current')} /></div>}
        <div className="field"><label htmlFor="pd">Bought on</label><input id="pd" className="input" type="date" value={form.buy_date} onChange={set('buy_date')} /></div>
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Adding…' : 'Add holding'}</button>
      </div>
      {err && <div className="form-msg err" style={{ margin: '0 20px 16px' }}>{err}</div>}
    </form>
  );
}

export default function Portfolio() {
  const { user, configured } = useAuth();
  const mine = useHoldings();
  const holdings = user ? mine.rows : demoHoldings;

  const stocks = holdings.filter((h) => h.kind === 'Stock' && h.ref).map((h) => h.ref);
  const funds = holdings.filter((h) => h.kind === 'Fund' && h.ref).map((h) => h.ref);
  const { data: prices, error } = useApi(holdings.length ? `/api/prices?stocks=${[...new Set(stocks)].join(',')}&funds=${[...new Set(funds)].join(',')}` : null, { refresh: LIVE });

  const rows = useMemo(() => holdings.map((h) => {
    const live = h.kind === 'Stock' ? prices?.stocks?.[h.ref] : h.kind === 'Fund' ? prices?.funds?.[h.ref] : null;
    const unitPrice = live ? live.price ?? live.nav : null;
    const current = LIVE_KINDS.includes(h.kind) ? (unitPrice != null && h.units ? unitPrice * h.units : null) : Number(h.current ?? h.invested);
    const dayChg = live?.changePct ?? null;
    const years = h.buy_date ? (Date.now() - new Date(h.buy_date).getTime()) / 31557600000 : null;
    const cagr = current != null && years && years > 0.25 ? (Math.pow(current / h.invested, 1 / years) - 1) * 100 : null;
    return { ...h, unitPrice, current, dayChg, cagr };
  }), [holdings, prices]);

  const totals = useMemo(() => {
    const valued = rows.filter((r) => r.current != null);
    const invested = valued.reduce((a, h) => a + Number(h.invested), 0);
    const current = valued.reduce((a, h) => a + h.current, 0);
    const today = valued.reduce((a, h) => a + (h.dayChg != null ? h.current - h.current / (1 + h.dayChg / 100) : 0), 0);
    const byKind = KINDS.map((k) => ({ name: { Fund: 'Mutual funds', Stock: 'Stocks', Gold: 'Gold', FD: 'Fixed deposits', Other: 'Other' }[k], value: current ? +((valued.filter((h) => h.kind === k).reduce((a, h) => a + h.current, 0) / current) * 100).toFixed(1) : 0 })).filter((d) => d.value > 0);
    const flows = valued.filter((h) => h.buy_date).map((h) => ({ t: new Date(h.buy_date).getTime(), amt: -Number(h.invested) }));
    const portfolioXirr = flows.length ? xirr([...flows, { t: Date.now(), amt: valued.filter((h) => h.buy_date).reduce((a, h) => a + h.current, 0) }]) : null;
    const equity = valued.filter((h) => h.kind === 'Stock' || (h.kind === 'Fund' && !/Bond|Debt|Liquid|Gilt|Money Market|Overnight/i.test(h.name))).reduce((a, h) => a + h.current, 0);
    return { invested, current, gain: current - invested, today, byKind, xirr: portfolioXirr, equityShare: current ? equity / current : 0 };
  }, [rows]);

  return (
    <>
      <PageHero crumbs={[{ label: 'Portfolio' }]} eyebrow="Portfolio tracker · Free" title={user ? 'Your portfolio' : 'Every rupee your family owns. One place.'} lead={user ? 'Funds and stocks are valued at live prices; refreshed every minute while this page is open.' : 'Funds, stocks, gold and deposits — valued at live prices. Below is a sample portfolio; create a free account to track your own.'}>
        {!user && (
          <div className="detail-actions">
            <Link to="/signup" className="btn btn-accent">Create free account</Link>
            <Link to="/login" state={{ from: '/portfolio' }} className="btn">Sign in</Link>
          </div>
        )}
      </PageHero>

      <section className="section tight">
        <div className="wrap">
          <ErrorBox error={error || mine.error} />
          {user && !mine.loading && holdings.length === 0 ? (
            <div className="card card-pad" style={{ textAlign: 'center', padding: 40 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Add your first holding</h3>
              <p className="muted" style={{ margin: '8px 0 0' }}>Search for any mutual fund or NSE stock below, enter your units and what you paid — we'll do the rest.</p>
            </div>
          ) : (
            <div className="pf-summary">
              <div className="card pf-hero">
                <div className="xs" style={{ opacity: 0.8 }}>Current value {user ? '' : '(sample)'}</div>
                <div className="num big">{rupee(totals.current)}</div>
                <div className="small" style={{ marginTop: 4 }}>
                  <span style={{ color: totals.gain >= 0 ? '#7ef0b4' : '#ffb1a8', fontWeight: 600 }}>{rupee(totals.gain)} ({pct(totals.invested ? (totals.gain / totals.invested) * 100 : 0)})</span> overall
                  {' · '}
                  <span style={{ color: totals.today >= 0 ? '#7ef0b4' : '#ffb1a8', fontWeight: 600 }}>{totals.today >= 0 ? '+' : ''}{rupee(totals.today)}</span> today
                </div>
                <div className="pf-stats">
                  <div><div className="xs" style={{ opacity: 0.8 }}>Invested</div><div className="num">{rupeeShort(totals.invested)}</div></div>
                  <div><div className="xs" style={{ opacity: 0.8 }}>Portfolio XIRR</div><div className="num">{totals.xirr != null ? `${totals.xirr.toFixed(1)}%` : '—'}</div></div>
                  <div><div className="xs" style={{ opacity: 0.8 }}>Holdings</div><div className="num">{holdings.length}</div></div>
                </div>
              </div>
              <div className="card">
                <div className="card-head"><h3>Asset mix</h3><span className="xs muted">by current value</span></div>
                <div className="card-pad">
                  {totals.byKind.length ? <Donut data={totals.byKind} height={170} inner={48} center={<><div className="num" style={{ fontWeight: 700, fontSize: 18 }}>{Math.round(totals.equityShare * 100)}%</div><div className="xs muted">equity</div></>} /> : <div className="empty small">Loading prices…</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <div className="card">
            <div className="card-head">
              <h3>Holdings</h3>
              <span className="xs muted">{user ? 'Saved to your account' : 'Sample data — sign in to save your own'}</span>
            </div>
            {holdings.length > 0 && (
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Holding</th><th>Type</th><th className="r">Units</th><th className="r">Price</th><th className="r">Invested</th><th className="r">Current</th><th className="r">Gain</th><th className="r">CAGR</th><th className="r">Today</th>{user && <th />}</tr></thead>
                  <tbody>
                    {rows.map((h) => {
                      const g = h.current != null ? h.current - h.invested : null;
                      const to = h.ref ? (h.kind === 'Fund' ? `/funds/${h.ref}` : h.kind === 'Stock' ? `/stocks/${h.ref}` : null) : null;
                      return (
                        <tr key={h.id}>
                          <td>{to ? <Link to={to} className="cell-title">{h.name}</Link> : <span className="cell-title">{h.name}</span>}<div className="cell-sub">{h.buy_date ? `Since ${new Date(h.buy_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : ''}</div></td>
                          <td><span className="badge">{h.kind}</span></td>
                          <td className="r num">{h.units ? Number(h.units).toLocaleString('en-IN', { maximumFractionDigits: 3 }) : '—'}</td>
                          <td className="r num">{h.unitPrice != null ? `₹${h.unitPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : '—'}</td>
                          <td className="r num">{rupee(h.invested)}</td>
                          <td className="r num" style={{ fontWeight: 600 }}>{h.current != null ? rupee(h.current) : '…'}</td>
                          <td className={`r num ${g >= 0 ? 'up' : 'down'}`}>{g != null ? pct((g / h.invested) * 100, 1) : '—'}</td>
                          <td className="r num">{h.cagr != null ? `${h.cagr.toFixed(1)}%` : '—'}</td>
                          <td className={`r num ${h.dayChg >= 0 ? 'up' : 'down'}`}>{h.dayChg != null ? pct(h.dayChg, 2) : '—'}</td>
                          {user && <td className="r"><button className="btn btn-ghost btn-sm" onClick={() => mine.remove(h.id)} aria-label={`Remove ${h.name}`}>✕</button></td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {user ? <AddForm onAdd={mine.add} /> : (
              <div className="card-pad" style={{ borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span className="small muted">{configured ? 'Sign in to add your own funds, stocks, FDs and gold — saved securely to your account.' : 'Accounts are not switched on yet.'}</span>
                <Link to="/signup" className="btn btn-primary">Track my portfolio</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
