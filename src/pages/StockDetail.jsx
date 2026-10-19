import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi, LIVE, timeLabel } from '../api/client';
import { stories } from '../data/stories';
import { Change, PageHero, Stars } from '../components/ui/Bits';
import { GroupedBars, PALETTE, PriceChart } from '../components/ui/Charts';
import { ScoreRing } from '../components/ui/Gauges';
import { ErrorBox, LiveBadge, Skeleton, SkeletonRows } from '../components/ui/Status';
import StoryCard from '../components/ui/StoryCard';
import WatchButton from '../components/ui/WatchButton';
import { ScoreDots } from './Stocks';
import { crore, num, price } from '../utils/format';
import NotFound from './NotFound';
import useSeo from '../seo/useSeo';
import { stockMeta, NOT_FOUND } from '../seo/meta';

const SECTIONS = [['overview', 'Overview'], ['scores', 'Scorecard'], ['financials', 'Financials'], ['shareholding', 'Shareholding'], ['peers', 'Peers']];

const HINTS = {
  quality: 'ROE, profit margin and leverage',
  growth: 'Latest revenue and earnings growth',
  valuation: 'P/E and P/B versus the universe',
  momentum: '1-year return and trend vs 200-day average',
};

function take(s) {
  const out = [];
  const sc = s.scores || {};
  if (sc.quality >= 7) out.push(`${s.name} is a high-quality business${s.roe != null ? ` with a return on equity of ${s.roe.toFixed(1)}%` : ''}.`);
  else if (sc.quality != null && sc.quality <= 3) out.push(`Business quality scores below most peers${s.roe != null ? ` (ROE ${s.roe.toFixed(1)}%)` : ''}.`);
  else if (sc.quality != null) out.push('Business quality is around the middle of our universe.');
  if (sc.valuation != null) out.push(sc.valuation <= 3 ? 'The stock is expensive relative to peers, leaving little room for disappointment.' : sc.valuation >= 7 ? 'Valuations look undemanding relative to the rest of the market.' : 'Valuation is close to the market middle.');
  if (sc.momentum >= 7) out.push('Price momentum is strong.');
  else if (sc.momentum != null && sc.momentum <= 3) out.push('Price momentum is weak.');
  return out.join(' ') || 'Scores are being calculated from the latest financials.';
}

function About({ text }) {
  const [more, setMore] = useState(false);
  if (!text) return null;
  return (
    <p className="small" style={{ color: 'var(--ink-2)' }}>
      {more || text.length < 360 ? text : `${text.slice(0, 340)}… `}
      {text.length >= 360 && <button className="btn btn-ghost btn-sm" onClick={() => setMore(!more)}>{more ? 'Less' : 'More'}</button>}
    </p>
  );
}

