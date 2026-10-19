// Server-side SEO: per-page <head> tags, robots.txt and sitemap.xml.
// Crawlers and link previews (WhatsApp, LinkedIn, X, Bing) read the first HTML response
// without running JavaScript, so each URL gets its own title/description/OG tags here.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as svc from './services.js';
import { stories, authors } from '../src/data/stories.js';
import { STOCKS } from './universe/stocks.js';
import { SITE_URL, BRAND, DEFAULT_IMAGE, PAGES, NOT_FOUND, fundMeta, stockMeta, storyMeta, breadcrumbLd } from '../src/seo/meta.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATHS = [path.join(HERE, '..', 'dist', 'index.html'), path.join(process.cwd(), 'dist', 'index.html')];
let template = null;
function getTemplate() {
  if (template) return template;
  for (const p of TEMPLATE_PATHS) {
    try { template = fs.readFileSync(p, 'utf8'); return template; } catch { /* try next */ }
  }
  return null;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Resolve within `ms`, else null — page HTML must never wait on a slow data source. */
const within = (p, ms) => Promise.race([p.catch(() => null), new Promise((r) => setTimeout(() => r(null), ms))]);

/** Work out the meta for a path. Returns { ...meta, status }. */
export async function metaFor(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (PAGES[clean]) return { ...PAGES[clean], status: 200 };

  let m;
  if ((m = clean.match(/^\/funds\/(\d+)$/))) {
    const u = await within(svc.amfi.universe(), 2500);
    if (!u) return { ...PAGES['/funds'], title: `Mutual fund | ${BRAND}`, status: 200 };
    const f = u.byCode[Number(m[1])];
    return f ? { ...fundMeta(f), status: 200 } : { ...NOT_FOUND };
  }
  if ((m = clean.match(/^\/stocks\/([^/]+)$/))) {
    const ticker = decodeURIComponent(m[1]).toUpperCase();
    const q = await within(svc.yahoo.quotes([svc.toSymbol(ticker)]), 2000);
    if (q && q.length === 0) return { ...NOT_FOUND };
    const quote = q?.[0];
    const sector = STOCKS.find((s) => s.symbol === svc.toSymbol(ticker))?.sector;
    return { ...stockMeta({ name: quote?.name || ticker, ticker, price: quote?.price, sector }), status: 200 };
  }
  if ((m = clean.match(/^\/stories\/([^/]+)$/))) {
    const story = stories.find((s) => s.id === m[1]);
    return story ? { ...storyMeta(story, authors[story.author]), status: 200 } : { ...NOT_FOUND };
  }
  return { ...NOT_FOUND };
}

function headTags(meta, pathname) {
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
  const image = meta.image || DEFAULT_IMAGE;
  const graph = [meta.jsonLd, meta.breadcrumbs && breadcrumbLd(meta.breadcrumbs)].filter(Boolean);
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    `<meta property="og:type" content="${meta.type || 'website'}" />`,
    `<meta property="og:site_name" content="${BRAND}" />`,
    '<meta property="og:locale" content="en_IN" />',
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    process.env.GOOGLE_SITE_VERIFICATION && `<meta name="google-site-verification" content="${esc(process.env.GOOGLE_SITE_VERIFICATION)}" />`,
    process.env.BING_SITE_VERIFICATION && `<meta name="msvalidate.01" content="${esc(process.env.BING_SITE_VERIFICATION)}" />`,
    graph.length && `<script type="application/ld+json" id="page-jsonld">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n    ');
}

/** Express handler: serve the SPA shell with this page's head tags. */
export async function renderPage(req, res) {
  const html = getTemplate();
  if (!html) return res.status(500).send('Site not built. Run `npm run build`.');
  const meta = await metaFor(req.path);
  const out = html.replace(/<!--seo:start[\s\S]*?<!--seo:end-->/, headTags(meta, req.path));
  res
    .status(meta.status || 200)
    .set('Content-Type', 'text/html; charset=utf-8')
    .set('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400')
    .send(out);
}

export function robots(req, res) {
  res.type('text/plain').set('Cache-Control', 'public, max-age=3600, s-maxage=86400').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',
      'Disallow: /account',
      'Disallow: /login',
      'Disallow: /signup',
      'Disallow: /forgot-password',
      'Disallow: /reset-password',
      '',
      `Sitemap: ${SITE_URL}/sitemap.xml`,
      '',
    ].join('\n'),
  );
}

const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
const amfiToIso = (d) => { const [dd, mon, yyyy] = (d || '').split('-'); return MONTHS[mon] ? `${yyyy}-${MONTHS[mon]}-${dd}` : null; };
const storyIso = (d) => { const [dd, mon, yyyy] = d.split(' '); return MONTHS[mon] ? `${yyyy}-${MONTHS[mon]}-${dd.padStart(2, '0')}` : null; };

export async function sitemap(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];
  const add = (loc, { lastmod = today, changefreq = 'daily', priority = 0.5 } = {}) => urls.push({ loc: `${SITE_URL}${loc}`, lastmod, changefreq, priority });

  add('/', { priority: 1.0, changefreq: 'hourly' });
  for (const [p, meta] of Object.entries(PAGES)) {
    if (p === '/' || meta.noindex) continue;
    add(p, { priority: ['/funds', '/stocks', '/markets'].includes(p) ? 0.9 : 0.7, changefreq: ['/learn', '/pricing'].includes(p) ? 'weekly' : 'daily' });
  }
  for (const s of stories) add(`/stories/${s.id}`, { lastmod: storyIso(s.date) || today, changefreq: 'monthly', priority: 0.6 });
  for (const s of STOCKS) add(`/stocks/${s.symbol.replace(/\.NS$/, '')}`, { changefreq: 'daily', priority: 0.7 });

  const u = await within(svc.amfi.universe(), 20000);
  if (u) {
    const lastmod = amfiToIso(u.asOf) || today;
    for (const f of u.rows) add(`/funds/${f.code}`, { lastmod, changefreq: 'daily', priority: f.rating >= 4 ? 0.7 : 0.5 });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((x) => `  <url><loc>${esc(x.loc)}</loc><lastmod>${x.lastmod}</lastmod><changefreq>${x.changefreq}</changefreq><priority>${x.priority.toFixed(1)}</priority></url>`)
    .join('\n')}\n</urlset>\n`;
  res.type('application/xml').set('Cache-Control', `public, max-age=3600, s-maxage=${u ? 21600 : 300}`).send(xml);
}
