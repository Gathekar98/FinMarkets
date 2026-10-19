import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { stocks, screenerPresets } from '../data/stocks';
import { sectors } from '../data/markets';
import { Change, PageHero, SectionHead, Stars, Tabs } from '../components/ui/Bits';
import { crore, num, price } from '../utils/format';

export function ScoreDots({ s }) {
  const cls = (v) => (v >= 7 ? 'sd-hi' : v >= 4 ? 'sd-mid' : 'sd-lo');
  return (
    <span className="score-dots" title="Quality · Growth · Valuation · Momentum">
      {['quality', 'growth', 'valuation', 'momentum'].map((k) => (
        <span key={k} className={cls(s.scores[k])} aria-label={`${k} ${s.scores[k]}`}>{k[0].toUpperCase()}{s.scores[k]}</span>
      ))}
    </span>
  );
}

function Movers() {
  const [tab, setTab] = useState('Large');
  const pool = stocks.filter((s) => tab === 'All' || s.cap === tab);
  const sorted = [...pool].sort((a, b) => b.chg - a.chg);
  const gainers = sorted.filter((s) => s.chg > 0).slice(0, 5);
  const losers = sorted.filter((s) => s.chg < 0).reverse().slice(0, 5);
  const Row = ({ s }) => (
    <Link to={`/stocks/${s.id}`} className="mover-row">
      <span><strong>{s.name}</strong><span className="xs muted" style={{ display: 'block' }}>{s.ticker} · {s.sector}</span></span>
      <span className="num">₹{price(s.price)}</span>
      <span style={{ textAlign: 'right' }}><Change value={s.chg} pill /></span>
    </Link>
  );
  return (
    <section className="section tight" id="movers" style={{ scrollMarginTop: 110 }}>
      <div className="wrap">
        <SectionHead eyebrow="Today" title="Gainers and losers" />
        <div style={{ marginBottom: 16 }}><Tabs options={['Large', 'Mid', 'Small', 'All']} value={tab} onChange={setTab} /></div>
        <div className="movers">
          <div className="card">
            <div className="card-head"><h3 className="up">▲ Top gainers</h3></div>
            {gainers.length ? gainers.map((s) => <Row key={s.id} s={s} />) : <div className="empty small">No gainers in this segment today.</div>}
          </div>
          <div className="card">
            <div className="card-head"><h3 className="down">▼ Top losers</h3></div>
            {losers.length ? losers.map((s) => <Row key={s.id} s={s} />) : <div className="empty small">No losers in this segment today.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectorBoard() {
  const max = Math.max(...sectors.map((s) => Math.abs(s.changePct)));
  return (
    <div className="card">
      <div className="card-head"><h3>Sector performance</h3><span className="xs muted">1-day change</span></div>
      <div className="sector-bars">
        {[...sectors].sort((a, b) => b.changePct - a.changePct).map((s) => {
          const w = (Math.abs(s.changePct) / max) * 50;
          return (
            <div key={s.name} className="sector-bar">
              <span>{s.name}</span>
              <div className="sb-track">
                <div className="sb-fill" style={s.changePct >= 0 ? { left: '50%', width: `${w}%`, background: 'var(--up)' } : { right: '50%', width: `${w}%`, background: 'var(--down)' }} />
              </div>
              <span className={`num ${s.changePct >= 0 ? 'up' : 'down'}`} style={{ textAlign: 'right' }}>{s.changePct > 0 ? '+' : ''}{s.changePct.toFixed(2)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Screener() {
  const [params, setParams] = useSearchParams();
  const presetId = params.get('preset') || '';
  const preset = screenerPresets.find((p) => p.id === presetId);
  const [sector, setSector] = useState('All');
  const [cap, setCap] = useState('All');
  const [maxPe, setMaxPe] = useState(100);
  const [sort, setSort] = useState({ key: 'mcap', dir: -1 });

  const sectorsList = ['All', ...new Set(stocks.map((s) => s.sector))].sort((a, b) => (a === 'All' ? -1 : a.localeCompare(b)));
  const rows = useMemo(
    () => stocks
      .filter((s) => !preset || preset.filter(s))
      .filter((s) => sector === 'All' || s.sector === sector)
      .filter((s) => cap === 'All' || s.cap === cap)
      .filter((s) => s.pe <= maxPe)
      .sort((a, b) => (a[sort.key] - b[sort.key]) * sort.dir),
    [preset, sector, cap, maxPe, sort],
  );

  const setPreset = (id) => {
    const next = new URLSearchParams(params);
    if (presetId === id) next.delete('preset'); else next.set('preset', id);
    setParams(next, { replace: true });
  };
  const th = (key, label) => (
    <th className="sortable r" onClick={() => setSort((s) => ({ key, dir: s.key === key ? -s.dir : -1 }))}>
      {label} {sort.key === key ? (sort.dir < 0 ? '↓' : '↑') : ''}
    </th>
  );

  return (
    <section className="section tight" id="screener" style={{ scrollMarginTop: 110 }}>
      <div className="wrap">
        <SectionHead eyebrow="Stock screener" title="Ready-made screens" text="Pick a screen built on our four-part scoring, then refine with your own filters." />
        <div className="preset-grid" style={{ marginBottom: 20 }}>
          {screenerPresets.map((p) => (
            <button key={p.id} className={`preset${presetId === p.id ? ' active' : ''}`} onClick={() => setPreset(p.id)} aria-pressed={presetId === p.id}>
              <strong>{p.title}</strong>
              <span className="small" style={{ opacity: 0.8 }}>{p.blurb}</span>
              <span className="xs" style={{ fontWeight: 700, color: presetId === p.id ? 'var(--accent)' : 'var(--brand)' }}>{stocks.filter(p.filter).length} stocks</span>
            </button>
          ))}
        </div>
        <div className="card">
          <div className="filters">
            <div className="field">
              <label htmlFor="ss">Sector</label>
              <select id="ss" className="select" value={sector} onChange={(e) => setSector(e.target.value)}>{sectorsList.map((o) => <option key={o}>{o}</option>)}</select>
            </div>
            <div className="field">
              <label htmlFor="sc">Market cap</label>
              <select id="sc" className="select" value={cap} onChange={(e) => setCap(e.target.value)}>{['All', 'Large', 'Mid', 'Small'].map((o) => <option key={o}>{o}</option>)}</select>
            </div>
            <div className="field grow">
              <label htmlFor="sp">Max P/E: <span className="num">{maxPe === 100 ? 'Any' : maxPe}</span></label>
              <input id="sp" type="range" min={10} max={100} step={5} value={maxPe} onChange={(e) => setMaxPe(Number(e.target.value))} />
            </div>
          </div>
          <div className="result-count">
            <span>{rows.length} stocks{preset ? ` · ${preset.title}` : ''}</span>
            <span>Scores: Q quality · G growth · V valuation · M momentum (0–10)</span>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Company</th><th>Rating</th><th>Scores</th>
                  {th('price', 'Price')}{th('chg', '1D')}{th('mcap', 'M-cap')}{th('pe', 'P/E')}{th('roe', 'ROE')}{th('div', 'Div. yield')}
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td><Link to={`/stocks/${s.id}`} className="cell-title">{s.name}</Link><div className="cell-sub">{s.ticker} · {s.sector}</div></td>
                    <td><Stars value={s.rating} /></td>
                    <td><ScoreDots s={s} /></td>
                    <td className="r num">{price(s.price)}</td>
                    <td className="r"><Change value={s.chg} arrow={false} /></td>
                    <td className="r num">{crore(s.mcap)}</td>
                    <td className="r num">{num(s.pe, 1)}</td>
                    <td className="r num">{num(s.roe, 1)}%</td>
                    <td className="r num">{num(s.div, 1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <div className="empty">No stocks pass these filters. Try a different screen or relax the P/E limit.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Stocks() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Stocks' }]}
        eyebrow="Stocks"
        title="Know the business before you buy the share"
        lead="Every listed company scored on quality, growth, valuation and momentum — with the numbers behind each score a click away."
      >
        <div className="detail-actions">
          <Link to="/ipo" className="btn">IPO Monitor</Link>
          <Link to="/pricing#stocks" className="btn btn-accent">Get Stock Advisor</Link>
        </div>
      </PageHero>
      <Movers />
      <section className="section tight">
        <div className="wrap"><SectorBoard /></div>
      </section>
      <Screener />
    </>
  );
}
