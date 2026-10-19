import { useState } from 'react';
import { useApi, LIVE, timeLabel } from '../api/client';
import { Change, PageHero, SectionHead, Seg } from '../components/ui/Bits';
import { PriceChart } from '../components/ui/Charts';
import { ErrorBox, LiveBadge, SkeletonRows } from '../components/ui/Status';
import { SectorBoard } from './Stocks';
import { num } from '../utils/format';

export default function Markets() {
  const { data, error, reload } = useApi('/api/market/overview', { refresh: LIVE });
  const [selected, setSelected] = useState('^NSEI');
  const [region, setRegion] = useState('India');

  if (!data) {
    return (
      <>
        <PageHero crumbs={[{ label: 'Market Watch' }]} eyebrow="Market watch" title="The market, at a glance" />
        <div className="wrap section tight"><ErrorBox error={error} onRetry={reload} /><SkeletonRows rows={8} /></div>
      </>
    );
  }

  const list = region === 'India' ? data.indian : data.global;
  const idx = [...data.indian, ...data.global].find((i) => i.symbol === selected) || data.indian[0];
  const { advances, declines, unchanged, universe } = data.breadth;
  const total = advances + declines + unchanged || 1;

  return (
    <>
      <PageHero crumbs={[{ label: 'Market Watch' }]} eyebrow="Market watch" title="The market, at a glance" lead="Indian and global indices, sector moves, market breadth and commodities — refreshed every minute.">
        <div className="detail-actions" style={{ alignItems: 'center' }}>
          <LiveBadge state={data.marketState} time={data.asOf} />
          <span className="xs" style={{ color: 'var(--muted)' }}>Updated {timeLabel(data.asOf)}</span>
        </div>
      </PageHero>

      <section className="section tight">
        <div className="wrap">
          <ErrorBox error={error} onRetry={reload} />
          <div className="card idx-board">
            <div className="idx-list">
              <div style={{ padding: 14, borderBottom: '1px solid var(--line)' }}>
                <Seg options={['India', 'Global']} value={region} onChange={setRegion} label="Region" />
              </div>
              {list.map((i) => (
                <button key={i.symbol} onClick={() => setSelected(i.symbol)} aria-pressed={selected === i.symbol} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 4, width: '100%', textAlign: 'left', padding: '12px 16px', border: 0,
                  borderBottom: '1px solid var(--line)', background: selected === i.symbol ? 'var(--brand-soft)' : 'transparent',
                  borderLeft: `3px solid ${selected === i.symbol ? 'var(--brand)' : 'transparent'}`,
                }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{i.name}</span>
                  <span className="num small" style={{ textAlign: 'right' }}>{num(i.value)}</span>
                  <span className="xs muted">{i.region || 'NSE / BSE'}</span>
                  <span style={{ textAlign: 'right' }}><Change value={i.changePct} arrow={false} /></span>
                </button>
              ))}
            </div>
            <div className="card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <div>
                  <div className="xs muted">{idx.region || 'India'}</div>
                  <h2>{idx.name}</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="num" style={{ fontSize: 30, fontWeight: 600 }}>{num(idx.value)}</div>
                  <span className={`num small ${idx.change >= 0 ? 'up' : 'down'}`} style={{ marginRight: 8 }}>{idx.change >= 0 ? '+' : ''}{num(idx.change)}</span>
                  <Change value={idx.changePct} pill />
                </div>
              </div>
              <PriceChart key={idx.symbol} url={`/api/market/chart/${encodeURIComponent(idx.symbol)}`} ranges={['1D', '1M', '6M', '1Y', '5Y']} initial="1D" height={300} prefix="" />
              {idx.high52 && (
                <div className="kpis" style={{ marginTop: 16 }}>
                  <div><div className="kpi-label">52W high</div><div className="kpi-value">{num(idx.high52)}</div></div>
                  <div><div className="kpi-label">52W low</div><div className="kpi-value">{num(idx.low52)}</div></div>
                  <div><div className="kpi-label">From 52W high</div><div className={`kpi-value ${idx.value < idx.high52 ? 'down' : 'up'}`}>{(((idx.value - idx.high52) / idx.high52) * 100).toFixed(1)}%</div></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap grid-2" style={{ alignItems: 'start' }}>
          <div className="card card-pad">
            <h3>Market breadth</h3>
            <p className="xs muted" style={{ marginBottom: 16 }}>Across {universe} actively tracked NSE stocks, today</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
              <div><div className="num up" style={{ fontSize: 28, fontWeight: 600 }}>{advances}</div><div className="xs muted">Advances</div></div>
              <div><div className="num" style={{ fontSize: 28, fontWeight: 600 }}>{unchanged}</div><div className="xs muted">Unchanged</div></div>
              <div><div className="num down" style={{ fontSize: 28, fontWeight: 600 }}>{declines}</div><div className="xs muted">Declines</div></div>
            </div>
            <div className="breadth-bar" style={{ height: 12, marginTop: 18 }}>
              <span style={{ width: `${(advances / total) * 100}%`, background: 'var(--up)' }} />
              <span style={{ width: `${(unchanged / total) * 100}%`, background: 'var(--line-strong)' }} />
              <span style={{ width: `${(declines / total) * 100}%`, background: 'var(--down)' }} />
            </div>
            <div className="note" style={{ marginTop: 16 }}>
              Advance–decline ratio {declines ? (advances / declines).toFixed(2) : '—'} — {advances > declines * 1.2 ? 'broad-based buying.' : declines > advances * 1.2 ? 'selling is widespread.' : 'a mixed session.'}
            </div>
          </div>
          <SectorBoard />
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <SectionHead eyebrow="Beyond equity" title="Commodities and currency" text="Gold and silver are international prices converted to rupees, excluding Indian import duty and GST." />
          <div className="grid-4">
            {data.commodities.map((c) => (
              <div key={c.symbol} className="card card-pad">
                <div className="small" style={{ fontWeight: 600 }}>{c.name}</div>
                <div className="num" style={{ fontSize: 24, fontWeight: 600, margin: '6px 0' }}>{c.unit}{num(c.value, c.value > 1000 ? 0 : 2)}</div>
                <Change value={c.changePct} pill />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
