import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../api/client';
import { Change, PageHero, Seg, Stars } from '../components/ui/Bits';
import { GroupedBars, PALETTE, PriceChart } from '../components/ui/Charts';
import { Riskometer } from '../components/ui/Gauges';
import { ErrorBox, Skeleton, SkeletonRows } from '../components/ui/Status';
import WatchButton from '../components/ui/WatchButton';
import { num, pctPlain, rupee } from '../utils/format';
import NotFound from './NotFound';

const SECTIONS = [['overview', 'Overview'], ['performance', 'Performance'], ['risk', 'Risk'], ['peers', 'Peers']];
const PERIODS = [['1y', '1Y'], ['3y', '3Y'], ['5y', '5Y'], ['10y', '10Y']];

const sipValue = (monthly, years, rate) => {
  const i = rate / 100 / 12;
  const n = years * 12;
  return i === 0 ? monthly * n : monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
};

function InvestCard({ fund }) {
  const [mode, setMode] = useState('SIP');
  const [amt, setAmt] = useState(5000);
  const years = fund.ret['5y'] != null ? 5 : 3;
  const rate = fund.ret['5y'] ?? fund.ret['3y'];
  if (rate == null) return null;
  const fv = mode === 'SIP' ? sipValue(amt, years, rate) : amt * Math.pow(1 + rate / 100, years);
  const invested = mode === 'SIP' ? amt * years * 12 : amt;
  return (
    <div className="card card-pad" style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <h3>Projection</h3>
        <Seg options={['SIP', 'Lumpsum']} value={mode} onChange={(m) => { setMode(m); setAmt(m === 'SIP' ? 5000 : 100000); }} label="Investment mode" />
      </div>
      <div className="field">
        <label htmlFor="inv-amt">{mode === 'SIP' ? 'Monthly amount' : 'One-time amount'}</label>
        <input id="inv-amt" className="input num" type="number" min={500} step={500} value={amt} onChange={(e) => setAmt(Math.max(0, Number(e.target.value)))} />
      </div>
      <div className="calc-result">
        <div className="xs">Value after {years} years, if past returns repeat</div>
        <div className="num">{rupee(fv)}</div>
        <div className="xs">Invested {rupee(invested)} · Gain {rupee(fv - invested)}</div>
      </div>
      <div className="xs muted">Uses this fund's actual {years}Y annualised return of {pctPlain(rate)}. Past performance does not guarantee future returns.</div>
    </div>
  );
}

function verdict(f) {
  const beat = PERIODS.filter(([k]) => f.ret[k] != null && f.catRet?.[k] != null && f.ret[k] > f.catRet[k]).length;
  const avail = PERIODS.filter(([k]) => f.ret[k] != null && f.catRet?.[k] != null).length;
  if (!f.rating) return `${f.name} does not yet have a 3-year record, so we do not rate it. New funds deserve patience before they earn a place in a portfolio.`;
  if (f.rating >= 4) return `${f.name} ranks ${f.rank} of ${f.rankOf} ${f.category} funds on 3-year returns and has beaten the category average in ${beat} of ${avail} periods. A consistent performer worth shortlisting for a ${f.type === 'Debt' ? '1–3' : '5+'} year horizon.`;
  if (f.rating === 3) return `${f.name} sits in the middle of its category (rank ${f.rank} of ${f.rankOf}). Reasonable, but not a standout — compare it with the higher-rated peers below.`;
  return `${f.name} has lagged most ${f.category} peers (rank ${f.rank} of ${f.rankOf}). If you hold it, review whether a higher-rated alternative suits you better.`;
}

