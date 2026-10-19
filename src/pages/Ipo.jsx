import { useState } from 'react';
import { ipos } from '../data/ipos';
import { Chips, PageHero, SectionHead } from '../components/ui/Bits';
import { crore, pct, price } from '../utils/format';

const STATUS_BADGE = { Open: 'badge-up', Upcoming: 'badge-accent', Listed: '' };

export default function Ipo() {
  const [status, setStatus] = useState('All');
  const list = ipos.filter((i) => status === 'All' || i.status === status);
  const open = ipos.filter((i) => i.status === 'Open');

  return (
    <>
      <PageHero crumbs={[{ label: 'Stocks', to: '/stocks' }, { label: 'IPO Monitor' }]} eyebrow="IPO monitor" title="New listings, without the hype" lead="Track every mainboard IPO — what is open, what is coming and how recent listings have actually fared." />

      <section className="section tight">
        <div className="wrap">
          <SectionHead eyebrow="Live now" title="Open for subscription" />
          <div className="grid-2">
            {open.map((i) => (
              <div key={i.id} className="card card-pad" style={{ display: 'grid', gap: 14, borderTop: '4px solid var(--up)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontFamily: 'var(--font-display)' }}>{i.name}</h3>
                    <div className="xs muted">{i.sector} · Issue size {crore(i.size)}</div>
                  </div>
                  <span className="badge badge-up">Closes {i.closes}</span>
                </div>
                <div className="kpis">
                  <div><div className="kpi-label">Price band</div><div className="kpi-value" style={{ fontSize: 16 }}>{i.priceBand}</div></div>
                  <div><div className="kpi-label">Lot size</div><div className="kpi-value" style={{ fontSize: 16 }}>{i.lot} shares</div></div>
                  <div><div className="kpi-label">Subscribed</div><div className="kpi-value" style={{ fontSize: 16 }}>{i.subscribed}×</div></div>
                </div>
                <div>
                  <div className="xs muted" style={{ marginBottom: 6 }}>Subscription so far</div>
                  <div className="bar-track" style={{ height: 10 }}><div className="bar-fill" style={{ width: `${Math.min(100, (i.subscribed / 20) * 100)}%`, background: 'var(--up)' }} /></div>
                </div>
                <div className="note">Our take: read the offer document’s “risk factors” and use-of-proceeds before applying. Listing gains are never guaranteed.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <SectionHead eyebrow="Calendar" title="All IPOs" />
          <div style={{ marginBottom: 16 }}><Chips options={['All', 'Open', 'Upcoming', 'Listed']} value={status} onChange={setStatus} /></div>
          <div className="card table-wrap">
            <table className="data">
              <thead>
                <tr><th>Company</th><th>Status</th><th>Dates</th><th className="r">Price band</th><th className="r">Issue size</th><th className="r">Subscribed</th><th className="r">Listing gain</th><th className="r">Current</th></tr>
              </thead>
              <tbody>
                {list.map((i) => (
                  <tr key={i.id}>
                    <td><span className="cell-title">{i.name}</span><div className="cell-sub">{i.sector}</div></td>
                    <td><span className={`badge ${STATUS_BADGE[i.status]}`}>{i.status}</span></td>
                    <td className="small">{i.opens} – {i.closes}</td>
                    <td className="r num">{i.priceBand}</td>
                    <td className="r num">{crore(i.size)}</td>
                    <td className="r num">{i.subscribed ? `${i.subscribed}×` : '—'}</td>
                    <td className={`r num ${i.listingGain > 0 ? 'up' : i.listingGain < 0 ? 'down' : ''}`}>{i.listingGain != null ? pct(i.listingGain, 1) : '—'}</td>
                    <td className="r num">{i.current ? `₹${price(i.current)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
