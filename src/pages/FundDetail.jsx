import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fundById, fundPortfolio, funds } from '../data/funds';
import { Change, PageHero, Seg, Stars } from '../components/ui/Bits';
import { Donut, GroupedBars, PALETTE, PriceChart } from '../components/ui/Charts';
import { Riskometer } from '../components/ui/Gauges';
import { crore, num, pctPlain, rupee } from '../utils/format';
import NotFound from './NotFound';

const SECTIONS = [
  ['overview', 'Overview'],
  ['performance', 'Performance'],
  ['portfolio', 'Portfolio'],
  ['risk', 'Risk'],
  ['peers', 'Peers'],
];

/** Future value of a monthly SIP at an annual rate. */
const sipValue = (monthly, years, rate) => {
  const i = rate / 100 / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
};

function InvestCard({ fund }) {
  const [mode, setMode] = useState('SIP');
  const [amt, setAmt] = useState(mode === 'SIP' ? 5000 : 100000);
  const years = 5;
  const rate = fund.ret['5y'] ?? fund.ret['3y'];
  const fv = mode === 'SIP' ? sipValue(amt, years, rate) : amt * Math.pow(1 + rate / 100, years);
  const invested = mode === 'SIP' ? amt * years * 12 : amt;
  return (
    <div className="card card-pad" style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>If you had invested</h3>
        <Seg options={['SIP', 'Lumpsum']} value={mode} onChange={(m) => { setMode(m); setAmt(m === 'SIP' ? 5000 : 100000); }} label="Investment mode" />
      </div>
      <div className="field">
        <label htmlFor="inv-amt">{mode === 'SIP' ? 'Monthly amount' : 'One-time amount'}</label>
        <input id="inv-amt" className="input num" type="number" min={500} step={500} value={amt} onChange={(e) => setAmt(Math.max(0, Number(e.target.value)))} />
      </div>
      <div className="calc-result">
        <div className="xs">Value today, after {years} years</div>
        <div className="num">{rupee(fv)}</div>
        <div className="xs">Invested {rupee(invested)} · Gain {rupee(fv - invested)}</div>
      </div>
      <button className="btn btn-primary btn-block">Invest in this fund</button>
      <div className="xs muted">Based on {pctPlain(rate)} annualised 5Y return. Past performance does not guarantee future returns.</div>
    </div>
  );
}

