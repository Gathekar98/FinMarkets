import { Link, useParams } from 'react-router-dom';
import { stockById, stockFinancials, stocks } from '../data/stocks';
import { stories } from '../data/stories';
import { Change, PageHero, Stars } from '../components/ui/Bits';
import { GroupedBars, PALETTE, PriceChart } from '../components/ui/Charts';
import { ScoreRing } from '../components/ui/Gauges';
import StoryCard from '../components/ui/StoryCard';
import { ScoreDots } from './Stocks';
import { crore, num, price } from '../utils/format';
import NotFound from './NotFound';

const SECTIONS = [['overview', 'Overview'], ['scores', 'Scorecard'], ['financials', 'Financials'], ['shareholding', 'Shareholding'], ['peers', 'Peers']];

const HINTS = {
  quality: 'Return ratios, cash flows, balance sheet',
  growth: 'Revenue and profit growth over 5 years',
  valuation: 'P/E, P/B and PEG versus history and peers',
  momentum: 'Price trend and relative strength',
};

export default function StockDetail() {
  const { id } = useParams();
  const s = stockById(id);
  if (!s) return <NotFound />;

  const { rows, shareholding } = stockFinancials(s);
  const peers = stocks.filter((p) => p.sector === s.sector || p.cap === s.cap).filter((p) => p.id !== s.id).slice(0, 5);
  const pos = ((s.price - s.low52) / (s.high52 - s.low52)) * 100;
  const chgAbs = (s.price * s.chg) / (100 + s.chg);
  const related = stories.filter((x) => x.category === 'Stock Ideas').slice(0, 3);

  return (
    <>
      <PageHero crumbs={[{ label: 'Stocks', to: '/stocks' }, { label: s.sector }, { label: s.name }]}>
        <div className="detail-head">
          <div>
            <span className="eyebrow">NSE: {s.ticker} · {s.sector}</span>
            <h1 style={{ marginTop: 6 }}>{s.name}</h1>
            <div className="detail-meta">
              <span className="badge">{s.cap} cap</span>
              <span className="badge">M-cap {crore(s.mcap)}</span>
              <span className="badge" style={{ background: 'rgba(227,155,45,0.2)' }}><Stars value={s.rating} size={12} /></span>
            </div>
          </div>
          <div className="detail-price">
            <div className="xs" style={{ color: '#8796ad' }}>Last close · 16 Oct 2026</div>
            <div className="big">₹{price(s.price)}</div>
            <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <span className={`num ${s.chg >= 0 ? 'up' : 'down'}`} style={{ filter: 'brightness(1.4)' }}>{chgAbs >= 0 ? '+' : ''}{num(chgAbs)}</span>
              <Change value={s.chg} pill />
            </span>
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-accent">+ Add to watchlist</button>
          <button className="btn">Set price alert</button>
          <button className="btn">Compare</button>
        </div>
      </PageHero>

      <div className="subnav">
        <div className="wrap tabs">{SECTIONS.map(([k, l]) => <a key={k} href={`#${k}`} className="tab">{l}</a>)}</div>
      </div>

      <div className="section tight">
        <div className="wrap detail-grid">
          <div>
            <section id="overview" className="detail-section card">
              <div className="card-head"><h3>Price chart</h3><span className="xs muted">Sample price history</span></div>
              <div className="card-pad"><PriceChart seed={s.id} end={s.price} cagr={s.scores.momentum * 3} ranges={['1M', '6M', '1Y', '3Y', '5Y']} /></div>
              <div className="kpis" style={{ margin: '0 20px 20px' }}>
                <div><div className="kpi-label">P/E</div><div className="kpi-value">{num(s.pe, 1)}</div></div>
                <div><div className="kpi-label">P/B</div><div className="kpi-value">{num(s.pb, 1)}</div></div>
                <div><div className="kpi-label">ROE</div><div className="kpi-value">{num(s.roe, 1)}%</div></div>
                <div><div className="kpi-label">Dividend yield</div><div className="kpi-value">{num(s.div, 1)}%</div></div>
              </div>
            </section>

            <section id="scores" className="detail-section card">
              <div className="card-head"><h3>Scorecard</h3><span className="xs muted">0 = weakest, 10 = strongest</span></div>
              <div className="card-pad grid-4" style={{ gap: 16 }}>
                {Object.entries(s.scores).map(([k, v]) => <ScoreRing key={k} label={k[0].toUpperCase() + k.slice(1)} value={v} hint={HINTS[k]} />)}
              </div>
              <div className="card-pad" style={{ borderTop: '1px solid var(--line)' }}>
                <span className="eyebrow">Analyst take</span>
                <p style={{ marginTop: 6 }}>
                  {s.scores.quality >= 8 ? `${s.name} is a high-quality business with ROE of ${s.roe}%.` : `${s.name} has average business quality.`}{' '}
                  {s.scores.valuation <= 3 ? 'The stock trades at a rich valuation, leaving little room for disappointment.' : s.scores.valuation >= 7 ? 'Valuations look undemanding relative to history.' : 'Valuations are close to fair value.'}{' '}
                  {s.scores.momentum >= 7 ? 'Price momentum is strong.' : s.scores.momentum <= 3 ? 'Price momentum is weak; patience may be rewarded.' : ''}
                </p>
              </div>
            </section>

            <section id="financials" className="detail-section card">
              <div className="card-head"><h3>Revenue and net profit</h3><span className="xs muted">₹ crore, consolidated</span></div>
              <div className="card-pad">
                <GroupedBars data={rows.map((r) => ({ label: r.year, revenue: r.revenue, profit: r.profit }))} keys={['revenue', 'profit']} names={['Revenue', 'Net profit']} unit="cr" colors={[PALETTE[2], PALETTE[0]]} />
              </div>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Metric</th>{rows.map((r) => <th key={r.year} className="r">{r.year}</th>)}</tr></thead>
                  <tbody>
                    <tr><td>Revenue</td>{rows.map((r) => <td key={r.year} className="r num">{num(r.revenue, 0)}</td>)}</tr>
                    <tr><td>Net profit</td>{rows.map((r) => <td key={r.year} className="r num">{num(r.profit, 0)}</td>)}</tr>
                    <tr><td>Net margin</td>{rows.map((r) => <td key={r.year} className="r num">{((r.profit / r.revenue) * 100).toFixed(1)}%</td>)}</tr>
                    <tr><td>EPS (₹)</td>{rows.map((r) => <td key={r.year} className="r num">{num(r.eps, 1)}</td>)}</tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="shareholding" className="detail-section card">
              <div className="card-head"><h3>Who owns {s.name}?</h3><span className="xs muted">Sep 2026 quarter</span></div>
              <div className="card-pad">
                <div className="sh-bar">
                  {shareholding.map((h, i) => <span key={h.name} style={{ width: `${h.value}%`, background: PALETTE[i] }}>{h.value >= 8 ? `${h.value}%` : ''}</span>)}
                </div>
                <div className="grid-4" style={{ marginTop: 16, gap: 12 }}>
                  {shareholding.map((h, i) => (
                    <div key={h.name} style={{ borderLeft: `3px solid ${PALETTE[i]}`, paddingLeft: 10 }}>
                      <div className="xs muted">{h.name}</div>
                      <div className="num" style={{ fontWeight: 600, fontSize: 18 }}>{h.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="peers" className="detail-section card">
              <div className="card-head"><h3>Peers</h3></div>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Company</th><th>Scores</th><th className="r">Price</th><th className="r">M-cap</th><th className="r">P/E</th><th className="r">ROE</th></tr></thead>
                  <tbody>
                    {[s, ...peers].map((p) => (
                      <tr key={p.id} style={p.id === s.id ? { background: 'var(--brand-soft)' } : undefined}>
                        <td>{p.id === s.id ? <strong className="cell-title">{p.name}</strong> : <Link className="cell-title" to={`/stocks/${p.id}`}>{p.name}</Link>}<div className="cell-sub">{p.sector}</div></td>
                        <td><ScoreDots s={p} /></td>
                        <td className="r num">{price(p.price)}</td>
                        <td className="r num">{crore(p.mcap)}</td>
                        <td className="r num">{num(p.pe, 1)}</td>
                        <td className="r num">{num(p.roe, 1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside>
            <div className="card card-pad">
              <h3>52-week range</h3>
              <div className="range52"><span style={{ left: `${Math.min(100, Math.max(0, pos))}%` }} /></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }} className="small">
                <span><span className="xs muted">Low</span><br /><strong className="num">{price(s.low52)}</strong></span>
                <span style={{ textAlign: 'right' }}><span className="xs muted">High</span><br /><strong className="num">{price(s.high52)}</strong></span>
              </div>
              <div className="note" style={{ marginTop: 14 }}>Trading {((1 - s.price / s.high52) * 100).toFixed(1)}% below its 52-week high.</div>
            </div>
            <div className="card card-pad" style={{ background: 'var(--navy)', color: '#c9d3e3', borderColor: 'var(--navy)' }}>
              <span className="badge badge-accent">Stock Advisor</span>
              <h3 style={{ color: '#fff', margin: '10px 0 6px', fontFamily: 'var(--font-display)', fontSize: 20 }}>Is {s.name} a buy today?</h3>
              <p className="small">Subscribers get our clear buy, hold or sell view with a fair-value range and the reasoning behind it.</p>
              <Link to="/pricing#stocks" className="btn btn-accent btn-block" style={{ marginTop: 14 }}>Unlock the recommendation</Link>
            </div>
            <div className="card card-pad">
              <h3 style={{ marginBottom: 8 }}>Related analysis</h3>
              {related.map((r) => <StoryCard key={r.id} story={r} variant="row" />)}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
