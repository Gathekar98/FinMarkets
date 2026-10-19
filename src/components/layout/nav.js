// Primary navigation model — drives desktop mega-menus and the mobile drawer.

export const navItems = [
  {
    label: 'Funds',
    to: '/funds',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Fund Screener', to: '/funds#screener', desc: 'Filter 1,500+ schemes by return, risk and cost' },
          { label: 'Top Rated Funds', to: '/funds?rating=5', desc: '5-star funds across every category' },
          { label: 'Category Monitor', to: '/funds#categories', desc: 'How each category has performed' },
          { label: 'New Fund Offers', to: '/funds#nfo', desc: 'NFOs open for subscription' },
        ],
      },
      {
        title: 'Curated lists',
        links: [
          { label: 'Wealth Builders', to: '/funds?list=wealth', desc: 'For long-term growth portfolios' },
          { label: 'Steady Income', to: '/funds?list=income', desc: 'Dependable, inflation-aware income' },
          { label: 'Tax Savers (ELSS)', to: '/funds?list=tax', desc: 'Section 80C with growth' },
          { label: 'Low-cost Index', to: '/funds?list=index', desc: 'Track the market cheaply' },
        ],
      },
    ],
    promo: { title: 'Fund Advisor', text: 'Goal-based fund portfolios, reviewed by our analysts.', to: '/pricing#funds' },
  },
  {
    label: 'Stocks',
    to: '/stocks',
    columns: [
      {
        title: 'Research',
        links: [
          { label: 'Stock Screener', to: '/stocks#screener', desc: 'Scores for quality, growth, valuation, momentum' },
          { label: 'Gainers & Losers', to: '/stocks#movers', desc: 'Today’s biggest moves' },
          { label: 'IPO Monitor', to: '/ipo', desc: 'Open, upcoming and recent listings' },
          { label: 'Stock Ideas', to: '/stories?c=Stock Ideas', desc: 'Analyst deep-dives' },
        ],
      },
      {
        title: 'Ready screens',
        links: [
          { label: 'Top Rated Stocks', to: '/stocks?preset=top-rated' },
          { label: 'Bluechips on Sale', to: '/stocks?preset=bluechip-value' },
          { label: 'Growth at a Fair Price', to: '/stocks?preset=garp' },
          { label: 'Dividend Champions', to: '/stocks?preset=dividend' },
        ],
      },
    ],
    promo: { title: 'Stock Advisor', text: 'Clear buy and sell calls with model portfolios.', to: '/pricing#stocks' },
  },
  { label: 'Markets', to: '/markets' },
  { label: 'Tools', to: '/tools' },
  { label: 'Portfolio', to: '/portfolio' },
  {
    label: 'Learn',
    to: '/learn',
    columns: [
      {
        title: 'Knowledge centre',
        links: [
          { label: 'Get Started', to: '/learn#start' },
          { label: 'Index Investor', to: '/learn#index' },
          { label: 'Growth Investor', to: '/learn#growth' },
          { label: 'Income Investor', to: '/learn#income' },
        ],
      },
      {
        title: 'Read · Watch · Listen',
        links: [
          { label: 'Stories & Analysis', to: '/stories' },
          { label: 'Free Guides', to: '/learn#guides' },
          { label: 'Podcast', to: '/learn#podcast' },
          { label: 'Videos', to: '/learn#videos' },
        ],
      },
    ],
  },
];