export default function FundDetail() {
  const { id } = useParams();
  const { data: f, loading, error, reload } = useApi(`/api/funds/${id}`);

  if (error?.message === 'Not found') return <NotFound />;
  if (loading || !f) {
    return (
      <>
        <PageHero crumbs={[{ label: 'Funds', to: '/funds' }, { label: 'Loading…' }]}><Skeleton h={44} w="60%" style={{ marginTop: 8 }} /></PageHero>
        <div className="wrap section tight"><ErrorBox error={error} onRetry={reload} /><SkeletonRows rows={6} h={60} /></div>
      </>
    );
  }

  const periods = PERIODS.filter(([k]) => f.ret[k] != null);
  const retData = periods.map(([k, l]) => ({ label: l, fund: f.ret[k], category: f.catRet?.[k] ?? 0 }));
  const s = f.stats || {};

  return (
    <>
      <PageHero crumbs={[{ label: 'Funds', to: '/funds' }, { label: f.category, to: '/funds' }, { label: f.name }]}>
        <div className="detail-head">
          <div>
            <span className="eyebrow">{f.amc}</span>
            <h1 style={{ marginTop: 6 }}>{f.name}</h1>
            <div className="detail-meta">
              <span className="badge">{f.category}</span>
              <span className="badge">{f.type}</span>
              <span className="badge">Direct · Growth</span>
              {f.rating ? <span className="badge" style={{ background: 'rgba(227,155,45,0.2)' }}><Stars value={f.rating} size={12} /></span> : <span className="badge">Unrated</span>}
            </div>
          </div>
          <div className="detail-price">
            <div className="xs" style={{ color: 'var(--muted)' }}>NAV as on {f.date}</div>
            <div className="big">₹{num(f.nav, 4)}</div>
            {f.ret['1d'] != null && <Change value={f.ret['1d']} pill />}
          </div>
        </div>
        <div className="detail-actions">
          <WatchButton kind="Fund" refId={f.code} name={f.name} className="btn btn-accent" />
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
              <div className="card-head"><h3>NAV history</h3><span className="xs muted">Source: AMFI</span></div>
              <div className="card-pad"><PriceChart url={`/api/funds/${f.code}/chart`} ranges={['1M', '6M', '1Y', '3Y', '5Y', 'MAX']} /></div>
              <div className="kpis" style={{ margin: '0 20px 20px' }}>
                <div><div className="kpi-label">1Y return</div><div className={`kpi-value ${f.ret['1y'] < 0 ? 'down' : 'up'}`}>{pctPlain(f.ret['1y'])}</div></div>
                <div><div className="kpi-label">3Y return (p.a.)</div><div className="kpi-value">{pctPlain(f.ret['3y'])}</div></div>
                <div><div className="kpi-label">Category rank (3Y)</div><div className="kpi-value">{f.rank ? `${f.rank} / ${f.rankOf}` : '—'}</div></div>
                <div><div className="kpi-label">Since</div><div className="kpi-value">{s.inception ? new Date(s.inception).getFullYear() : '—'}</div></div>
              </div>
            </section>

            <section className="detail-section card card-pad" style={{ background: 'var(--brand-soft)', borderColor: 'transparent' }}>
              <span className="eyebrow">Our view</span>
              <p style={{ marginTop: 8, fontSize: 16 }}>{verdict(f)}</p>
            </section>

            <section id="performance" className="detail-section card">
              <div className="card-head"><h3>Trailing returns vs category</h3><span className="xs muted">Annualised above 1Y, %</span></div>
              {periods.length > 0 && <div className="card-pad"><GroupedBars data={retData} keys={['fund', 'category']} names={['This fund', 'Category average']} colors={[PALETTE[0], 'var(--line-strong)']} /></div>}
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Period</th><th className="r">Fund</th><th className="r">Category avg.</th><th className="r">Difference</th><th className="r">Verdict</th></tr></thead>
                  <tbody>
                    {[['1m', '1M'], ['6m', '6M'], ...PERIODS].filter(([k]) => f.ret[k] != null).map(([k, l]) => {
                      const c = f.catRet?.[k];
                      const d = c != null ? f.ret[k] - c : null;
                      return (
                        <tr key={k}>
                          <td>{l}</td>
                          <td className="r num">{pctPlain(f.ret[k], 2)}</td>
                          <td className="r num">{c != null ? pctPlain(c, 2) : '—'}</td>
                          <td className={`r num ${d == null ? '' : d >= 0 ? 'up' : 'down'}`}>{d == null ? '—' : `${d >= 0 ? '+' : ''}${d.toFixed(2)} pts`}</td>
                          <td className="r">{d == null ? '' : <span className={`badge ${d >= 1 ? 'badge-up' : d < 0 ? 'badge-down' : ''}`}>{d >= 1 ? 'Outperformed' : d < 0 ? 'Lagged' : 'In line'}</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {s.sip?.length > 0 && (
              <section className="detail-section card">
                <div className="card-head"><h3>Actual SIP returns</h3><span className="xs muted">₹10,000 on the first NAV of every month</span></div>
                <div className="table-wrap">
                  <table className="data">
                    <thead><tr><th>Duration</th><th className="r">Invested</th><th className="r">Value today</th><th className="r">Gain</th><th className="r">XIRR</th></tr></thead>
                    <tbody>
                      {s.sip.map((r) => (
                        <tr key={r.years}>
                          <td>{r.years} year{r.years > 1 ? 's' : ''}</td>
                          <td className="r num">{rupee(r.invested)}</td>
                          <td className="r num" style={{ fontWeight: 600 }}>{rupee(r.value)}</td>
                          <td className={`r num ${r.value >= r.invested ? 'up' : 'down'}`}>{rupee(r.value - r.invested)}</td>
                          <td className="r num">{pctPlain(r.xirr, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <section id="risk" className="detail-section card">
              <div className="card-head"><h3>Risk profile</h3><span className="xs muted">Calculated from 3 years of monthly NAVs</span></div>
              <div className="card-pad grid-2" style={{ alignItems: 'center' }}>
                <Riskometer risk={f.risk} />
                <dl className="facts" style={{ margin: 0, border: '1px solid var(--line)', borderRadius: 10 }}>
                  <div><dt>Volatility (std. dev.)</dt><dd className="num">{s.stdDev != null ? `${s.stdDev}%` : '—'}</dd></div>
                  <div><dt>Sharpe ratio</dt><dd className="num">{s.sharpe ?? '—'}</dd></div>
                  <div><dt>Worst fall (max drawdown)</dt><dd className="num down">{s.maxDrawdown != null ? `${s.maxDrawdown}%` : '—'}</dd></div>
                  <div><dt>Risk-free rate used</dt><dd className="num">6.5%</dd></div>
                </dl>
              </div>
              <div className="card-pad" style={{ paddingTop: 0 }}><div className="note">The riskometer shows the typical SEBI risk level for this category. Check the fund's factsheet for its official riskometer.</div></div>
            </section>

            <section id="peers" className="detail-section card">
              <div className="card-head"><h3>Top {f.category} funds</h3><span className="xs muted">By 3-year return</span></div>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Fund</th><th>Rating</th><th className="r">1Y</th><th className="r">3Y</th><th className="r">5Y</th></tr></thead>
                  <tbody>
                    {[f, ...f.peers].sort((a, b) => (b.ret['3y'] ?? -99) - (a.ret['3y'] ?? -99)).map((p) => (
                      <tr key={p.code} style={p.code === f.code ? { background: 'var(--brand-soft)' } : undefined}>
                        <td>{p.code === f.code ? <strong className="cell-title">{p.name} (this fund)</strong> : <Link className="cell-title" to={`/funds/${p.code}`}>{p.name}</Link>}<div className="cell-sub">{p.amc}</div></td>
                        <td>{p.rating ? <Stars value={p.rating} /> : '—'}</td>
                        <td className="r num">{pctPlain(p.ret['1y'])}</td>
                        <td className="r num">{pctPlain(p.ret['3y'])}</td>
                        <td className="r num">{pctPlain(p.ret['5y'])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside>
            <InvestCard fund={f} />
            <div className="card">
              <div className="card-head"><h3>Key facts</h3></div>
              <dl className="facts" style={{ margin: 0, gridTemplateColumns: '1fr' }}>
                {[
                  ['Fund house', f.amc],
                  ['Category', `${f.type} · ${f.category}`],
                  ['AMFI scheme code', f.code],
                  ['ISIN', f.isin || '—'],
                  ['NAV date', f.date],
                ].map(([k, v]) => <div key={k} style={{ borderRight: 0 }}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </div>
            <div className="note">Expense ratio, fund size and portfolio holdings come from monthly fund-house disclosures and will be added in a later update.</div>
          </aside>
        </div>
      </div>
    </>
  );
}
