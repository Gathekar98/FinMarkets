import { Link } from 'react-router-dom';
import { authors } from '../../data/stories';

const ART = {
  brand: ['var(--brand)', 'var(--chart-3)'],
  accent: ['var(--accent)', 'var(--chart-5)'],
  navy: ['var(--navy-2)', 'var(--chart-4)'],
};

/** Generated abstract artwork so stories have visual weight without stock imagery. */
export function StoryArt({ story, height = 180 }) {
  const [a, b] = ART[story.tone] || ART.brand;
  const seed = story.id.length;
  return (
    <div style={{ height, borderRadius: 10, overflow: 'hidden', background: a, position: 'relative' }} aria-hidden>
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        <circle cx={300 + (seed % 5) * 10} cy={40} r={110} fill={b} opacity="0.55" />
        <circle cx={60} cy={190} r={90} fill="#fff" opacity="0.08" />
        <path d={`M0,${150 - seed} C80,${110 + seed} 160,170 240,${100 - seed} S360,60 400,${80 + seed}`} stroke="#fff" strokeOpacity="0.7" strokeWidth="3" fill="none" />
        <path d={`M0,${170 - seed} C90,${150 + seed} 170,190 250,${135 - seed} S360,110 400,${120 + seed}`} stroke="#fff" strokeOpacity="0.3" strokeWidth="2" fill="none" />
      </svg>
      <span className="badge" style={{ position: 'absolute', left: 12, top: 12, background: 'rgba(255,255,255,0.92)', color: '#0f1b2d' }}>{story.category}</span>
    </div>
  );
}

export function Byline({ story }) {
  const au = authors[story.author];
  return (
    <div className="xs muted" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{au.name}</span>
      <span>·</span>
      <span>{story.date}</span>
      <span>·</span>
      <span>{story.mins} min read</span>
    </div>
  );
}

export default function StoryCard({ story, variant = 'card' }) {
  if (variant === 'row') {
    return (
      <Link to={`/stories/${story.id}`} className="story-row">
        <span className="eyebrow" style={{ fontSize: 11 }}>{story.category}</span>
        <h3>{story.title}</h3>
        <Byline story={story} />
      </Link>
    );
  }
  return (
    <Link to={`/stories/${story.id}`} className="story-card">
      <StoryArt story={story} height={variant === 'lead' ? 280 : 160} />
      <div style={{ paddingTop: 14 }}>
        <h3 className={variant === 'lead' ? 'lead-title' : ''}>{story.title}</h3>
        {variant === 'lead' && <p className="muted" style={{ marginTop: 8 }}>{story.dek}</p>}
        <div style={{ marginTop: 10 }}><Byline story={story} /></div>
      </div>
    </Link>
  );
}
