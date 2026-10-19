import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { demoHoldings } from '../data/portfolio';
import { PageHero } from '../components/ui/Bits';
import { Donut } from '../components/ui/Charts';
import { pct, rupee, rupeeShort } from '../utils/format';

const KINDS = ['Fund', 'Stock', 'Gold', 'FD'];

function AddForm({ onAdd }) {
  const [form, setForm] = useState({ kind: 'Fund', name: '', invested: '', current: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.invested) return;
    const invested = Number(form.invested);
    const current = Number(form.current) || invested;
    onAdd({ id: `u${Date.now()}`, kind: form.kind, name: form.name, invested, current, xirr: null, since: 'Oct 2026' });
    setForm({ kind: form.kind, name: '', invested: '', current: '' });
  };
  return (
    <form className="filters" onSubmit={submit} style={{ borderBottom: 0, borderTop: '1px solid var(--line)' }}>
      <div className="field">
        <label htmlFor="pk">Type</label>
        <select id="pk" className="select" value={form.kind} onChange={set('kind')}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select>
      </div>
      <div className="field grow">
        <label htmlFor="pn">Name</label>
        <input id="pn" className="input" placeholder="e.g. Banyan Liquid Fund" value={form.name} onChange={set('name')} />
      </div>
      <div className="field">
        <label htmlFor="pi">Invested (₹)</label>
        <input id="pi" className="input" type="number" min="0" value={form.invested} onChange={set('invested')} />
      </div>
      <div className="field">
        <label htmlFor="pc">Current value (₹)</label>
        <input id="pc" className="input" type="number" min="0" value={form.current} onChange={set('current')} />
      </div>
      <button className="btn btn-primary" type="submit">Add holding</button>
    </form>
  );
}

export default function Portfolio() {
  const [holdings, setHoldings] = useState(demoHoldings);
  const totals = useMemo(() => {
    const invested = holdings.reduce((a, h) => a + h.invested, 0) || 1;
    const current = holdings.reduce((a, h) => a + h.current, 0) || 1;
    const byKind = KINDS.map((k) => ({ name: k === 'FD' ? 'Fixed deposits' : `${k}s`, value: +((holdings.filter((h) => h.kind === k).reduce((a, h) => a + h.current, 0) / current) * 100).toFixed(1) })).filter((d) => d.value > 0);
    return { invested, current, gain: current - invested, byKind };
  }, [holdings]);
  const equityShare = holdings.filter((h) => h.kind === 'Fund' || h.kind === 'Stock').reduce((a, h) => a + h.current, 0) / totals.current;

  return (
    <>
      <PageHero crumbs={[{ label: 'Portfolio' }]} eyebrow="Portfolio tracker · Free" title="Every rupee your family owns. One place." lead="Funds, stocks, gold and deposits — rated, tracked and checked for overlap and cost. This is a demo portfolio; add your own holdings below." />

      <section className="section tight">
        <div className="wrap pf-summary">
          <div className="card pf-hero">
            <div className="xs" style={{ opacity: 0.8 }}>Current value</div>
            <div className="num big">{rupee(totals.current)}</div>
            <div className="small" style={{ marginTop: 4 }}>
              <span style={{ color: '#7ef0b4', fontWeight: 600 }}>{rupee(totals.gain)} ({pct((totals.gain / totals.invested) * 100)})</span> overall gain
            </div>
            <div className="pf-stats">
              <div><div className="xs" style={{ opacity: 0.8 }}>Invested</div><div className="num">{rupeeShort(totals.invested)}</div></div>
              <div><div className="xs" style={{ opacity: 0.8 }}>Portfolio XIRR</div><div className="num">15.2%</div></div>
              <div><div className="xs" style={{ opacity: 0.8 }}>Holdings</div><div className="num">{holdings.length}</div></div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Asset mix</h3><span className="xs muted">by current value</span></div>
            <div className="card-pad"><Donut data={totals.byKind} height={170} inner={48} center={<><div className="num" style={{ fontWeight: 700, fontSize: 18 }}>{Math.round(equityShare * 100)}%</div><div className="xs muted">equity</div></>} /></div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap grid-3">
          {[
            { t: 'Overlap check', v: '23%', d: 'Your flexi-cap and index fund share 23% of holdings. Moderate — no action needed.', tone: 'badge-accent' },
            { t: 'Cost check', v: '0.48%', d: 'Weighted expense ratio. That is lower than 80% of investors we track.', tone: 'badge-up' },
            { t: 'Rating check', v: '1 to review', d: 'One holding has dropped to 3 stars. See whether it still deserves its place.', tone: 'badge-down' },
          ].map((x) => (
            <div key={x.t} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3>{x.t}</h3><span className={`badge ${x.tone}`}>{x.v}</span></div>
              <p className="small muted" style={{ marginTop: 8 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <div className="card">
            <div className="card-head"><h3>Holdings</h3><span className="xs muted">Demo data · changes are kept only for this visit</span></div>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Holding</th><th>Type</th><th className="r">Invested</th><th className="r">Current</th><th className="r">Gain</th><th className="r">XIRR</th><th className="r">Weight</th><th /></tr></thead>
                <tbody>
                  {holdings.map((h) => {
                    const g = h.current - h.invested;
                    const to = h.refId ? (h.kind === 'Fund' ? `/funds/${h.refId}` : `/stocks/${h.refId}`) : null;
                    return (
                      <tr key={h.id}>
                        <td>{to ? <Link to={to} className="cell-title">{h.name}</Link> : <span className="cell-title">{h.name}</span>}<div className="cell-sub">Since {h.since}</div></td>
                        <td><span className="badge">{h.kind}</span></td>
                        <td className="r num">{rupee(h.invested)}</td>
                        <td className="r num" style={{ fontWeight: 600 }}>{rupee(h.current)}</td>
                        <td className={`r num ${g >= 0 ? 'up' : 'down'}`}>{pct((g / h.invested) * 100, 1)}</td>
                        <td className="r num">{h.xirr ? `${h.xirr}%` : '—'}</td>
                        <td className="r num">{((h.current / totals.current) * 100).toFixed(1)}%</td>
                        <td className="r"><button className="btn btn-ghost btn-sm" onClick={() => setHoldings(holdings.filter((x) => x.id !== h.id))} aria-label={`Remove ${h.name}`}>✕</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <AddForm onAdd={(h) => setHoldings([...holdings, h])} />
          </div>
        </div>
      </section>
    </>
  );
}
