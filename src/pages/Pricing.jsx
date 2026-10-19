import { Link } from 'react-router-dom';
import { plans } from '../data/plans';
import { PageHero, SectionHead } from '../components/ui/Bits';
import { rupee } from '../utils/format';

const COMPARE = [
  ['Portfolio tracking & X-Ray', true, true, true],
  ['Fund and stock ratings', true, true, true],
  ['Model stock portfolios', false, true, false],
  ['Buy / sell alerts on stocks', false, true, false],
  ['Goal-based fund portfolios', false, false, true],
  ['Annual portfolio review', false, false, true],
  ['Ask-the-analyst', false, true, true],
];

const FAQ = [
  ['Can I cancel anytime?', 'Yes. Cancel from your account page and you will not be charged for the next cycle. Refunds are available within 7 days of purchase.'],
  ['Do you earn commissions from fund houses?', 'No. We do not accept commissions, advertising from fund houses, or payments to rate products. Our only income is from readers.'],
  ['Is this registered investment advice?', 'Our advisory services operate under the relevant regulatory registration. Free content on this site is for education only.'],
];

export default function Pricing() {
  return (
    <>
      <PageHero crumbs={[{ label: 'Subscriptions' }]} eyebrow="Subscriptions" title="Research that pays for itself" lead="Independent, commission-free advice. Choose the help you need — or stay on the free tracker forever." />
      <section className="section">
        <div className="wrap plan-grid">
          {plans.map((p) => (
            <div key={p.id} id={p.id} className={`plan card${p.highlight ? ' hl' : ''}`}>
              {p.highlight && <span className="badge badge-accent" style={{ alignSelf: 'flex-start' }}>Most popular</span>}
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>{p.name}</h3>
              <p className="small" style={{ opacity: 0.85 }}>{p.tagline}</p>
              <div><span className="price">{p.price ? rupee(p.price) : '₹0'}</span> <span className="small" style={{ opacity: 0.7 }}>{p.period}</span></div>
              <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <Link to={p.to} className={`btn ${p.highlight ? 'btn-accent' : 'btn-primary'} btn-block`} style={{ marginTop: 'auto' }}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <SectionHead eyebrow="Compare" title="What each plan includes" />
          <div className="card table-wrap">
            <table className="data compare">
              <thead><tr><th>Feature</th>{plans.map((p) => <th key={p.id}>{p.name}</th>)}</tr></thead>
              <tbody>
                {COMPARE.map(([f, ...v]) => (
                  <tr key={f}><td>{f}</td>{v.map((x, i) => <td key={i} className={x ? 'up' : 'muted'} style={{ fontWeight: 700 }}>{x ? '✓' : '—'}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <SectionHead eyebrow="FAQ" title="Before you subscribe" />
          {FAQ.map(([q, a], i) => (
            <details key={q} className="faq" open={i === 0}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </section>
    </>
  );
}
