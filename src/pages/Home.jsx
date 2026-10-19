import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { investorTypes, podcasts, videos, guides } from '../data/learn';
import { stories, storyCategories, askQuestions } from '../data/stories';
import { indianIndices, globalIndices, commodities, sectors, breadth, asOf } from '../data/markets';
import { funds } from '../data/funds';
import { plans, ratingScale } from '../data/plans';
import { Change, Chips, SectionHead, Stars, Tabs } from '../components/ui/Bits';
import Sparkline from '../components/ui/Sparkline';
import StoryCard from '../components/ui/StoryCard';
import { ScoreRing } from '../components/ui/Gauges';
import { num, pctPlain, rupee } from '../utils/format';
import { spark } from '../utils/series';

function Hero() {
  const [type, setType] = useState(investorTypes[0].id);
  const active = investorTypes.find((t) => t.id === type);
  const nifty = indianIndices[1];
  const total = breadth.advances + breadth.declines + breadth.unchanged;

  return (
    <section className="home-hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>Independent · Unbiased · Since day one</span>
          <h1 className="hero-title">Invest with clarity, <em>not noise.</em></h1>
          <p className="hero-lead">Ratings, research and simple tools for every mutual fund and stock in India — so your family's money works as hard as you do.</p>

          <div className="persona">
            <div className="persona-label">I am…</div>
            <div className="persona-tabs" role="tablist">
              {investorTypes.map((t) => (
                <button key={t.id} role="tab" aria-selected={type === t.id} className={type === t.id ? 'active' : ''} onClick={() => setType(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="persona-panel" key={active.id}>
              <h3>{active.title}</h3>
              <p>{active.text}</p>
              <ol className="persona-steps">
                {active.points.map((p, i) => <li key={p}><span>{i + 1}</span>{p}</li>)}
              </ol>
              <Link to={active.to} className="btn btn-accent">{active.cta} →</Link>
            </div>
          </div>
        </div>

        <aside className="pulse card" aria-label="Market pulse">
          <div className="pulse-head">
            <div>
              <div className="xs muted">Market pulse · {asOf}</div>
              <div className="pulse-name">{nifty.name}</div>
            </div>
            <span className="badge">Sample data</span>
          </div>
          <div className="pulse-value">
            <span className="num">{num(nifty.value)}</span>
            <Change value={nifty.changePct} pill />
          </div>
          <div className="pulse-chart">
            <Sparkline data={spark('nifty-hero', nifty.value, nifty.changePct > 0)} width={360} height={90} up={nifty.changePct > 0} />
          </div>
          <div className="pulse-breadth">
            <div className="xs muted" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="up">{breadth.advances} advances</span>
              <span className="down">{breadth.declines} declines</span>
            </div>
            <div className="breadth-bar">
              <span style={{ width: `${(breadth.advances / total) * 100}%`, background: 'var(--up)' }} />
              <span style={{ width: `${(breadth.unchanged / total) * 100}%`, background: 'var(--line-strong)' }} />
              <span style={{ width: `${(breadth.declines / total) * 100}%`, background: 'var(--down)' }} />
            </div>
          </div>
          <div className="pulse-list">
            {[indianIndices[0], indianIndices[4], indianIndices[5], globalIndices[1]].map((i) => (
              <div key={i.id}>
                <span>{i.name}</span>
                <span className="num">{num(i.value)}</span>
                <Change value={i.changePct} arrow={false} />
              </div>
            ))}
          </div>
          <Link to="/markets" className="link-arrow">Open market watch →</Link>
        </aside>
      </div>
    </section>
  );
}

function Offerings() {
  return (
    <section className="section tight">
      <div className="wrap offer-grid">
        {plans.map((p, i) => (
          <Link key={p.id} to={p.to} className={`offer card hover${p.highlight ? ' offer-hl' : ''}`}>
            <div className="offer-num">0{i + 1}</div>
            <div>
              <div className="eyebrow" style={{ fontSize: 11 }}>{p.name}</div>
              <h3>{p.tagline}</h3>
              <div className="offer-foot">
                <span className="num">{p.price ? `${rupee(p.price)}${p.period}` : p.period}</span>
                <span className="link-arrow">{p.cta} →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TopStories() {
  const [cat, setCat] = useState('Latest');
  const list = useMemo(() => (cat === 'Latest' ? stories : stories.filter((s) => s.category === cat)), [cat]);
  const [lead, ...rest] = list;
  const mostRead = [...stories].sort((a, b) => b.mins - a.mins).slice(0, 5);

  return (
    <section className="section">
      <div className="wrap">
        <SectionHead eyebrow="Research desk" title="Today's top stories" link={`/stories${cat === 'Latest' ? '' : `?c=${cat}`}`} linkLabel="More stories" />
        <div style={{ marginBottom: 24 }}>
          <Chips options={storyCategories} value={cat} onChange={setCat} />
        </div>
        {!lead ? (
          <div className="card empty">No stories in this section yet.</div>
        ) : (
          <div className="mag-grid">
            <div className="mag-lead"><StoryCard story={lead} variant="lead" /></div>
            <div className="mag-mid">
              {rest.slice(0, 2).map((s) => <StoryCard key={s.id} story={s} />)}
            </div>
            <aside className="mag-side">
              <h4 className="side-title">Most read this week</h4>
              <ol className="ranked">
                {mostRead.map((s) => (
                  <li key={s.id}>
                    <Link to={`/stories/${s.id}`}>
                      <span className="eyebrow" style={{ fontSize: 10 }}>{s.category}</span>
                      <span className="ranked-title">{s.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

function MarketSnapshot() {
  const [tab, setTab] = useState('India');
  const data = tab === 'India' ? indianIndices : tab === 'Global' ? globalIndices : commodities;
  const maxAbs = Math.max(...sectors.map((s) => Math.abs(s.changePct)));

  return (
    <section className="section alt">
      <div className="wrap">
        <SectionHead eyebrow="Markets" title="Where the market stands" text={`Index levels and sector moves at the close · ${asOf}`} link="/markets" linkLabel="Full market watch" />
        <div className="snapshot">
          <div className="card">
            <div style={{ padding: '0 12px' }}><Tabs options={['India', 'Global', 'Commodities']} value={tab} onChange={setTab} /></div>
            <div className="index-tiles">
              {data.map((x) => (
                <div key={x.id} className="index-tile">
                  <div className="small" style={{ fontWeight: 600 }}>{x.name}</div>
                  {x.region && <div className="xs muted">{x.region}</div>}
                  <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 6 }}>{x.unit === '$' ? '$' : ''}{num(x.value)}</div>
                  <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 8 }}>
                    <Change value={x.changePct} />
                    <Sparkline data={spark(x.id, x.value, x.changePct > 0)} width={70} height={26} up={x.changePct > 0} fill={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad">
            <h3 style={{ marginBottom: 4 }}>Sector heat</h3>
            <p className="xs muted" style={{ marginBottom: 14 }}>Today's move by sector, Nifty 500 universe</p>
            <div className="heat">
              {[...sectors].sort((a, b) => b.changePct - a.changePct).map((s) => {
                const a = Math.abs(s.changePct) / maxAbs;
                const bg = s.changePct >= 0 ? `rgba(17,128,74,${0.15 + a * 0.75})` : `rgba(198,58,47,${0.15 + a * 0.75})`;
                return (
                  <div key={s.name} className="heat-cell" style={{ background: bg, color: a > 0.45 ? '#fff' : 'var(--ink)' }}>
                    <span>{s.name}</span>
                    <strong className="num">{s.changePct > 0 ? '+' : ''}{s.changePct.toFixed(2)}%</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TopFunds() {
  const [type, setType] = useState('Equity');
  const list = funds.filter((f) => f.type === type && f.rating >= 4).sort((a, b) => b.ret['3y'] - a.ret['3y']).slice(0, 6);
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead eyebrow="Fund ratings" title="Highest-rated funds right now" text="Ranked on risk-adjusted returns versus their category over 3 and 5 years." link="/funds" linkLabel="Open fund screener" />
        <div style={{ marginBottom: 20 }}><Chips options={['Equity', 'Hybrid', 'Debt']} value={type} onChange={setType} /></div>
        <div className="fund-cards">
          {list.map((f) => (
            <Link key={f.id} to={`/funds/${f.id}`} className="fund-card card hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span className="badge badge-brand">{f.category}</span>
                <Stars value={f.rating} />
              </div>
              <h3>{f.name}</h3>
              <div className="fund-card-rets">
                {['1y', '3y', '5y'].map((k) => (
                  <div key={k}>
                    <div className="xs muted">{k.toUpperCase()} return</div>
                    <div className={`num ${f.ret[k] >= f.cat[k] ? 'up' : ''}`} style={{ fontWeight: 600 }}>{pctPlain(f.ret[k])}</div>
                  </div>
                ))}
              </div>
              <div className="xs muted">vs category 3Y {pctPlain(f.cat['3y'])} · Expense {f.expense}%</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const TOOLS = [
  { title: 'SIP Calculator', text: 'See what a monthly SIP can grow into.', to: '/tools?t=sip', big: true, icon: '◔' },
  { title: 'Portfolio Tracker', text: 'Every holding, rated and tracked.', to: '/portfolio', icon: '▤' },
  { title: 'Fund Screener', text: 'Filter by return, risk and cost.', to: '/funds#screener', icon: '⚲' },
  { title: 'IPO Monitor', text: 'Open, upcoming and recent listings.', to: '/ipo', icon: '◎' },
  { title: 'Retirement Planner', text: 'How much is enough? Find out.', to: '/tools?t=retire', icon: '⌂' },
  { title: 'Stock Screener', text: 'Scores across four dimensions.', to: '/stocks#screener', icon: '▦' },
];

function ToolsBento() {
  return (
    <section className="section alt">
      <div className="wrap">
        <SectionHead eyebrow="Tools" title="Do the maths in seconds" link="/tools" linkLabel="All tools" />
        <div className="bento">
          {TOOLS.map((t) => (
            <Link key={t.title} to={t.to} className={`bento-cell card hover${t.big ? ' big' : ''}`}>
              <span className="bento-icon" aria-hidden>{t.icon}</span>
              <h3>{t.title}</h3>
              <p className="small muted">{t.text}</p>
              {t.big && (
                <div className="bento-demo">
                  <div><span className="xs muted">₹10,000 / month · 15 yrs · 12%</span></div>
                  <div className="num" style={{ fontSize: 28, fontWeight: 600, color: 'var(--brand)' }}>₹50.46 L</div>
                  <div className="bar-track" style={{ marginTop: 8 }}><div className="bar-fill" style={{ width: '36%', background: 'var(--chart-3)' }} /></div>
                  <div className="xs muted" style={{ marginTop: 6 }}>Invested ₹18 L · Gains ₹32.46 L</div>
                </div>
              )}
              <span className="link-arrow" style={{ marginTop: 'auto' }}>Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RatingsExplained() {
  return (
    <section className="section">
      <div className="wrap ratings-grid">
        <div>
          <span className="eyebrow">Our ratings</span>
          <h2 style={{ marginTop: 6 }}>Two systems, one goal: fewer bad decisions</h2>
          <p className="muted" style={{ marginTop: 10 }}>
            Fund ratings compare each scheme with its peers on risk-adjusted returns. Stock scores rate a business on four independent
            dimensions, so you can see what you are paying for — and what you are not.
          </p>
          <div className="scale card">
            {ratingScale.map((r) => (
              <div key={r.stars} className="scale-row">
                <Stars value={r.stars} />
                <span className="badge">{r.label}</span>
                <span className="small muted">{r.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-pad">
          <div className="xs muted">Example · Indus Digital Services</div>
          <h3 style={{ margin: '4px 0 18px' }}>Stock scorecard</h3>
          <div className="grid-4" style={{ gap: 12 }}>
            <ScoreRing label="Quality" value={10} />
            <ScoreRing label="Growth" value={6} />
            <ScoreRing label="Valuation" value={5} />
            <ScoreRing label="Momentum" value={7} />
          </div>
          <div className="note" style={{ marginTop: 18 }}>Scores run from 0 to 10 and are refreshed after every quarterly result and weekly for momentum.</div>
          <Link to="/stocks/indus-digital" className="link-arrow" style={{ marginTop: 14 }}>See the full stock report →</Link>
        </div>
      </div>
    </section>
  );
}

function LearnStrip() {
  return (
    <section className="section alt">
      <div className="wrap">
        <SectionHead eyebrow="Learn" title="Read, watch, listen" text="Free guides, a weekly podcast and short explainers for every stage of your investing life." link="/learn" linkLabel="Knowledge centre" />
        <div className="learn-strip">
          <div className="card card-pad podcast-card">
            <span className="badge badge-accent">Podcast · Ep {podcasts[0].ep}</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '12px 0' }}>{podcasts[0].title}</h3>
            <div className="wave" aria-hidden>{Array.from({ length: 40 }, (_, i) => <span key={i} style={{ height: 8 + ((i * 37) % 28) }} />)}</div>
            <div className="small muted">{podcasts[0].mins} min · {podcasts[0].date}</div>
            <ul className="mini-list">
              {podcasts.slice(1, 4).map((p) => <li key={p.ep}><span className="num xs muted">EP {p.ep}</span> {p.title}</li>)}
            </ul>
          </div>
          <div className="video-grid">
            {videos.map((v, i) => (
              <Link to="/learn#videos" key={v.title} className="video-card">
                <div className="video-thumb" style={{ background: ['var(--brand)', 'var(--navy-2)', 'var(--chart-3)', 'var(--chart-5)'][i] }}>
                  <span className="play" aria-hidden>▶</span>
                  <span className="video-time num">{v.mins}</span>
                </div>
                <div className="xs muted" style={{ marginTop: 8 }}>{v.tag}</div>
                <div style={{ fontWeight: 600, lineHeight: 1.35 }}>{v.title}</div>
              </Link>
            ))}
          </div>
          <div className="card card-pad">
            <h3>Free guides</h3>
            <ul className="guide-list">
              {guides.slice(0, 5).map((g) => (
                <li key={g.title}>
                  <span className="guide-ico" aria-hidden>PDF</span>
                  <span style={{ flex: 1 }}>{g.title}<span className="xs muted" style={{ display: 'block' }}>{g.pages} pages · {g.tag}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function AskAndSubscribe() {
  return (
    <section className="section">
      <div className="wrap ask-grid">
        <div>
          <SectionHead eyebrow="Ask us" title="Your questions, answered plainly" />
          {askQuestions.map((q, i) => (
            <details key={q.q} className="faq" open={i === 0}>
              <summary>{q.q}</summary>
              <p>{q.a}</p>
            </details>
          ))}
          <Link to="/stories?c=Ask Us" className="link-arrow" style={{ marginTop: 16 }}>Browse all answers →</Link>
        </div>
        <div className="cta-panel">
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>The weekly letter</span>
          <h2>One email. Every Saturday. No hype.</h2>
          <p>The week's most useful research, a fund or stock worth knowing about, and one idea to improve your financial life.</p>
          <form onSubmit={(e) => e.preventDefault()} className="cta-form">
            <label htmlFor="cta-mail" className="visually-hidden">Email</label>
            <input id="cta-mail" type="email" className="input" placeholder="you@example.com" />
            <button className="btn btn-accent" type="submit">Subscribe free</button>
          </form>
          <div className="xs" style={{ color: '#8796ad' }}>Join 4,20,000+ readers. Unsubscribe anytime.</div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Offerings />
      <TopStories />
      <MarketSnapshot />
      <TopFunds />
      <ToolsBento />
      <RatingsExplained />
      <LearnStrip />
      <AskAndSubscribe />
    </>
  );
}
