// Page titles, descriptions and structured data — shared by the browser (useSeo)
// and the server (server/seo.js), so crawlers and visitors always see the same thing.
// Plain JS with no browser or Node APIs, so both sides can import it.

/** Canonical site address. Change this one line when you move to a custom domain. */
export const SITE_URL = 'https://fin-markets.vercel.app';
export const BRAND = 'finMarkets';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const t = (s) => `${s} | ${BRAND}`;

/** Static pages. `noindex` keeps private/utility pages out of search results. */
export const PAGES = {
  '/': {
    title: 'finMarkets — Mutual Fund Ratings, Live Stock Prices & Investing Tools',
    description: 'finMarkets: independent ratings for every Indian mutual fund, live NSE stock prices with quality and valuation scores, SIP and retirement calculators, and a free portfolio tracker.',
  },
  '/funds': {
    title: t('Mutual Funds — Ratings, Returns & Screener for 1,300+ Direct Plans'),
    description: 'Compare every Indian mutual fund (direct plans) by 1Y, 3Y and 5Y returns, category rank and risk. Ratings recalculated daily from official AMFI NAVs.',
  },
  '/stocks': {
    title: t('Stocks — Live NSE Prices, Screener, Gainers & Losers'),
    description: 'Live NSE share prices for 100+ leading Indian companies, scored on quality, growth, valuation and momentum. Ready-made stock screens, top gainers and losers.',
  },
  '/markets': {
    title: t('Market Watch — Sensex, Nifty, Sector Indices & Global Markets'),
    description: 'Live Sensex, Nifty 50, Nifty Bank and sector indices, market breadth, global markets, gold, silver, crude and USD/INR in one place.',
  },
  '/ipo': {
    title: t('IPO Monitor — Upcoming, Open and Recently Listed IPOs'),
    description: 'Track mainboard IPOs in India: open and upcoming issues, price bands, subscription and listing gains.',
  },
  '/tools': {
    title: t('SIP, Lumpsum, Goal & Retirement Calculators'),
    description: 'Free SIP calculator with step-up, lumpsum calculator, goal planner and retirement planner. Transparent assumptions you can adjust.',
  },
  '/portfolio': {
    title: t('Free Portfolio Tracker — Funds, Stocks, Gold & FDs'),
    description: 'Track all your mutual funds, stocks, gold and fixed deposits at live prices. See returns, XIRR and asset mix in one place. Free forever.',
  },
  '/learn': {
    title: t('Learn Investing — Guides, Podcast, Videos & Glossary'),
    description: 'Plain-English learning tracks for new, index, growth and income investors, plus free guides, a weekly podcast, short videos and a jargon glossary.',
  },
  '/stories': {
    title: t('Stories & Analysis — Stock Ideas, Fund Picks, Personal Finance'),
    description: 'Independent stock deep-dives, mutual fund picks, personal-finance explainers and answers to readers’ money questions from the finMarkets research desk.',
  },
  '/pricing': {
    title: t('Plans — Stock Advisor and Fund Advisor'),
    description: 'Commission-free research subscriptions: Stock Advisor for model portfolios and buy/sell calls, Fund Advisor for goal-based fund portfolios.',
  },
  '/login': { title: t('Sign in'), description: 'Sign in to your finMarkets account.', noindex: true },
  '/signup': { title: t('Create a free account'), description: 'Create a free finMarkets account to track your portfolio and watchlist.', noindex: true },
  '/forgot-password': { title: t('Reset password'), description: 'Reset your finMarkets password.', noindex: true },
  '/reset-password': { title: t('Choose a new password'), description: 'Choose a new finMarkets password.', noindex: true },
  '/account': { title: t('Your account'), description: 'Manage your finMarkets account.', noindex: true },
};

export const NOT_FOUND = { title: t('Page not found'), description: 'This page does not exist.', noindex: true, status: 404 };

const pct = (v) => (v == null ? null : `${v > 0 ? '+' : ''}${v.toFixed(1)}%`);

/** Mutual fund page. `f` is a fund row from /api/funds or the AMFI universe. */
export function fundMeta(f) {
  const bits = [
    `NAV ₹${f.nav} (${f.date})`,
    f.ret?.['1y'] != null && `1Y ${pct(f.ret['1y'])}`,
    f.ret?.['3y'] != null && `3Y ${pct(f.ret['3y'])} p.a.`,
    f.rating && `${f.rating}★ rated`,
  ].filter(Boolean);
  return {
    title: t(`${f.name} — NAV, Returns & Rating`),
    description: `${f.name} (${f.category}, ${f.amc}): ${bits.join(', ')}. Compare with ${f.category} peers, see SIP returns, risk and category rank.`,
    jsonLd: {
      '@type': 'FinancialProduct',
      name: `${f.name} — Direct Plan Growth`,
      category: `Mutual Fund · ${f.category}`,
      provider: { '@type': 'Organization', name: f.amc },
      url: `${SITE_URL}/funds/${f.code}`,
    },
    breadcrumbs: [['Mutual Funds', '/funds'], [f.name, `/funds/${f.code}`]],
  };
}

/** Stock page. `s` has at least { name, ticker } and optionally price/sector. */
export function stockMeta(s) {
  const price = s.price != null ? `Share price ₹${Number(s.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : 'Live share price';
  return {
    title: t(`${s.name} (${s.ticker}) Share Price, Scores & Financials`),
    description: `${price} for ${s.name} (NSE: ${s.ticker})${s.sector ? `, ${s.sector}` : ''}. Quality, growth, valuation and momentum scores, 5-year financials, shareholding and peers.`,
    jsonLd: {
      '@type': 'Corporation',
      name: s.name,
      tickerSymbol: `NSE:${s.ticker}`,
      url: `${SITE_URL}/stocks/${s.ticker}`,
    },
    breadcrumbs: [['Stocks', '/stocks'], [s.name, `/stocks/${s.ticker}`]],
  };
}

/** Story page. `story` comes from src/data/stories.js; `author` is its author record. */
export function storyMeta(story, author) {
  const [d, m, y] = story.date.split(' ');
  const iso = new Date(`${m} ${d}, ${y}`).toISOString().slice(0, 10);
  return {
    title: t(story.title),
    description: story.dek,
    type: 'article',
    jsonLd: {
      '@type': 'Article',
      headline: story.title,
      description: story.dek,
      datePublished: iso,
      dateModified: iso,
      author: { '@type': 'Person', name: author?.name || BRAND },
      publisher: { '@id': `${SITE_URL}/#organization` },
      image: DEFAULT_IMAGE,
      mainEntityOfPage: `${SITE_URL}/stories/${story.id}`,
      articleSection: story.category,
    },
    breadcrumbs: [['Stories', '/stories'], [story.title, `/stories/${story.id}`]],
  };
}

/** BreadcrumbList structured data from [[label, path], …]. */
export function breadcrumbLd(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'], ...crumbs].map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE_URL}${path === '/' ? '/' : path}`,
    })),
  };
}
