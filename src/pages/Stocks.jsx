import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi, LIVE, timeLabel } from '../api/client';
import { Change, PageHero, SectionHead, Stars, Tabs } from '../components/ui/Bits';
import { ErrorBox, LiveBadge, SkeletonRows } from '../components/ui/Status';
import { crore, num, price } from '../utils/format';

export const PRESETS = [
  { id: 'top-rated', title: 'Top Rated Stocks', blurb: 'High-quality businesses with improving fundamentals and sensible prices.', filter: (s) => s.rating >= 4 && s.scores.quality >= 7 },
  { id: 'bluechip-value', title: 'Bluechips on Sale', blurb: 'Large, profitable companies trading at cheaper valuations than peers.', filter: (s) => s.cap === 'Large' && s.scores.valuation >= 6 && s.scores.quality >= 5 },
  { id: 'garp', title: 'Growth at a Fair Price', blurb: 'Strong earnings growth without paying an excessive multiple.', filter: (s) => s.scores.growth >= 7 && s.pe > 0 && s.pe < 40 },
  { id: 'dividend', title: 'Dividend Champions', blurb: 'Steady payers with a dividend yield above 2%.', filter: (s) => s.divYield >= 2 },
  { id: 'momentum', title: 'Strong Momentum', blurb: 'The best one-year price strength in our universe.', filter: (s) => s.scores.momentum >= 8 },
  { id: 'near-low', title: 'Near 52-week Low', blurb: 'Within 10% of their one-year low — worth a closer look.', filter: (s) => s.low52 && s.price <= s.low52 * 1.1 },
];

export function ScoreDots({ s }) {
  const cls = (v) => (v >= 7 ? 'sd-hi' : v >= 4 ? 'sd-mid' : 'sd-lo');
  return (
    <span className="score-dots" title="Quality · Growth · Valuation · Momentum">
      {['quality', 'growth', 'valuation', 'momentum'].map((k) => (
        s.scores?.[k] == null
          ? <span key={k} className="sd-mid" style={{ opacity: 0.4 }}>{k[0].toUpperCase()}–</span>
          : <span key={k} className={cls(s.scores[k])} aria-label={`${k} ${s.scores[k]}`}>{k[0].toUpperCase()}{s.scores[k]}</span>
      ))}
    </span>
  );
}

