import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { indianIndices, globalIndices, commodities, breadth, fiiDii, asOf } from '../data/markets';
import { Change, PageHero, SectionHead, Seg } from '../components/ui/Bits';
import { PriceChart } from '../components/ui/Charts';
import Sparkline from '../components/ui/Sparkline';
import { num } from '../utils/format';
import { spark } from '../utils/series';

export default function Markets() {
  const [selected, setSelected] = useState(indianIndices[1].id);
  const [region, setRegion] = useState('India');
  const idx = [...indianIndices, ...globalIndices].find((i) => i.id === selected);
  const list = region === 'India' ? indianIndices : globalIndices;
  const total = breadth.advances + breadth.declines + breadth.unchanged;

  return (
    <>
      <PageHero crumbs={[{ label: 'Market Watch' }]} eyebrow="Market watch" title="The market, at a glance" lead={`Indian and global indices, market breadth and institutional flows. Snapshot as of ${asOf}.`} />

      <section className="section tight">
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 20 }}>
          <div className="card idx-board">
            <div className="idx-list">
              <div style={{ padding: 14, borderBottom: '1px solid var(--line)' }}>
                <Seg options={['India', 'Global']} value={region} onChange={setRegion} label="Region" />
              </div>
              {list.map((i) => (
                <button key={i.id} onClick={() => setSelected(i.id)} className="idx-pick" aria-pressed={selected === i.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 4, width: '100%', textAlign: 'left', padding: '12px 16px', border: 0,
                  borderBottom: '1px solid var(--line)', background: selected === i.id ? 'var(--brand-soft)' : 'transparent',
                  borderLeft: `3px solid ${selected === i.id ? 'var(--brand)' : 'transparent'}`,
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
                  <Change value={idx.changePct} pill />
                </div>
              </div>
              <PriceChart key={idx.id} seed={idx.id} end={idx.value} cagr={11} height={300} prefix="" />
              {idx.high52 && (
                <div className="kpis" style={{ marginTop: 16 }}>
                  <div><div className="kpi-label">52W high</div><div className="kpi-value">{num(idx.high52)}</div></div>
                  <div><div className="kpi-label">52W low</div><div className="kpi-value">{num(idx.low52)}</div></div>
                  <div><div className="kpi-label">Off high</div><div className="kpi-value down">{(((idx.value - idx.high52) / idx.high52) * 100).toFixed(1)}%</div></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap grid-2">
          <div className="card card-pad">
            <h3>Market breadth</h3>
            <p className="xs muted" style={{ marginBottom: 16 }}>NSE-listed stocks, today</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
              <div><div className="num up" style={{ fontSize: 28, fontWeight: 600 }}>{num(breadth.advances, 0)}</div><div className="xs muted">Advances</div></div>
              <div><div className="num" style={{ fontSize: 28, fontWeight: 600 }}>{breadth.unchanged}</div><div className="xs muted">Unchanged</div></div>
              <div><div className="num down" style={{ fontSize: 28, fontWeight: 600 }}>{num(breadth.declines, 0)}</div><div className="xs muted">Declines</div></div>
            </div>
            <div className="breadth-bar" style={{ height: 12, marginTop: 18 }}>
              <span style={{ width: `${(breadth.advances / total) * 100}%`, background: 'var(--up)' }} />
              <span style={{ width: `${(breadth.unchanged / total) * 100}%`, background: 'var(--line-strong)' }} />
              <span style={{ width: `${(breadth.declines / total) * 100}%`, background: 'var(--down)' }} />
            </div>
            <div className="note" style={{ marginTop: 16 }}>Advance–decline ratio of {(breadth.advances / breadth.declines).toFixed(2)} — broader market stronger than the headline indices.</div>
          </div>
          <div className="card card-pad">
            <h3>FII vs DII flows</h3>
            <p className="xs muted" style={{ marginBottom: 8 }}>Net buy (+) / sell (−) in cash market, ₹ crore</p>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={fiiDii} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 4" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 12 }} cursor={{ fill: 'var(--surface-2)' }} formatter={(v, n) => [`₹${num(v, 0)} Cr`, n]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
                  <Bar dataKey="fii" name="FII" fill="var(--chart-3)" radius={[3, 3, 3, 3]} maxBarSize={22} />
                  <Bar dataKey="dii" name="DII" fill="var(--chart-2)" radius={[3, 3, 3, 3]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap">
          <SectionHead eyebrow="Beyond equity" title="Commodities and currency" />
          <div className="grid-4">
            {commodities.map((c) => (
              <div key={c.id} className="card card-pad">
                <div className="small" style={{ fontWeight: 600 }}>{c.name}</div>
                <div className="num" style={{ fontSize: 24, fontWeight: 600, margin: '6px 0' }}>{c.unit}{num(c.value)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                  <Change value={c.changePct} pill />
                  <Sparkline data={spark(c.id, c.value, c.changePct > 0)} width={90} height={30} up={c.changePct > 0} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