export default function FundDetail() {
  const { id } = useParams();
  const fund = fundById(id);
  if (!fund) return <NotFound />;

  const { holdings, sectors, alloc, stats } = fundPortfolio(fund);
  const peers = funds.filter((f) => f.category === fund.category || (f.type === fund.type && f.id !== fund.id)).slice(0, 6);
  if (!peers.find((p) => p.id === fund.id)) peers.unshift(fund);

  const periods = ['1y', '3y', '5y', '10y'].filter((k) => fund.ret[k] != null);
  const retData = periods.map((k) => ({ label: k.toUpperCase(), fund: fund.ret[k], category: fund.cat[k] }));
  const sipRows = [1, 3, 5].map((y) => {
    const r = fund.ret[`${y}y`];
    const inv = 10000 * 12 * y;
    const val = sipValue(10000, y, r);
    return { y, inv, val, r };
  });
  const riskStats = {
    'Std. deviation': `${(fund.type === 'Debt' ? 1.2 : 11 + fund.rating).toFixed(1)}%`,
    'Sharpe ratio': (fund.ret['3y'] / (fund.type === 'Debt' ? 6 : 16)).toFixed(2),
    Beta: fund.type === 'Debt' ? '—' : (0.82 + (fund.name.length % 6) * 0.04).toFixed(2),
    'Max drawdown': fund.type === 'Debt' ? '-1.4%' : `-${(18 + (fund.name.length % 9)).toFixed(1)}%`,
  };

  return (
    <>
      <PageHero crumbs={[{ label: 'Funds', to: '/funds' }, { label: fund.category, to: '/funds' }, { label: fund.name }]}>
        <div className="detail-head">
          <div>
            <span className="eyebrow">{fund.amc}</span>
            <h1 style={{ marginTop: 6 }}>{fund.name}</h1>
            <div className="detail-meta">
              <span className="badge">{fund.category}</span>
              <span className="badge">{fund.type}</span>
              <span className="badge">Direct · Growth</span>
              <span className="badge" style={{ background: 'rgba(227,155,45,0.2)' }}><Stars value={fund.rating} size={12} /></span>
            </div>
          </div>
          <div className="detail-price">
            <div className="xs" style={{ color: '#8796ad' }}>NAV as on 16 Oct 2026</div>
            <div className="big">₹{num(fund.nav)}</div>
            <Change value={fund.navChg} pill />
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-accent">Start SIP</button>
          <button className="btn">+ Add to watchlist</button>
          <button className="btn">Compare</button>
        </div>
      </PageHero>

      <div className="subnav">
        <div className="wrap tabs">
          {SECTIONS.map(([k, l]) => <a key={k} href={`#${k}`} className="tab">{l}</a>)}
        </div>
      </div>

      <div className="section tight">
        <div className="wrap detail-grid">
          <div>
            <section id="overview" className="detail-section card">
              <div className="card-head"><h3>NAV growth</h3><span className="xs muted">Benchmark: {fund.benchmark}</span></div>
              <div className="card-pad"><PriceChart seed={fund.id} end={fund.nav} cagr={fund.ret['3y']} ranges={['1M', '6M', '1Y', '3Y', '5Y', 'MAX']} /></div>
              <div className="kpis" style={{ margin: '0 20px 20px' }}>
                <div><div className="kpi-label">Fund size</div><div className="kpi-value">{crore(fund.aum)}</div></div>
                <div><div className="kpi-label">Expense ratio</div><div className="kpi-value">{fund.expense.toFixed(2)}%</div></div>
                <div><div className="kpi-label">3Y return</div><div className="kpi-value up">{pctPlain(fund.ret['3y'])}</div></div>
                <div><div className="kpi-label">Min. SIP</div><div className="kpi-value">{rupee(fund.minSip)}</div></div>
              </div>
            </section>

            <section className="detail-section card card-pad" style={{ background: 'var(--brand-soft)', borderColor: 'transparent' }}>
              <span className="eyebrow">Our view</span>
              <p style={{ marginTop: 8, fontSize: 16 }}>
                {fund.rating >= 4
                  ? `${fund.name} has beaten its category average in ${periods.filter((k) => fund.ret[k] > fund.cat[k]).length} of ${periods.length} periods with reasonable costs. It suits investors with a ${fund.type === 'Debt' ? '1–3' : '5+'} year horizon looking for a ${fund.category.toLowerCase()} holding.`
                  : `${fund.name} has a mixed record against its category. Investors may find more consistent options among higher-rated ${fund.category.toLowerCase()} peers listed below.`}
              </p>
            </section>

            <section id="performance" className="detail-section card">
              <div className="card-head"><h3>Trailing returns vs category</h3><span className="xs muted">Annualised, %</span></div>
              <div className="card-pad">
                <GroupedBars data={retData} keys={['fund', 'category']} names={['This fund', 'Category average']} colors={[PALETTE[0], 'var(--line-strong)']} />
              </div>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Period</th><th className="r">Fund</th><th className="r">Category</th><th className="r">Difference</th><th className="r">Verdict</th></tr></thead>
                  <tbody>
                    {periods.map((k) => {
                      const d = fund.ret[k] - fund.cat[k];
                      return (
                        <tr key={k}>
                          <td>{k.toUpperCase()}</td>
                          <td className="r num">{pctPlain(fund.ret[k])}</td>
                          <td className="r num">{pctPlain(fund.cat[k])}</td>
                          <td className={`r num ${d >= 0 ? 'up' : 'down'}`}>{d >= 0 ? '+' : ''}{d.toFixed(1)} pts</td>
                          <td className="r"><span className={`badge ${d >= 1 ? 'badge-up' : d < 0 ? 'badge-down' : ''}`}>{d >= 1 ? 'Outperformed' : d < 0 ? 'Lagged' : 'In line'}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="detail-section card">
              <div className="card-head"><h3>SIP returns</h3><span className="xs muted">₹10,000 every month</span></div>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Duration</th><th className="r">Invested</th><th className="r">Value today</th><th className="r">Gain</th><th className="r">XIRR</th></tr></thead>
                  <tbody>
                    {sipRows.map((r) => (
                      <tr key={r.y}>
                        <td>{r.y} year{r.y > 1 ? 's' : ''}</td>
                        <td className="r num">{rupee(r.inv)}</td>
                        <td className="r num" style={{ fontWeight: 600 }}>{rupee(r.val)}</td>
                        <td className="r num up">{rupee(r.val - r.inv)}</td>
                        <td className="r num">{pctPlain(r.r)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="portfolio" className="detail-section card">
              <div className="card-head"><h3>Asset allocation</h3><span className="xs muted">As of 30 Sep 2026</span></div>
              <div className="card-pad">
                <div className="alloc-bar">
                  {alloc.map((a, i) => <span key={a.name} style={{ width: `${a.value}%`, background: PALETTE[i] }} title={`${a.name} ${a.value}%`} />)}
                </div>
                <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 10 }}>
                  {alloc.map((a, i) => (
                    <span key={a.name} className="small" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: PALETTE[i] }} />{a.name} <strong className="num">{a.value}%</strong>
                    </span>
                  ))}
                </div>
                <div className="kpis" style={{ marginTop: 18 }}>
                  {Object.entries(stats).map(([k, v]) => <div key={k}><div className="kpi-label">{k}</div><div className="kpi-value" style={{ fontSize: 17 }}>{v}</div></div>)}
                </div>
              </div>
            </section>

            <div className="detail-section grid-2">
              <section className="card">
                <div className="card-head"><h3>{fund.type === 'Debt' ? 'Credit quality' : 'Sector split'}</h3></div>
                <div className="card-pad"><Donut data={sectors} height={180} inner={50} /></div>
              </section>
              <section className="card">
                <div className="card-head"><h3>Top holdings</h3><span className="xs muted">% of assets</span></div>
                {holdings.slice(0, 8).map((h, i) => (
                  <div key={h.name} className="holding-row" style={{ gridTemplateColumns: '20px 1fr 54px' }}>
                    <span className="xs muted num">{i + 1}</span>
                    <span><span style={{ fontWeight: 600 }}>{h.name}</span><span className="xs muted" style={{ display: 'block' }}>{h.sector}</span></span>
                    <span className="num" style={{ textAlign: 'right' }}>{h.weight.toFixed(2)}%</span>
                  </div>
                ))}
              </section>
            </div>

            <section id="risk" className="detail-section card">
              <div className="card-head"><h3>Risk profile</h3></div>
              <div className="card-pad grid-2" style={{ alignItems: 'center' }}>
                <Riskometer risk={fund.risk} />
                <dl className="facts" style={{ margin: 0, border: '1px solid var(--line)', borderRadius: 10 }}>
                  {Object.entries(riskStats).map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="num">{v}</dd></div>)}
                </dl>
              </div>
            </section>

            <section id="peers" className="detail-section card">
              <div className="card-head"><h3>Peer comparison</h3><span className="xs muted">{fund.type} funds</span></div>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Fund</th><th>Rating</th><th className="r">1Y</th><th className="r">3Y</th><th className="r">5Y</th><th className="r">Expense</th></tr></thead>
                  <tbody>
                    {peers.map((p) => (
                      <tr key={p.id} style={p.id === fund.id ? { background: 'var(--brand-soft)' } : undefined}>
                        <td>{p.id === fund.id ? <strong className="cell-title">{p.name} (this fund)</strong> : <Link className="cell-title" to={`/funds/${p.id}`}>{p.name}</Link>}<div className="cell-sub">{p.category}</div></td>
                        <td><Stars value={p.rating} /></td>
                        <td className="r num">{pctPlain(p.ret['1y'])}</td>
                        <td className="r num">{pctPlain(p.ret['3y'])}</td>
                        <td className="r num">{pctPlain(p.ret['5y'])}</td>
                        <td className="r num">{p.expense.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside>
            <InvestCard fund={fund} />
            <div className="card">
              <div className="card-head"><h3>Key facts</h3></div>
              <dl className="facts" style={{ margin: 0, gridTemplateColumns: '1fr' }}>
                {[
                  ['Fund manager', fund.manager],
                  ['Launched', fund.launch],
                  ['Benchmark', fund.benchmark],
                  ['Min. lumpsum', rupee(fund.minLump)],
                  ['Exit load', fund.exitLoad],
                ].map(([k, v]) => <div key={k} style={{ borderRight: 0 }}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
