import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authors, stories, storyById } from '../data/stories';
import StoryCard, { StoryArt, initials } from '../components/ui/StoryCard';
import NotFound from './NotFound';
import useSeo from '../seo/useSeo';
import { storyMeta, NOT_FOUND } from '../seo/meta';

function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="read-progress" style={{ width: `${pct}%` }} aria-hidden />;
}

function Share({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const enc = encodeURIComponent;
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
  };
  return (
    <div className="share">
      <button onClick={copy} aria-label="Copy link" title={copied ? 'Copied!' : 'Copy link'}>
        {copied ? '✓' : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></svg>}
      </button>
      <a href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noreferrer noopener" aria-label="Share on WhatsApp">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.4z" /></svg>
      </a>
      <a href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noreferrer noopener" aria-label="Share on X">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.2 2H21l-6.5 7.4L22 22h-6l-4.7-6.2L5.8 22H3l7-8L2 2h6.1l4.3 5.7zm-1 18h1.6L7 4H5.3z" /></svg>
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noreferrer noopener" aria-label="Share on LinkedIn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z" /></svg>
      </a>
    </div>
  );
}

export default function StoryDetail() {
  const { id } = useParams();
  const story = storyById(id);
  useSeo(story ? storyMeta(story, authors[story.author]) : NOT_FOUND);
  if (!story) return <NotFound />;
  const au = authors[story.author];
  const related = [
    ...stories.filter((s) => s.id !== story.id && s.category === story.category),
    ...stories.filter((s) => s.id !== story.id && s.category !== story.category),
  ].slice(0, 3);

  return (
    <article>
      <ReadingProgress />
      <header className="article-head">
        <nav className="article-crumbs" aria-label="Breadcrumb">
          <Link to="/stories">Stories</Link>
          <span aria-hidden>/</span>
          <Link to={`/stories?c=${story.category}`}>{story.category}</Link>
        </nav>
        <span className="story-cat">{story.category}</span>
        <h1 className="article-title">{story.title}</h1>
        <p className="article-dek">{story.dek}</p>
        <div className="article-meta">
          <div className="author">
            <span className="avatar-sm">{initials(au.name)}</span>
            <div>
              <strong>{au.name}</strong>
              <span>{au.role} · {story.date} · {story.mins} min read</span>
            </div>
          </div>
          <Share title={story.title} />
        </div>
      </header>

      <div className="article-art"><StoryArt story={story} ratio="21 / 8" /></div>

      <div className="article-body">
        <div className="in-brief">
          <strong>In brief</strong>
          <p>{story.dek}</p>
        </div>
        {story.body.map((p, i) => (
          <div key={i}>
            <p>{p}</p>
            {i === 1 && <blockquote className="pull">Size matters more than timing. No single bet should be big enough to derail your goals.</blockquote>}
          </div>
        ))}
        <div className="note" style={{ marginTop: 8 }}>This article is for education and is not a recommendation to buy or sell any security.</div>

        <div className="author-card">
          <span className="avatar-sm">{initials(au.name)}</span>
          <div>
            <strong>{au.name}</strong>
            <span className="xs muted" style={{ display: 'block' }}>{au.role}</span>
            <p>Writes about investing for families who want clear answers, not hype. Have a question? Send it to the Ask Us desk.</p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="eyebrow">Keep reading</span><h2 style={{ marginTop: 6 }}>More from the research desk</h2></div>
            <Link to="/stories" className="link-arrow">All stories →</Link>
          </div>
          <div className="related-grid">{related.map((s) => <StoryCard key={s.id} story={s} />)}</div>
        </div>
      </section>
    </article>
  );
}