function Movers({ rows }) {
  const [tab, setTab] = useState('Large');
  const pool = rows.filter((s) => tab === 'All' || s.cap === tab);
  const sorted = [...pool].sort((a, b) => b.changePct - a.changePct);
  const gainers = sorted.filter((s) => s.changePct > 0).slice(0, 5);
  const losers = sorted.filter((s) => s.changePct < 0).reverse().slice(0, 5);
  const row = (s) => (
    <Link key={s.symbol} to={`/stocks/${s.ticker}`} className="mover-row">
      <span><strong>{s.name}</strong><span className="xs muted" style={{ display: 'block' }}>{s.ticker} · {s.sector}</span></span>
      <span className="num">₹{price(s.price)}</span>
      <span style={{ textAlign: 'right' }}><Change value={s.changePct} pill /></span>
    </Link>
  );
  return (
    <section className="section tight" id="movers" style={{ scrollMarginTop: 110 }}>
      <div className="wrap">
        <SectionHead eyebrow="Today" title="Gainers and losers" text={`From ${rows.length} actively tracked NSE stocks. Large cap ≥ ₹1 lakh crore, mid cap ≥ ₹30,000 crore.`} />
        <div style={{ marginBottom: 16 }}><Tabs options={['Large', 'Mid', 'Small', 'All']} value={tab} onChange={setTab} /></div>
        <div className="movers">
          <div className="card">
            <div className="card-head"><h3 className="up">▲ Top gainers</h3></div>
            {gainers.length ? gainers.map(row) : <div className="empty small">No gainers in this segment right now.</div>}
          </div>
          <div className="card">
            <div className="card-head"><h3 className="down">▼ Top losers</h3></div>
            {losers.length ? losers.map(row) : <div className="empty small">No losers in this segment right now.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectorBoard() {
  const { data } = useApi('/api/market/overview', { refresh: LIVE });
  const sectors = data?.sectors || [];
  const max = Math.max(0.5, ...sectors.map((s) => Math.abs(s.changePct)));
  return (
    <div className="card">
      <div className="card-head"><h3>Sector performance</h3><span className="xs muted">NSE sectoral indices · today</span></div>
      {!data ? <SkeletonRows rows={5} h={18} /> : (
        <div className="sector-bars">
          {[...sectors].sort((a, b) => b.changePct - a.changePct).map((s) => {
            const w = (Math.abs(s.changePct) / max) * 50;
            return (
              <div key={s.symbol} className="sector-bar">
                <span>{s.name}</span>
                <div className="sb-track">
                  <div className="sb-fill" style={s.changePct >= 0 ? { left: '50%', width: `${w}%`, background: 'var(--up)' } : { right: '50%', width: `${w}%`, background: 'var(--down)' }} />
                </div>
                <span className={`num ${s.changePct >= 0 ? 'up' : 'down'}`} style={{ textAlign: 'right' }}>{s.changePct > 0 ? '+' : ''}{s.changePct.toFixed(2)}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Screener({ rows, scored }) {
  const [params, setParams] = useSearchParams();
  const presetId = params.get('preset') || '';
  const preset = PRESETS.find((p) => p.id === presetId);
  const [sector, setSector] = useState('All');
  const [cap, setCap] = useState('All');
  const [maxPe, setMaxPe] = useState(100);
  const [sort, setSort] = useState({ key: 'marketCap', dir: -1 });

  const sectorsList = useMemo(() => ['All', ...[...new Set(rows.map((s) => s.sector).filter(Boolean))].sort()], [rows]);
  const list = useMemo(
    () => rows
      .filter((s) => !preset || preset.filter(s))
      .filter((s) => sector === 'All' || s.sector === sector)
      .filter((s) => cap === 'All' || s.cap === cap)
      .filter((s) => maxPe === 100 || (s.pe > 0 && s.pe <= maxPe))
      .sort((a, b) => ((a[sort.key] ?? -1e15) - (b[sort.key] ?? -1e15)) * sort.dir),
    [rows, preset, sector, cap, maxPe, sort],
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
        <SectionHead eyebrow="Stock screener" title="Ready-made screens" text="Each stock is scored 0–10 on quality, growth, valuation and momentum relative to the rest of the universe, from the latest reported financials and live prices." />
        {!scored && <div className="note" style={{ marginBottom: 16 }}>Scores are being calculated from the latest financials — they will appear within a minute. Prices below are already live.</div>}
        <div className="preset-grid" style={{ marginBottom: 20 }}>
          {PRESETS.map((p) => (
            <button key={p.id} className={`preset${presetId === p.id ? ' active' : ''}`} onClick={() => setPreset(p.id)} aria-pressed={presetId === p.id}>
              <strong>{p.title}</strong>
              <span className="small" style={{ opacity: 0.8 }}>{p.blurb}</span>
              <span className="xs" style={{ fontWeight: 700, color: presetId === p.id ? 'var(--accent)' : 'var(--brand)' }}>{rows.filter(p.filter).length} stocks</span>
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
            <span>{list.length} stocks{preset ? ` · ${preset.title}` : ''}</span>
            <span>Q quality · G growth · V valuation · M momentum (0–10)</span>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Company</th><th>Rating</th><th>Scores</th>
                  {th('price', 'Price')}{th('changePct', '1D')}{th('marketCap', 'M-cap')}{th('pe', 'P/E')}{th('roe', 'ROE')}{th('divYield', 'Div. yield')}
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.symbol}>
                    <td><Link to={`/stocks/${s.ticker}`} className="cell-title">{s.name}</Link><div className="cell-sub">{s.ticker} · {s.sector}</div></td>
                    <td>{s.rating ? <Stars value={s.rating} /> : <span className="xs muted">—</span>}</td>
                    <td><ScoreDots s={s} /></td>
                    <td className="r num">{price(s.price)}</td>
                    <td className="r"><Change value={s.changePct} arrow={false} /></td>
                    <td className="r num">{s.mcapCr ? crore(s.mcapCr) : '—'}</td>
                    <td className="r num">{s.pe > 0 ? num(s.pe, 1) : '—'}</td>
                    <td className="r num">{s.roe != null ? `${num(s.roe, 1)}%` : '—'}</td>
                    <td className="r num">{s.divYield != null ? `${num(s.divYield, 2)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <div className="empty">No stocks pass these filters. Try a different screen or relax the P/E limit.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Stocks() {
  const { data, error, reload } = useApi('/api/stocks', { refresh: LIVE });
  const { data: ov } = useApi('/api/market/overview', { refresh: LIVE });
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Stocks' }]}
        eyebrow="Stocks"
        title="Know the business before you buy the share"
        lead="Live NSE prices with every company scored on quality, growth, valuation and momentum. Search the header for any listed stock."
      >
        <div className="detail-actions" style={{ alignItems: 'center' }}>
          <LiveBadge state={ov?.marketState} time={data?.asOf} />
          {data?.asOf && <span className="xs" style={{ color: 'var(--muted)' }}>Updated {timeLabel(data.asOf)}</span>}
          <Link to="/ipo" className="btn">IPO Monitor</Link>
          <Link to="/pricing#stocks" className="btn btn-accent">Get Stock Advisor</Link>
        </div>
      </PageHero>
      <div className="wrap"><ErrorBox error={error} onRetry={reload} /></div>
      {!data ? <div className="wrap section tight"><SkeletonRows rows={8} /></div> : (
        <>
          <Movers rows={data.rows} />
          <section className="section tight"><div className="wrap"><SectorBoard /></div></section>
          <Screener rows={data.rows} scored={data.scored} />
        </>
      )}
    </>
  );
}
