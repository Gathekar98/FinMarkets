import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL, BRAND, DEFAULT_IMAGE, PAGES, breadcrumbLd } from './meta';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(data) {
  const id = 'page-jsonld';
  document.getElementById(id)?.remove();
  if (!data) return;
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = id;
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

/**
 * Keeps <title>, description, canonical, Open Graph and page JSON-LD in sync with the
 * current page. Pass a meta object (e.g. from fundMeta) or nothing to use the static
 * entry for this path. The server sends the same tags on first load (server/seo.js).
 */
export default function useSeo(meta) {
  const { pathname } = useLocation();
  const m = meta || PAGES[pathname] || PAGES['/'];
  const key = `${pathname}|${m.title}|${m.description}`;

  useEffect(() => {
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
    document.title = m.title;
    setMeta('name', 'description', m.description);
    setMeta('name', 'robots', m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setCanonical(url);
    setMeta('property', 'og:type', m.type || 'website');
    setMeta('property', 'og:site_name', BRAND);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:title', m.title);
    setMeta('property', 'og:description', m.description);
    setMeta('property', 'og:image', m.image || DEFAULT_IMAGE);
    setMeta('name', 'twitter:title', m.title);
    setMeta('name', 'twitter:description', m.description);
    setMeta('name', 'twitter:image', m.image || DEFAULT_IMAGE);
    const graph = [m.jsonLd, m.breadcrumbs && breadcrumbLd(m.breadcrumbs)].filter(Boolean);
    setJsonLd(graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
