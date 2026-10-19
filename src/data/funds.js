// Editorial fund content. Fund data itself (NAVs, returns, ratings) comes live from /api/funds.

export const curatedLists = [
  { id: 'wealth', title: 'Wealth Builders', blurb: 'Core equity and aggressive-hybrid funds suited to a 7+ year growth portfolio.', icon: '↗', tone: 'brand' },
  { id: 'income', title: 'Steady Income', blurb: 'Debt and conservative hybrid picks for dependable, inflation-aware income.', icon: '≋', tone: 'accent' },
  { id: 'tax', title: 'Tax Savers', blurb: 'ELSS funds combining long-term growth with Section 80C savings.', icon: '%', tone: 'navy' },
  { id: 'index', title: 'Low-cost Index', blurb: 'Simple, cheap, rules-based funds that track the market.', icon: '≡', tone: 'brand' },
];

// Update this list as fund houses announce NFOs (no free official feed exists for upcoming NFOs).
export const nfos = [
  { name: 'Manufacturing Index Fund', amc: 'To be updated by editors', category: 'Index - Thematic', opens: '—', closes: '—', minInv: 1000 },
  { name: 'Nifty 500 Momentum 50 Fund', amc: 'To be updated by editors', category: 'Index - Factor', opens: '—', closes: '—', minInv: 500 },
  { name: 'Income Plus Arbitrage FoF', amc: 'To be updated by editors', category: 'FoF - Domestic', opens: '—', closes: '—', minInv: 5000 },
  { name: 'Consumption Opportunities Fund', amc: 'To be updated by editors', category: 'Thematic', opens: '—', closes: '—', minInv: 1000 },
];
