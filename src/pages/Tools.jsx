import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHero } from '../components/ui/Bits';
import { GrowthArea } from '../components/ui/Charts';
import { rupee, rupeeShort } from '../utils/format';

function Slider({ id, label, value, onChange, min, max, step, format }) {
  return (
    <div>
      <div className="slider-head">
        <label htmlFor={id}>{label}</label>
        <span className="slider-val">{format(value)}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="xs muted" style={{ display: 'flex', justifyContent: 'space-between' }}><span>{format(min)}</span><span>{format(max)}</span></div>
    </div>
  );
}

/** Year-by-year growth of a monthly SIP with optional annual step-up. */
function sipSchedule(monthly, years, rate, stepUp = 0) {
  const i = rate / 100 / 12;
  let value = 0;
  let invested = 0;
  let m = monthly;
  const rows = [];
  for (let y = 1; y <= years; y++) {
    for (let k = 0; k < 12; k++) {
      value = (value + m) * (1 + i);
      invested += m;
    }
    rows.push({ label: `Y${y}`, invested: Math.round(invested), gain: Math.round(value - invested), value: Math.round(value) });
    m *= 1 + stepUp / 100;
  }
  return rows;
}

function Result({ rows, title = 'Expected value' }) {
  const last = rows[rows.length - 1];
  return (
    <>
      <div className="calc-result">
        <div className="xs">{title}</div>
        <div className="num">{rupeeShort(last.value)}</div>
        <div className="xs">Invested {rupeeShort(last.invested)} · Wealth gained {rupeeShort(last.gain)}</div>
      </div>
      <div style={{ display: 'flex', gap: 4, height: 10, borderRadius: 99, overflow: 'hidden' }}>
        <span style={{ width: `${(last.invested / last.value) * 100}%`, background: 'var(--chart-3)' }} />
        <span style={{ flex: 1, background: 'var(--chart-1)' }} />
      </div>
      <GrowthArea data={rows} height={240} />
    </>
  );
}

function SipCalc() {
  const [amt, setAmt] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [step, setStep] = useState(0);
  const rows = useMemo(() => sipSchedule(amt, years, rate, step), [amt, years, rate, step]);
  return (
    <div className="calc">
      <div className="calc-inputs">
        <Slider id="sa" label="Monthly investment" value={amt} onChange={setAmt} min={500} max={200000} step={500} format={rupee} />
        <Slider id="sy" label="Time period" value={years} onChange={setYears} min={1} max={40} step={1} format={(v) => `${v} yrs`} />
        <Slider id="sr" label="Expected return (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} format={(v) => `${v}%`} />
        <Slider id="ss" label="Annual step-up" value={step} onChange={setStep} min={0} max={25} step={1} format={(v) => `${v}%`} />
        <div className="note">Equity funds have historically delivered 10–14% over long periods, with large year-to-year swings. Use a conservative figure.</div>
      </div>
      <div className="calc-out"><Result rows={rows} /></div>
    </div>
  );
}

