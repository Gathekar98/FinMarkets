import { Link, useParams } from 'react-router-dom';
import { authors, stories, storyById } from '../data/stories';
import StoryCard, { StoryArt } from '../components/ui/StoryCard';
import NotFound from './NotFound';

export default function StoryDetail() {
  const { id } = useParams();
  const story = storyById(id);
  if (!story) return <NotFound />;
  const au = authors[story.author];
  const more = stories.filter((s) => s.id !== story.id && s.category === story.category).concat(stories.filter((s) => s.id !== story.id)).filter((s, i, a) => a.indexOf(s) === i).slice(0, 3);

  return (
    <article>
      <header className="section tight" style={{ paddingBottom: 0 }}>
        <div className="wrap article">
          <nav className="xs muted" style={{ marginBottom: 14 }}><Link to="/stories">Stories</Link> / <Link to={`/stories?c=${story.category}`}>{story.category}</Link></nav>
          <span className="eyebrow">{story.category}</span>
          <h1 style={{ marginTop: 10, fontSize: 'clamp(30px, 4vw, 44px)' }}>{story.title}</h1>
          <p style={{ fontSize: 19, color: 'var(--ink-2)', marginTop: 14, fontFamily: 'inherit' }}>{story.dek}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
            <span style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--brand-soft)', color: 'var(--brand)', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
              {au.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </span>
            <div>
              <div style={{ fontWeight: 600 }}>{au.name}</div>
              <div className="xs muted">{au.role} · {story.date} · {story.mins} min read</div>
            </div>
          </div>
          <StoryArt story={story} height={300} />
        </div>
      </header>

      <div className="section tight">
        <div className="wrap article">
          {story.body.map((p, i) => (
            <div key={i}>
              <p>{p}</p>
              {i === 1 && <blockquote className="pullquote">“Size matters more than timing. No single bet should be big enough to derail your goals.”</blockquote>}
            </div>
          ))}
          <div className="note" style={{ marginTop: 10 }}>This article is for education and is not a recommendation to buy or sell any security. Figures are illustrative.</div>
        </div>
      </div>

      <section className="section alt">
        <div className="wrap">
          <h2 style={{ marginBottom: 24 }}>Keep reading</h2>
          <div className="story-list-grid">{more.map((s) => <StoryCard key={s.id} story={s} />)}</div>
        </div>
      </section>
    </article>
  );
}
