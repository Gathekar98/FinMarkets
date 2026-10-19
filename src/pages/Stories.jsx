import { useSearchParams } from 'react-router-dom';
import { stories, storyCategories } from '../data/stories';
import { Chips, PageHero } from '../components/ui/Bits';
import StoryCard from '../components/ui/StoryCard';

export default function Stories() {
  const [params, setParams] = useSearchParams();
  const cat = storyCategories.includes(params.get('c')) ? params.get('c') : 'Latest';
  const list = cat === 'Latest' ? stories : stories.filter((s) => s.category === cat);

  return (
    <>
      <PageHero crumbs={[{ label: 'Stories' }]} eyebrow="Research desk" title="Analysis you can act on" lead="Stock deep-dives, fund picks, personal-finance explainers and answers to readers' questions." />
      <section className="section">
        <div className="wrap">
          <div style={{ marginBottom: 28 }}>
            <Chips options={storyCategories} value={cat} onChange={(c) => setParams(c === 'Latest' ? {} : { c }, { replace: true })} />
          </div>
          {list.length === 0 ? (
            <div className="card empty">Nothing here yet — check back soon.</div>
          ) : (
            <div className="story-list-grid">
              {list.map((s) => <StoryCard key={s.id} story={s} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