function LumpCalc() {
  const [amt, setAmt] = useState(500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(11);
  const rows = useMemo(() => Array.from({ length: years }, (_, k) => {
    const value = amt * Math.pow(1 + rate / 100, k + 1);
    return { label: `Y${k + 1}`, invested: amt, gain: Math.round(value - amt), value: Math.round(value) };
  }), [amt, years, rate]);
  return (
    <div className="calc">
      <div className="calc-inputs">
        <Slider id="la" label="One-time investment" value={amt} onChange={setAmt} min={10000} max={10000000} step={10000} format={rupeeShort} />
        <Slider id="ly" label="Time period" value={years} onChange={setYears} min={1} max={40} step={1} format={(v) => `${v} yrs`} />
        <Slider id="lr" label="Expected return (p.a.)" value={rate} onChange={setRate} min={1} max={30} step={0.5} format={(v) => `${v}%`} />
        <div className="note">Investing a large sum in equity? Consider spreading it over 6–12 months through an STP to reduce timing risk.</div>
      </div>
      <div className="calc-out"><Result rows={rows} /></div>
    </div>
  );
}

function GoalCalc() {
  const [goal, setGoal] = useState(2500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(11);
  const [infl, setInfl] = useState(6);
  const future = goal * Math.pow(1 + infl / 100, years);
  const i = rate / 100 / 12;
  const n = years * 12;
  const sip = future / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  const rows = useMemo(() => sipSchedule(sip, years, rate), [sip, years, rate]);
  return (
    <div className="calc">
      <div className="calc-inputs">
        <Slider id="gg" label="Goal amount (today's value)" value={goal} onChange={setGoal} min={100000} max={50000000} step={100000} format={rupeeShort} />
        <Slider id="gy" label="Years to goal" value={years} onChange={setYears} min={1} max={30} step={1} format={(v) => `${v} yrs`} />
        <Slider id="gi" label="Inflation" value={infl} onChange={setInfl} min={0} max={12} step={0.5} format={(v) => `${v}%`} />
        <Slider id="gr" label="Expected return (p.a.)" value={rate} onChange={setRate} min={1} max={20} step={0.5} format={(v) => `${v}%`} />
      </div>
      <div className="calc-out">
        <div className="calc-result">
          <div className="xs">Monthly SIP needed</div>
          <div className="num">{rupee(sip)}</div>
          <div className="xs">Your goal will cost {rupeeShort(future)} in {years} years at {infl}% inflation</div>
        </div>
        <GrowthArea data={rows} height={240} />
      </div>
    </div>
  );
}

function RetireCalc() {
  const [age, setAge] = useState(32);
  const [retireAt, setRetireAt] = useState(60);
  const [expense, setExpense] = useState(60000);
  const [infl, setInfl] = useState(6);
  const [rate, setRate] = useState(11);
  const years = Math.max(1, retireAt - age);
  const monthlyAtRetire = expense * Math.pow(1 + infl / 100, years);
  // Corpus for 30 years of withdrawals, assuming a 2% real return after retirement.
  const real = 0.02 / 12;
  const corpus = monthlyAtRetire * ((1 - Math.pow(1 + real, -360)) / real);
  const i = rate / 100 / 12;
  const n = years * 12;
  const sip = corpus / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  return (
    <div className="calc">
      <div className="calc-inputs">
        <Slider id="ra" label="Current age" value={age} onChange={(v) => { setAge(v); if (v >= retireAt) setRetireAt(v + 1); }} min={18} max={65} step={1} format={(v) => `${v}`} />
        <Slider id="rr" label="Retirement age" value={retireAt} onChange={(v) => setRetireAt(Math.max(v, age + 1))} min={40} max={75} step={1} format={(v) => `${v}`} />
        <Slider id="re" label="Monthly expenses today" value={expense} onChange={setExpense} min={10000} max={500000} step={5000} format={rupee} />
        <Slider id="ri" label="Inflation" value={infl} onChange={setInfl} min={3} max={10} step={0.5} format={(v) => `${v}%`} />
        <Slider id="rp" label="Return before retirement" value={rate} onChange={setRate} min={6} max={15} step={0.5} format={(v) => `${v}%`} />
      </div>
      <div className="calc-out">
        <div className="calc-result">
          <div className="xs">Retirement corpus you need</div>
          <div className="num">{rupeeShort(corpus)}</div>
          <div className="xs">To fund {rupee(monthlyAtRetire)}/month for 30 years from age {retireAt}</div>
        </div>
        <div className="kpis">
          <div><div className="kpi-label">Monthly SIP needed</div><div className="kpi-value up">{rupee(sip)}</div></div>
          <div><div className="kpi-label">Years to invest</div><div className="kpi-value">{years}</div></div>
        </div>
        <div className="note">Assumes a 2% real (post-inflation) return after retirement. Starting five years earlier typically cuts the required SIP by 35–45%.</div>
        <Link to="/learn#income" className="link-arrow">Read the retirement income track →</Link>
      </div>
    </div>
  );
}

const TOOLS = [
  { id: 'sip', icon: '◔', label: 'SIP Calculator', desc: 'Monthly investing, with optional step-up', C: SipCalc },
  { id: 'lumpsum', icon: '●', label: 'Lumpsum Calculator', desc: 'Growth of a one-time investment', C: LumpCalc },
  { id: 'goal', icon: '◎', label: 'Goal Planner', desc: 'The SIP needed to reach any goal', C: GoalCalc },
  { id: 'retire', icon: '⌂', label: 'Retirement Planner', desc: 'How big a corpus is enough?', C: RetireCalc },
];

export default function Tools() {
  const [params, setParams] = useSearchParams();
  const active = TOOLS.find((t) => t.id === params.get('t')) || TOOLS[0];
  const C = active.C;
  return (
    <>
      <PageHero crumbs={[{ label: 'Tools' }]} eyebrow="Tools & calculators" title="Plan with numbers, not guesses" lead="Simple, transparent calculators. Every assumption is visible and adjustable." />
      <section className="section tight">
        <div className="wrap tool-layout">
          <nav className="tool-menu" aria-label="Calculators">
            {TOOLS.map((t) => (
              <button key={t.id} className={active.id === t.id ? 'active' : ''} onClick={() => setParams({ t: t.id }, { replace: true })}>
                <span aria-hidden>{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <div className="card">
            <div className="card-head">
              <div><h3 style={{ fontSize: 20, fontFamily: 'var(--font-display)' }}>{active.label}</h3><div className="xs muted">{active.desc}</div></div>
            </div>
            <C key={active.id} />
          </div>
        </div>
      </section>
    </>
  );
}