export default function StockDetail() {
  const { id } = useParams();
  const ticker = decodeURIComponent(id).toUpperCase();
  const { data: s, loading, error, reload } = useApi(`/api/stocks/${encodeURIComponent(ticker)}`, { refresh: LIVE });
  useSeo(error?.message === 'Not found' ? NOT_FOUND : stockMeta(s ? { ...s, ticker: s.ticker } : { name: ticker, ticker }));

  if (error?.message === 'Not found') return <NotFound />;
  if (loading || !s) {
    return (
      <>
        <PageHero crumbs={[{ label: 'Stocks', to: '/stocks' }, { label: ticker }]}><Skeleton h={44} w="50%" style={{ marginTop: 8 }} /></PageHero>
        <div className="wrap section tight"><ErrorBox error={error} onRetry={reload} /><SkeletonRows rows={6} h={60} /></div>
      </>
    );
  }

  const pos = s.high52 && s.low52 ? ((s.price - s.low52) / (s.high52 - s.low52)) * 100 : null;
  const fin = (s.financials || []).filter((r) => r.revenueCr != null || r.profitCr != null);
  const p = s.profile || {};
  const insiders = p.insidersPct;
  const inst = p.institutionsPct;
  const share = insiders != null || inst != null
    ? [
      { name: 'Promoters & insiders', value: +(insiders ?? 0).toFixed(1) },
      { name: 'Institutions (FII + DII)', value: +(inst ?? 0).toFixed(1) },
      { name: 'Public & others', value: +Math.max(0, 100 - (insiders ?? 0) - (inst ?? 0)).toFixed(1) },
    ]
    : null;
  const related = stories.filter((x) => x.category === 'Stock Ideas').slice(0, 3);

  return (
    <>
      <PageHero crumbs={[{ label: 'Stocks', to: '/stocks' }, { label: s.sector || 'Equity' }, { label: s.name }]}>
        <div className="detail-head">
          <div>
            <span className="eyebrow">NSE: {s.ticker}{s.sector ? ` · ${s.sector}` : ''}{p.industry ? ` · ${p.industry}` : ''}</span>
            <h1 style={{ marginTop: 6 }}>{s.name}</h1>
            <div className="detail-meta">
              {s.cap && <span className="badge">{s.cap} cap</span>}
              {s.mcapCr && <span className="badge">M-cap {crore(s.mcapCr)}</span>}
              {s.rating && <span className="badge" style={{ background: 'rgba(227,155,45,0.2)' }}><Stars value={s.rating} size={12} /></span>}
              <LiveBadge state={s.marketState} time={s.time} />
            </div>
          </div>
          <div className="detail-price">
            <div className="xs" style={{ color: 'var(--muted)' }}>{s.time ? `As of ${timeLabel(s.time)}` : 'Last price'}</div>
            <div className="big">₹{price(s.price)}</div>
            <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <span className={`num ${s.change >= 0 ? 'up' : 'down'}`}>{s.change >= 0 ? '+' : ''}{num(s.change)}</span>
              <Change value={s.changePct} pill />
            </span>
          </div>
        </div>
        <div className="detail-actions">
          <WatchButton kind="Stock" refId={s.ticker} name={s.name} className="btn btn-accent" />
          <Link to="/portfolio" className="btn">Add to portfolio</Link>
        </div>
      </PageHero>

      <div className="subnav">
        <div className="wrap tabs">{SECTIONS.map(([k, l]) => <a key={k} href={`#${k}`} className="tab">{l}</a>)}</div>
      </div>

      <div className="section tight">
        <div className="wrap detail-grid">
          <div>
            <section id="overview" className="detail-section card">
              <div className="card-head"><h3>Price chart</h3><span className="xs muted">NSE · 15 min delayed</span></div>
              <div className="card-pad"><PriceChart url={`/api/stocks/${encodeURIComponent(s.ticker)}/chart`} ranges={['1D', '1M', '6M', '1Y', '3Y', '5Y']} /></div>
              <div className="kpis" style={{ margin: '0 20px 20px' }}>
                <div><div className="kpi-label">P/E (TTM)</div><div className="kpi-value">{s.pe > 0 ? num(s.pe, 1) : '—'}</div></div>
                <div><div className="kpi-label">P/B</div><div className="kpi-value">{s.pb > 0 ? num(s.pb, 1) : '—'}</div></div>
                <div><div className="kpi-label">ROE</div><div className="kpi-value">{s.roe != null ? `${num(s.roe, 1)}%` : '—'}</div></div>
                <div><div className="kpi-label">Dividend yield</div><div className="kpi-value">{s.divYield != null ? `${num(s.divYield, 2)}%` : '—'}</div></div>
                <div><div className="kpi-label">EPS (TTM)</div><div className="kpi-value">{s.eps != null ? `₹${num(s.eps, 1)}` : '—'}</div></div>
                <div><div className="kpi-label">Day range</div><div className="kpi-value" style={{ fontSize: 15 }}>{s.dayLow ? `${price(s.dayLow)} – ${price(s.dayHigh)}` : '—'}</div></div>
              </div>
              {p.about && <div className="card-pad" style={{ borderTop: '1px solid var(--line)' }}><h4 style={{ marginBottom: 6 }}>About the company</h4><About text={p.about} /></div>}
            </section>

            <section id="scores" className="detail-section card">
              <div className="card-head"><h3>Scorecard</h3><span className="xs muted">0 = weakest, 10 = strongest, vs {'~'}100 large NSE stocks</span></div>
              <div className="card-pad grid-4" style={{ gap: 16 }}>
                {Object.entries(s.scores || {}).map(([k, v]) => (
                  v == null
                    ? <div key={k} style={{ textAlign: 'center' }} className="small muted"><strong>{k[0].toUpperCase() + k.slice(1)}</strong><br />Not enough data</div>
                    : <ScoreRing key={k} label={k[0].toUpperCase() + k.slice(1)} value={v} hint={HINTS[k]} />
                ))}
              </div>
              <div className="card-pad" style={{ borderTop: '1px solid var(--line)' }}>
                <span className="eyebrow">Analyst take</span>
                <p style={{ marginTop: 6 }}>{take(s)}</p>
              </div>
            </section>

            <section id="financials" className="detail-section card">
              <div className="card-head"><h3>Revenue and net profit</h3><span className="xs muted">₹ crore, annual, consolidated</span></div>
              {fin.length === 0 ? <div className="empty small">Annual financials are not available for this company.</div> : (
                <>
                  <div className="card-pad">
                    <GroupedBars data={fin.map((r) => ({ label: r.year, revenue: Math.round(r.revenueCr ?? 0), profit: Math.round(r.profitCr ?? 0) }))} keys={['revenue', 'profit']} names={['Revenue', 'Net profit']} unit="cr" colors={[PALETTE[2], PALETTE[0]]} />
                  </div>
                  <div className="table-wrap">
                    <table className="data">
                      <thead><tr><th>Metric</th>{fin.map((r) => <th key={r.year} className="r">{r.year}</th>)}</tr></thead>
                      <tbody>
                        <tr><td>Revenue</td>{fin.map((r) => <td key={r.year} className="r num">{r.revenueCr != null ? num(r.revenueCr, 0) : '—'}</td>)}</tr>
                        <tr><td>Net profit</td>{fin.map((r) => <td key={r.year} className={`r num ${r.profitCr < 0 ? 'down' : ''}`}>{r.profitCr != null ? num(r.profitCr, 0) : '—'}</td>)}</tr>
                        <tr><td>Net margin</td>{fin.map((r) => <td key={r.year} className="r num">{r.revenueCr && r.profitCr != null ? `${((r.profitCr / r.revenueCr) * 100).toFixed(1)}%` : '—'}</td>)}</tr>
                        <tr><td>EPS (₹)</td>{fin.map((r) => <td key={r.year} className="r num">{r.eps != null ? num(r.eps, 1) : '—'}</td>)}</tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>

            <section id="shareholding" className="detail-section card">
              <div className="card-head"><h3>Who owns {s.name}?</h3><span className="xs muted">Latest disclosed</span></div>
              <div className="card-pad">
                {!share ? <div className="empty small">Shareholding data is not available.</div> : (
                  <>
                    <div className="sh-bar">
                      {share.map((h, i) => <span key={h.name} style={{ width: `${h.value}%`, background: PALETTE[i] }}>{h.value >= 8 ? `${h.value}%` : ''}</span>)}
                    </div>
                    <div className="grid-3" style={{ marginTop: 16, gap: 12 }}>
                      {share.map((h, i) => (
                        <div key={h.name} style={{ borderLeft: `3px solid ${PALETTE[i]}`, paddingLeft: 10 }}>
                          <div className="xs muted">{h.name}</div>
                          <div className="num" style={{ fontWeight: 600, fontSize: 18 }}>{h.value}%</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </section>

            {s.peers?.length > 0 && (
              <section id="peers" className="detail-section card">
                <div className="card-head"><h3>Peers in {s.sector}</h3></div>
                <div className="table-wrap">
                  <table className="data">
                    <thead><tr><th>Company</th><th>Scores</th><th className="r">Price</th><th className="r">1D</th><th className="r">M-cap</th><th className="r">P/E</th><th className="r">ROE</th></tr></thead>
                    <tbody>
                      {[s, ...s.peers].map((x) => (
                        <tr key={x.symbol} style={x.symbol === s.symbol ? { background: 'var(--brand-soft)' } : undefined}>
                          <td>{x.symbol === s.symbol ? <strong className="cell-title">{x.name}</strong> : <Link className="cell-title" to={`/stocks/${x.ticker}`}>{x.name}</Link>}<div className="cell-sub">{x.ticker}</div></td>
                          <td><ScoreDots s={x} /></td>
                          <td className="r num">{price(x.price)}</td>
                          <td className="r"><Change value={x.changePct} arrow={false} /></td>
                          <td className="r num">{x.mcapCr ? crore(x.mcapCr) : '—'}</td>
                          <td className="r num">{x.pe > 0 ? num(x.pe, 1) : '—'}</td>
                          <td className="r num">{x.roe != null ? `${num(x.roe, 1)}%` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <aside>
            {pos != null && (
              <div className="card card-pad">
                <h3>52-week range</h3>
                <div className="range52"><span style={{ left: `${Math.min(100, Math.max(0, pos))}%` }} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }} className="small">
                  <span><span className="xs muted">Low</span><br /><strong className="num">{price(s.low52)}</strong></span>
                  <span style={{ textAlign: 'right' }}><span className="xs muted">High</span><br /><strong className="num">{price(s.high52)}</strong></span>
                </div>
                <div className="note" style={{ marginTop: 14 }}>
                  {s.price >= s.high52 * 0.98 ? 'Trading near its 52-week high.' : `Trading ${((1 - s.price / s.high52) * 100).toFixed(1)}% below its 52-week high.`}
                  {s.change52Pct != null && ` 1-year return: ${s.change52Pct >= 0 ? '+' : ''}${s.change52Pct.toFixed(1)}%.`}
                </div>
              </div>
            )}
            <div className="card card-pad" style={{ background: 'var(--navy)', color: '#c9d3e3', borderColor: 'var(--navy)' }}>
              <span className="badge badge-accent">Stock Advisor</span>
              <h3 style={{ color: '#fff', margin: '10px 0 6px', fontFamily: 'var(--font-display)', fontSize: 20 }}>Is {s.name} a buy today?</h3>
              <p className="small">Subscribers get our clear buy, hold or sell view with a fair-value range and the reasoning behind it.</p>
              <Link to="/pricing#stocks" className="btn btn-accent btn-block" style={{ marginTop: 14 }}>Unlock the recommendation</Link>
            </div>
            {p.website && (
              <div className="card card-pad small">
                <h3 style={{ marginBottom: 8 }}>Company</h3>
                <div><span className="muted">Website: </span><a href={p.website} target="_blank" rel="noreferrer noopener" style={{ color: 'var(--brand)' }}>{p.website.replace(/^https?:\/\//, '')}</a></div>
                {p.employees && <div><span className="muted">Employees: </span>{num(p.employees, 0)}</div>}
                {p.beta != null && <div><span className="muted">Beta: </span>{num(p.beta, 2)}</div>}
              </div>
            )}
            <div className="card card-pad">
              <h3 style={{ marginBottom: 8 }}>Related analysis</h3>
              {related.map((r) => <StoryCard key={r.id} story={r} variant="mini" />)}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
