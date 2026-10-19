import { useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useApi, LIVE } from '../../api/client';
import { ErrorBox, Skeleton } from './Status';
import { num } from '../../utils/format';
import { Seg } from './Bits';

export const PALETTE = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)', 'var(--line-strong)'];

const tipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: 8,
  boxShadow: 'var(--shadow)',
  fontSize: 12,
  color: 'var(--ink)',
};

const axisProps = { tick: { fontSize: 11, fill: 'var(--muted)' }, axisLine: false, tickLine: false };

const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtTick = (t, range) => {
  const d = new Date(t);
  if (range === '1D') return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  if (['3Y', '5Y', 'MAX'].includes(range)) return `${MON[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
  return `${d.getDate()} ${MON[d.getMonth()]}`;
};

/** Live price / NAV chart. `url` returns [{t, v}] for ?range=… */
export function PriceChart({ url, ranges = ['1M', '6M', '1Y', '3Y', '5Y'], initial = '1Y', height = 280, prefix = '₹' }) {
  const [range, setRange] = useState(initial);
  const { data, loading, error, reload } = useApi(`${url}?range=${range}`, { refresh: range === '1D' ? LIVE : 0 });
  const points = data || [];
  const first = points[0]?.v;
  const last = points[points.length - 1]?.v;
  const chg = first ? ((last - first) / first) * 100 : 0;
  const color = chg >= 0 ? 'var(--up)' : 'var(--down)';
  const gid = `pc-${url.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <div className="small">
          <span className="muted">{range} change </span>
          {points.length > 1 && <strong className={`num ${chg >= 0 ? 'up' : 'down'}`}>{chg >= 0 ? '+' : ''}{chg.toFixed(2)}%</strong>}
        </div>
        <Seg options={ranges} value={range} onChange={setRange} label="Chart range" />
      </div>
      <ErrorBox error={error} onRetry={reload} />
      <div style={{ width: '100%', height, position: 'relative' }}>
        {loading && !points.length ? <Skeleton h={height} /> : points.length < 2 ? <div className="empty">No price history available for this range.</div> : (
          <ResponsiveContainer>
            <AreaChart data={points} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 4" />
              <XAxis dataKey="t" {...axisProps} minTickGap={40} tickFormatter={(t) => fmtTick(t, range)} />
              <YAxis {...axisProps} width={60} domain={['auto', 'auto']} tickFormatter={(v) => num(v, v > 1000 ? 0 : 1)} orientation="right" />
              <Tooltip contentStyle={tipStyle} formatter={(v) => [`${prefix}${num(v)}`, 'Value']} labelFormatter={(t) => new Date(t).toLocaleString('en-IN', range === '1D' ? { hour: 'numeric', minute: '2-digit' } : { day: 'numeric', month: 'short', year: 'numeric' })} labelStyle={{ color: 'var(--muted)' }} />
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gid})`} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function Donut({ data, height = 220, inner = 62, unit = '%', center }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ width: height, height, position: 'relative', flex: 'none' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={inner} outerRadius={height / 2 - 6} paddingAngle={1.5} stroke="var(--surface)" strokeWidth={2}>
              {data.map((d, i) => <Cell key={d.name} fill={PALETTE[i % PALETTE.length]} />)}
            </Pie>
            <Tooltip contentStyle={tipStyle} formatter={(v, n) => [`${v}${unit}`, n]} />
          </PieChart>
        </ResponsiveContainer>
        {center && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', pointerEvents: 'none' }}>
            <div>{center}</div>
          </div>
        )}
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, minWidth: 160 }}>
        {data.map((d, i) => (
          <li key={d.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: PALETTE[i % PALETTE.length] }} />
              {d.name}
            </span>
            <span className="num">{d.value}{unit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Grouped bars, e.g. fund vs category returns or revenue vs profit. */
export function GroupedBars({ data, keys, names, height = 260, unit = '%', colors = PALETTE }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 0, left: -12, bottom: 0 }} barGap={4}>
          <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 4" />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis {...axisProps} tickFormatter={(v) => `${num(v, 0)}${unit === '%' ? '%' : ''}`} />
          <Tooltip contentStyle={tipStyle} cursor={{ fill: 'var(--surface-2)' }} formatter={(v, n) => [unit === '%' ? `${v}%` : `₹${num(v, 0)} Cr`, n]} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} name={names?.[i] || k} fill={colors[i]} radius={[4, 4, 0, 0]} maxBarSize={34} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Stacked area showing invested vs wealth gained — used by calculators. */
export function GrowthArea({ data, height = 260 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 4" />
          <XAxis dataKey="label" {...axisProps} minTickGap={20} />
          <YAxis {...axisProps} width={60} tickFormatter={(v) => (v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : `${(v / 1e5).toFixed(0)}L`)} />
          <Tooltip contentStyle={tipStyle} formatter={(v, n) => [`₹${num(v, 0)}`, n]} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
          <Area type="monotone" dataKey="invested" name="Invested" stackId="1" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.25} />
          <Area type="monotone" dataKey="gain" name="Wealth gained" stackId="1" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
