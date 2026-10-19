import { Link } from 'react-router-dom';
import { authors } from '../../data/stories';

// Each category gets a quiet tint and a simple glyph, so thumbnails stay calm and consistent.
const CATEGORY_STYLE = {
  'Stock Ideas': { tint: 'var(--brand)', glyph: 'chart' },
  'Fund Picks': { tint: 'var(--chart-3)', glyph: 'stack' },
  'Fund Insight': { tint: 'var(--chart-3)', glyph: 'lens' },
  'Wealth Insight': { tint: 'var(--accent)', glyph: 'coin' },
  'Ask Us': { tint: 'var(--chart-4)', glyph: 'ask' },
  Announcements: { tint: 'var(--chart-5)', glyph: 'spark' },
};

const Glyph = ({ kind }) => {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'stack': return <g {...common}><rect x="5" y="13" width="14" height="5" rx="1.5" /><rect x="7" y="7" width="10" height="5" rx="1.5" /></g>;
    case 'lens': return <g {...common}><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></g>;
    case 'coin': return <g {...common}><ellipse cx="12" cy="8" rx="7" ry="3" /><path d="M5 8v4c0 1.7 3.1 3 7 3s7-1.3 7-3V8M5 12v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" /></g>;
    case 'ask': return <g {...common}><path d="M4 5h16v11H9l-5 4z" /><path d="M10 9.5a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6.9V13" /></g>;
    case 'spark': return <g {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></g>;
    default: return <g {...common}><path d="M4 18 9 12l4 3 7-9" /><path d="M15 6h5v5" /></g>;
  }
};

/** Soft tinted thumbnail with a faint grid, a trend line and the category glyph. */
export function StoryArt({ story, ratio = '16 / 9', badge = false }) {
  const { tint, glyph } = CATEGORY_STYLE[story.category] || CATEGORY_STYLE['Stock Ideas'];
  const n = story.id.length;
  const line = `M0,${70 - (n % 9)} C40,${60 + (n % 7)} 70,${78 - (n % 5)} 110,${52 + (n % 11)} S170,${36 + (n % 6)} 200,${30 + (n % 9)}`;
  return (
    <div className="story-art" style={{ aspectRatio: ratio, '--tint': tint }} aria-hidden>
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="story-art-bg">
        {[20, 40, 60, 80].map((y) => <line key={y} x1="0" x2="200" y1={y} y2={y} />)}
        <path d={`${line} L200,100 L0,100 Z`} className="area" />
        <path d={line} className="trend" />
      </svg>
      <span className="story-art-glyph"><svg width="22" height="22" viewBox="0 0 24 24"><Glyph kind={glyph} /></svg></span>
      {badge && <span className="story-art-badge">{story.category}</span>}
    </div>
  );
}

export const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');

export function Byline({ story, avatar = false }) {
  const au = authors[story.author];
  return (
    <div className="byline">
      {avatar && <span className="avatar-sm">{initials(au.name)}</span>}
      <span className="byline-name">{au.name}</span>
      <span aria-hidden>·</span>
      <span>{story.date}</span>
      <span aria-hidden>·</span>
      <span>{story.mins} min read</span>
    </div>
  );
}

/**
 * Variants:
 *  feature — large, image beside text (listing lead)
 *  card    — image on top (grids)
 *  row     — text with small thumbnail on the right (lists)
 *  mini    — text only (sidebars)
 */
export default function StoryCard({ story, variant = 'card' }) {
  const to = `/stories/${story.id}`;
  if (variant === 'mini') {
    return (
      <Link to={to} className="story-mini">
        <span className="story-cat">{story.category}</span>
        <span className="story-mini-title">{story.title}</span>
      </Link>
    );
  }
  if (variant === 'row') {
    return (
      <Link to={to} className="story-row">
        <div className="story-row-text">
          <span className="story-cat">{story.category}</span>
          <h3 className="story-title">{story.title}</h3>
          <p className="story-dek">{story.dek}</p>
          <Byline story={story} />
        </div>
        <div className="story-row-thumb"><StoryArt story={story} ratio="4 / 3" /></div>
      </Link>
    );
  }
  if (variant === 'feature') {
    return (
      <Link to={to} className="story-feature">
        <StoryArt story={story} ratio="16 / 10" />
        <div className="story-feature-text">
          <span className="story-cat">{story.category}</span>
          <h3 className="story-title lg">{story.title}</h3>
          <p className="story-dek">{story.dek}</p>
          <Byline story={story} avatar />
          <span className="link-arrow">Read story →</span>
        </div>
      </Link>
    );
  }
  return (
    <Link to={to} className="story-card">
      <StoryArt story={story} />
      <div className="story-card-text">
        <span className="story-cat">{story.category}</span>
        <h3 className="story-title">{story.title}</h3>
        <Byline story={story} />
      </div>
    </Link>
  );
}
