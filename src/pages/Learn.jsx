import { Link } from 'react-router-dom';
import { tracks, guides, podcasts, videos, glossary } from '../data/learn';
import { PageHero, SectionHead } from '../components/ui/Bits';

export default function Learn() {
  return (
    <>
      <PageHero crumbs={[{ label: 'Knowledge Centre' }]} eyebrow="Knowledge centre" title="Learn to invest, one clear step at a time" lead="Four learning tracks, free downloadable guides, a weekly podcast and a plain-English glossary.">
        <div className="detail-actions">
          {tracks.map((t) => <a key={t.id} href={`#${t.id}`} className="btn btn-sm">{t.title}</a>)}
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Learning tracks" title="Pick the path that fits you" />
          <div className="track-grid">
            {tracks.map((t, i) => (
              <article key={t.id} id={t.id} className="track card">
                <div className="track-head">
                  <span className="track-num">{i + 1}</span>
                  <div>
                    <h3 style={{ fontSize: 19, fontFamily: 'var(--font-display)' }}>{t.title}</h3>
                    <p className="small muted">{t.blurb}</p>
                  </div>
                </div>
                <ol className="lessons">
                  {t.lessons.map((l, k) => <li key={l}>{l}<span className="xs muted">{4 + ((k * 3) % 5)} min</span></li>)}
                </ol>
                <div style={{ padding: '0 20px 20px' }}>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '0%' }} /></div>
                  <div className="xs muted" style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between' }}><span>0 of {t.lessons.length} lessons done</span><span className="link-arrow" style={{ fontSize: 12 }}>Start track →</span></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="guides" style={{ scrollMarginTop: 110 }}>
        <div className="wrap">
          <SectionHead eyebrow="Free guides" title="Downloadable investor guides" text="In-depth PDFs written by our research team. Free with a registered account." />
          <div className="grid-3">
            {guides.map((g, i) => (
              <div key={g.title} className="card card-pad" style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 70, height: 92, flex: 'none', borderRadius: '4px 14px 4px 4px', background: ['var(--brand)', 'var(--navy-2)', 'var(--chart-3)', 'var(--accent)', 'var(--chart-4)', 'var(--chart-5)'][i], display: 'grid', placeItems: 'end start', padding: 8, color: '#fff', fontSize: 10, fontWeight: 800 }}>GUIDE</div>
                <div style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
                  <span className="badge" style={{ justifySelf: 'start' }}>{g.tag}</span>
                  <strong>{g.title}</strong>
                  <span className="xs muted">{g.pages} pages · PDF</span>
                  <button className="btn btn-sm" style={{ justifySelf: 'start', marginTop: 4 }}>Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="podcast" style={{ scrollMarginTop: 110 }}>
        <div className="wrap grid-2" style={{ alignItems: 'start' }}>
          <div>
            <SectionHead eyebrow="Podcast" title="The weekly money conversation" />
            <div className="card">
              {podcasts.map((p) => (
                <div key={p.ep} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 14, alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
                  <button className="icon-btn" aria-label={`Play episode ${p.ep}`} style={{ borderRadius: '50%', background: 'var(--brand)', color: 'var(--brand-ink)', border: 0 }}>▶</button>
                  <div><div className="xs muted num">EP {p.ep} · {p.date}</div><div style={{ fontWeight: 600 }}>{p.title}</div></div>
                  <span className="xs muted">{p.mins} min</span>
                </div>
              ))}
            </div>
          </div>
          <div id="videos" style={{ scrollMarginTop: 110 }}>
            <SectionHead eyebrow="Videos" title="Short explainers" />
            <div className="video-grid">
              {videos.map((v, i) => (
                <div key={v.title} className="video-card">
                  <div className="video-thumb" style={{ background: ['var(--brand)', 'var(--navy-2)', 'var(--chart-3)', 'var(--chart-5)'][i] }}>
                    <span className="play" aria-hidden>▶</span>
                    <span className="video-time num">{v.mins}</span>
                  </div>
                  <div className="xs muted" style={{ marginTop: 8 }}>{v.tag}</div>
                  <div style={{ fontWeight: 600 }}>{v.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" id="glossary" style={{ scrollMarginTop: 110 }}>
        <div className="wrap">
          <SectionHead eyebrow="Glossary" title="Jargon, decoded" link="/stories" linkLabel="Read our stories" />
          <dl className="glossary">
            {glossary.map((g) => <div key={g.term}><dt>{g.term}</dt><dd>{g.def}</dd></div>)}
          </dl>
          <div style={{ marginTop: 24 }}><Link to="/tools" className="btn btn-primary">Try the calculators →</Link></div>
        </div>
      </section>
    </>
  );
}
