import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { stories, storyCategories } from '../data/stories';
import { PageHero, Tabs } from '../components/ui/Bits';
import StoryCard from '../components/ui/StoryCard';

export default function Stories() {
  const [params, setParams] = useSearchParams();
  const cat = storyCategories.includes(params.get('c')) ? params.get('c') : 'Latest';
  const [q, setQ] = useState('');
  const setCat = (c) => setParams(c === 'Latest' ? {} : { c }, { replace: true });

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return stories
      .filter((s) => cat === 'Latest' || s.category === cat)
      .filter((s) => !term || s.title.toLowerCase().includes(term) || s.dek.toLowerCase().includes(term));
  }, [cat, q]);

  const [featured, ...rest] = list;
  const mostRead = [...stories].sort((a, b) => b.mins - a.mins).slice(0, 5);
  const counts = Object.fromEntries(storyCategories.map((c) => [c, c === 'Latest' ? stories.length : stories.filter((s) => s.category === c).length]));

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Stories' }]}
        eyebrow="Research desk"
        title="Stories & analysis"
        lead="Stock deep-dives, fund picks, plain-English personal finance and answers to readers' questions — written to help you decide, not to sell."
      />

      <div className="stories-bar">
        <div className="wrap">
          <Tabs options={storyCategories} value={cat} onChange={setCat} />
          <label className="stories-search">
            <span className="visually-hidden">Search stories</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input className="input" placeholder="Search stories" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="wrap stories-layout">
          <div>
            {!featured ? (
              <div className="card empty">
                {q ? <>No stories match “{q}”. <button className="btn btn-sm" onClick={() => setQ('')}>Clear search</button></> : 'Nothing in this section yet — check back soon.'}
              </div>
            ) : (
              <>
                <StoryCard story={featured} variant="feature" />
                {rest.length > 0 && (
                  <>
                    <div className="list-heading">
                      <h2>{cat === 'Latest' ? 'Latest stories' : cat}</h2>
                      <span className="xs muted">{list.length} {list.length === 1 ? 'story' : 'stories'}</span>
                    </div>
                    <div>{rest.map((s) => <StoryCard key={s.id} story={s} variant="row" />)}</div>
                  </>
                )}
              </>
            )}
          </div>

          <aside className="stories-side">
            <div>
              <div className="side-title">Most read this week</div>
              <ol className="ranked">
                {mostRead.map((s) => <li key={s.id}><StoryCard story={s} variant="mini" /></li>)}
              </ol>
            </div>
            <div className="side-card">
              <div className="side-title">Browse topics</div>
              <div className="topic-cloud">
                {storyCategories.filter((c) => c !== 'Latest').map((c) => (
                  <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(cat === c ? 'Latest' : c)}>
                    {c} <span className="muted">{counts[c]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="side-card" style={{ background: 'var(--brand-soft)', borderColor: 'transparent' }}>
              <div className="side-title" style={{ color: 'var(--brand)' }}>The weekly letter</div>
              <p className="small" style={{ color: 'var(--ink-2)', margin: '4px 0 12px' }}>The week's most useful research in one calm Saturday email.</p>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: 8 }}>
                <label htmlFor="sl-mail" className="visually-hidden">Email</label>
                <input id="sl-mail" type="email" className="input" placeholder="you@example.com" />
                <button className="btn btn-primary" type="submit">Subscribe free</button>
              </form>
            </div>
            <Link to="/stories?c=Ask Us" className="side-card" style={{ display: 'block' }}>
              <div className="side-title">Ask us</div>
              <p className="small" style={{ color: 'var(--ink-2)' }}>Have a money question? Our team answers readers every week.</p>
              <span className="link-arrow" style={{ marginTop: 8 }}>Read answers →</span>
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
