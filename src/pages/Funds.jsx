import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { curatedLists, nfos } from '../data/funds';
import { useApi } from '../api/client';
import { Change, PageHero, RiskBadge, SectionHead, Stars, Tabs } from '../components/ui/Bits';
import { ErrorBox, SkeletonRows } from '../components/ui/Status';
import { num, pctPlain, rupee } from '../utils/format';

const PAGE = 25;

function Screener({ meta }) {
  const [params, setParams] = useSearchParams();
  const list = params.get('list') || '';
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [minRating, setMinRating] = useState(Number(params.get('rating')) || 0);
  const [sort, setSort] = useState({ key: '3y', dir: 'desc' });
  const [page, setPage] = useState(0);

  useEffect(() => { const t = setTimeout(() => setDebounced(q), 300); return () => clearTimeout(t); }, [q]);
  useEffect(() => setPage(0), [debounced, type, category, minRating, sort, list]);

  const qs = new URLSearchParams({ q: debounced, type, category, minRating: String(minRating), list, sort: sort.key, dir: sort.dir, limit: String(PAGE), offset: String(page * PAGE) });
  const { data, loading, error, reload } = useApi(`/api/funds?${qs}`);

  const categories = useMemo(() => (meta?.categories || []).filter((c) => !type || c.type === type).map((c) => c.category).sort(), [meta, type]);

  const th = (key, label) => (
    <th className="sortable r" onClick={() => setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }))} aria-sort={sort.key === key ? (sort.dir === 'desc' ? 'descending' : 'ascending') : 'none'}>
      {label} {sort.key === key ? (sort.dir === 'desc' ? '↓' : '↑') : ''}
    </th>
  );

  const toggleList = (id) => {
    const next = new URLSearchParams(params);
    if (list === id) next.delete('list'); else next.set('list', id);
    setParams(next, { replace: true });
  };

  const total = data?.total ?? 0;
  const pages = Math.ceil(total / PAGE);

  return (
    <>
      <section className="section tight">
        <div className="wrap">
          <SectionHead eyebrow="Curated" title="Start from a shortlist" text="Rule-based lists of 4★ and 5★ funds for common goals. Select one to filter the screener below." />
          <div className="list-cards">
            {curatedLists.map((c) => (
              <button key={c.id} className={`list-card${list === c.id ? ' active' : ''}`} onClick={() => toggleList(c.id)} aria-pressed={list === c.id}>
                <span className={`list-ico ${c.tone}`} aria-hidden>{c.icon}</span>
                <strong style={{ fontSize: 17 }}>{c.title}</strong>
                <span className="small muted">{c.blurb}</span>
                <span className="xs" style={{ color: 'var(--brand)', fontWeight: 600 }}>{meta ? `${meta.curated[c.id]} funds` : '…'} {list === c.id ? '· selected' : ''}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" id="screener" style={{ scrollMarginTop: 110 }}>
        <div className="wrap">
          <SectionHead eyebrow="Fund screener" title="Find the right fund" />
          <div className="card">
            <div className="filters">
              <div className="field grow">
                <label htmlFor="fq">Search</label>
                <input id="fq" className="input" placeholder="Fund or fund house" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="ft">Asset class</label>
                <select id="ft" className="select" value={type} onChange={(e) => { setType(e.target.value); setCategory(''); }}>
                  <option value="">All</option>
                  {(meta?.types || []).map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="fc">Category</label>
                <select id="fc" className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">All</option>
                  {categories.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="fr">Minimum rating</label>
                <select id="fr" className="select" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                  <option value={0}>Any</option>
                  {[3, 4, 5].map((r) => <option key={r} value={r}>{r}★ and above</option>)}
                </select>
              </div>
            </div>
            <div className="result-count">
              <span>{data ? `${num(total, 0)} funds` : 'Loading…'}{list ? ` in “${curatedLists.find((c) => c.id === list)?.title}”` : ''}</span>
              <span>Direct plans · Growth option · NAV as of {data?.asOf || '…'} · Returns above 1Y are annualised</span>
            </div>
            <ErrorBox error={error} onRetry={reload} />
            {loading && !data ? <SkeletonRows rows={8} /> : (
              <div className="table-wrap" style={{ opacity: loading ? 0.6 : 1 }}>
                <table className="data">
                  <thead>
                    <tr>
                      <th className="sortable" onClick={() => setSort((s) => ({ key: 'name', dir: s.key === 'name' && s.dir === 'asc' ? 'desc' : 'asc' }))}>Fund</th>
                      <th className="sortable" onClick={() => setSort((s) => ({ key: 'rating', dir: s.key === 'rating' && s.dir === 'desc' ? 'asc' : 'desc' }))}>Rating</th>
                      <th>Risk</th>
                      {th('1m', '1M')}{th('1y', '1Y')}{th('3y', '3Y')}{th('5y', '5Y')}
                      <th className="r">NAV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.rows.map((f) => (
                      <tr key={f.code}>
                        <td>
                          <Link to={`/funds/${f.code}`} className="cell-title">{f.name}</Link>
                          <div className="cell-sub">{f.category} · {f.amc}</div>
                        </td>
                        <td>{f.rating ? <Stars value={f.rating} /> : <span className="xs muted">Unrated</span>}</td>
                        <td><RiskBadge risk={f.risk} /></td>
                        <td className="r num">{pctPlain(f.ret['1m'])}</td>
                        <td className="r num">{pctPlain(f.ret['1y'])}</td>
                        <td className="r num" style={{ fontWeight: 600 }}>{pctPlain(f.ret['3y'])}</td>
                        <td className="r num">{pctPlain(f.ret['5y'])}</td>
                        <td className="r">
                          <div className="num">{num(f.nav)}</div>
                          {f.ret['1d'] != null && <Change value={f.ret['1d']} arrow={false} />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data?.rows.length === 0 && <div className="empty">No funds match these filters. Try lowering the minimum rating.</div>}
              </div>
            )}
            {pages > 1 && (
              <div className="pager">
                <button className="btn btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Previous</button>
                <span className="muted">Page {page + 1} of {pages}</span>
                <button className="btn btn-sm" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryMonitor({ meta }) {
  const tabs = ['Equity', 'Debt', 'Hybrid', 'Index', 'Solution', 'International'].filter((t) => meta?.categories.some((c) => c.type === t));
  const [tab, setTab] = useState('Equity');
  const rows = (meta?.categories || []).filter((c) => c.type === tab && c.count >= 3).sort((a, b) => (b.ret['5y'] ?? -99) - (a.ret['5y'] ?? -99));
  const max = Math.max(1, ...rows.map((c) => c.ret['5y'] ?? 0));
  return (
    <section className="section alt" id="categories" style={{ scrollMarginTop: 110 }}>
      <div className="wrap">
        <SectionHead eyebrow="Category monitor" title="How each category has done" text="Average annualised returns of all direct-plan funds in each category, recalculated every evening from AMFI NAVs. The bar shows the 5-year figure." />
        <div className="card">
          <div style={{ padding: '0 12px' }}><Tabs options={tabs.length ? tabs : ['Equity']} value={tab} onChange={setTab} /></div>
          {!meta ? <SkeletonRows rows={6} /> : (
            <div className="cat-bars">
              <div className="cat-bar-row head"><span>Category</span><span>5Y return</span><span className="r">1Y</span><span className="r">3Y</span><span className="r">Funds</span></div>
              {rows.map((c) => (
                <div key={c.category} className="cat-bar-row">
                  <div style={{ fontWeight: 600 }}>{c.category}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="bar-track" style={{ flex: 1 }}><div className="bar-fill" style={{ width: `${Math.max(0, ((c.ret['5y'] ?? 0) / max) * 100)}%` }} /></div>
                    <span className="num small" style={{ width: 56, textAlign: 'right', fontWeight: 600 }}>{pctPlain(c.ret['5y'])}</span>
                  </div>
                  <span className={`num ${c.ret['1y'] < 0 ? 'down' : ''}`} style={{ textAlign: 'right' }}>{pctPlain(c.ret['1y'])}</span>
                  <span className="num" style={{ textAlign: 'right' }}>{pctPlain(c.ret['3y'])}</span>
                  <span className="num muted" style={{ textAlign: 'right' }}>{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Nfos() {
  return (
    <section className="section" id="nfo" style={{ scrollMarginTop: 110 }}>
      <div className="wrap">
        <SectionHead eyebrow="New fund offers" title="Open and upcoming NFOs" text="Curated by our editors. A new fund has no track record — read our checklist before you subscribe." link="/stories" linkLabel="NFO checklist" />
        <div className="nfo-grid">
          {nfos.map((n) => (
            <div key={n.name} className="nfo card">
              <span className="badge badge-accent" style={{ justifySelf: 'start' }}>{n.category}</span>
              <h3 style={{ fontSize: 16 }}>{n.name}</h3>
              <div className="xs muted">{n.amc}</div>
              <div className="timeline"><span>Opens<br /><strong style={{ color: 'var(--ink)' }}>{n.opens}</strong></span><span style={{ textAlign: 'right' }}>Closes<br /><strong style={{ color: 'var(--ink)' }}>{n.closes}</strong></span></div>
              <div className="small">Min. investment <strong className="num">{rupee(n.minInv)}</strong></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Funds() {
  const { data: meta, error, reload } = useApi('/api/funds/meta');
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Mutual Funds' }]}
        eyebrow="Mutual funds"
        title="Every fund, rated and ranked"
        lead="Every open-ended direct plan in India, with returns recalculated each evening from official AMFI NAVs and rated against its own category."
      >
        <div className="detail-meta" style={{ marginTop: 22 }}>
          <span className="badge">{meta ? `${num(meta.total, 0)} funds` : 'Loading…'}</span>
          <span className="badge">{meta ? `${meta.categories.length} categories` : '…'}</span>
          <span className="badge">NAV date {meta?.asOf || '…'}</span>
        </div>
      </PageHero>
      <div className="wrap"><ErrorBox error={error} onRetry={reload} /></div>
      <Screener meta={meta} />
      <CategoryMonitor meta={meta} />
      <Nfos />
    </>
  );
}
