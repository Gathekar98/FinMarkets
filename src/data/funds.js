// Illustrative mutual fund universe. Fund houses and schemes are fictional placeholders.

const f = (o) => ({ minSip: 500, minLump: 1000, exitLoad: '1% if redeemed within 1 year', ...o });

export const funds = [
  f({ id: 'northstar-flexi-cap', name: 'Northstar Flexi Cap Fund', amc: 'Northstar MF', category: 'Flexi Cap', type: 'Equity', rating: 5, risk: 'Very High', nav: 84.62, navChg: -0.41, aum: 48210, expense: 0.62, ret: { '1y': 14.8, '3y': 21.4, '5y': 23.9, '10y': 16.8 }, cat: { '1y': 11.2, '3y': 17.6, '5y': 19.8, '10y': 14.1 }, launch: 'Jan 2013', manager: 'Rohan Mehta', benchmark: 'Nifty 500 TRI', tags: ['wealth'] }),
  f({ id: 'banyan-large-cap', name: 'Banyan Large Cap Fund', amc: 'Banyan Asset Mgmt', category: 'Large Cap', type: 'Equity', rating: 4, risk: 'Very High', nav: 412.3, navChg: -0.58, aum: 36540, expense: 0.88, ret: { '1y': 9.6, '3y': 15.2, '5y': 18.1, '10y': 13.9 }, cat: { '1y': 8.4, '3y': 14.1, '5y': 16.9, '10y': 12.6 }, launch: 'Aug 2008', manager: 'Priya Natarajan', benchmark: 'Nifty 100 TRI', tags: ['wealth'] }),
  f({ id: 'kestrel-midcap', name: 'Kestrel Midcap Opportunities', amc: 'Kestrel Investments', category: 'Mid Cap', type: 'Equity', rating: 5, risk: 'Very High', nav: 156.08, navChg: 0.74, aum: 29870, expense: 0.71, ret: { '1y': 19.2, '3y': 27.8, '5y': 29.6, '10y': 19.4 }, cat: { '1y': 15.1, '3y': 23.4, '5y': 25.2, '10y': 17.2 }, launch: 'Mar 2011', manager: 'Arjun Sethi', benchmark: 'Nifty Midcap 150 TRI', tags: ['wealth'] }),
  f({ id: 'lotus-small-cap', name: 'Lotus Small Cap Fund', amc: 'Lotus AMC', category: 'Small Cap', type: 'Equity', rating: 4, risk: 'Very High', nav: 98.45, navChg: 0.92, aum: 21440, expense: 0.79, ret: { '1y': 16.4, '3y': 28.9, '5y': 33.1, '10y': 21.2 }, cat: { '1y': 13.7, '3y': 25.6, '5y': 30.4, '10y': 19.5 }, launch: 'Sep 2014', manager: 'Neha Kulkarni', benchmark: 'Nifty Smallcap 250 TRI', tags: [] }),
  f({ id: 'meridian-elss', name: 'Meridian ELSS Tax Saver', amc: 'Meridian Funds', category: 'ELSS', type: 'Equity', rating: 5, risk: 'Very High', nav: 132.7, navChg: -0.22, aum: 15890, expense: 0.68, exitLoad: 'Nil (3-year lock-in)', ret: { '1y': 13.9, '3y': 20.6, '5y': 22.4, '10y': 16.1 }, cat: { '1y': 10.8, '3y': 16.9, '5y': 19.1, '10y': 13.8 }, launch: 'Feb 2009', manager: 'Vikram Rao', benchmark: 'Nifty 500 TRI', tags: ['tax'] }),
  f({ id: 'banyan-elss', name: 'Banyan Tax Advantage Fund', amc: 'Banyan Asset Mgmt', category: 'ELSS', type: 'Equity', rating: 4, risk: 'Very High', nav: 88.14, navChg: -0.35, aum: 9420, expense: 0.81, exitLoad: 'Nil (3-year lock-in)', ret: { '1y': 11.6, '3y': 18.2, '5y': 20.3, '10y': 14.9 }, cat: { '1y': 10.8, '3y': 16.9, '5y': 19.1, '10y': 13.8 }, launch: 'Dec 2010', manager: 'Sana Iqbal', benchmark: 'BSE 500 TRI', tags: ['tax'] }),
  f({ id: 'cedar-nifty50-index', name: 'Cedar Nifty 50 Index Fund', amc: 'Cedar Mutual Fund', category: 'Index - Large Cap', type: 'Equity', rating: 4, risk: 'Very High', nav: 27.91, navChg: -0.52, aum: 18760, expense: 0.18, exitLoad: 'Nil', ret: { '1y': 8.9, '3y': 13.8, '5y': 16.7, '10y': 12.9 }, cat: { '1y': 8.6, '3y': 13.5, '5y': 16.4, '10y': 12.6 }, launch: 'Jun 2015', manager: 'Index Team', benchmark: 'Nifty 50 TRI', tags: ['index', 'wealth'] }),
  f({ id: 'cedar-next50-index', name: 'Cedar Nifty Next 50 Index Fund', amc: 'Cedar Mutual Fund', category: 'Index - Large Cap', type: 'Equity', rating: 3, risk: 'Very High', nav: 19.36, navChg: 0.11, aum: 5120, expense: 0.29, exitLoad: 'Nil', ret: { '1y': 6.1, '3y': 17.9, '5y': 19.4, '10y': null }, cat: { '1y': 8.6, '3y': 13.5, '5y': 16.4, '10y': 12.6 }, launch: 'Nov 2018', manager: 'Index Team', benchmark: 'Nifty Next 50 TRI', tags: ['index'] }),
  f({ id: 'northstar-midcap150-index', name: 'Northstar Midcap 150 Index Fund', amc: 'Northstar MF', category: 'Index - Mid Cap', type: 'Equity', rating: 4, risk: 'Very High', nav: 21.48, navChg: 0.7, aum: 3980, expense: 0.24, exitLoad: 'Nil', ret: { '1y': 15.6, '3y': 24.1, '5y': 26.8, '10y': null }, cat: { '1y': 15.0, '3y': 23.5, '5y': 26.1, '10y': null }, launch: 'Apr 2019', manager: 'Index Team', benchmark: 'Nifty Midcap 150 TRI', tags: ['index'] }),
  f({ id: 'harbor-balanced-advantage', name: 'Harbor Balanced Advantage Fund', amc: 'Harbor Capital MF', category: 'Dynamic Asset Allocation', type: 'Hybrid', rating: 5, risk: 'High', nav: 61.2, navChg: -0.12, aum: 27350, expense: 0.74, ret: { '1y': 10.4, '3y': 14.6, '5y': 15.8, '10y': 12.2 }, cat: { '1y': 8.7, '3y': 12.1, '5y': 13.2, '10y': 10.4 }, launch: 'Oct 2012', manager: 'Kavita Menon', benchmark: 'Nifty 50 Hybrid Composite 50:50', tags: ['income', 'wealth'] }),
  f({ id: 'kestrel-aggressive-hybrid', name: 'Kestrel Aggressive Hybrid Fund', amc: 'Kestrel Investments', category: 'Aggressive Hybrid', type: 'Hybrid', rating: 4, risk: 'Very High', nav: 74.9, navChg: -0.29, aum: 12610, expense: 0.83, ret: { '1y': 11.7, '3y': 16.9, '5y': 18.2, '10y': 13.4 }, cat: { '1y': 10.1, '3y': 15.0, '5y': 16.6, '10y': 12.0 }, launch: 'May 2010', manager: 'Arjun Sethi', benchmark: 'CRISIL Hybrid 35+65 Aggressive', tags: ['wealth'] }),
  f({ id: 'lotus-equity-savings', name: 'Lotus Equity Savings Fund', amc: 'Lotus AMC', category: 'Equity Savings', type: 'Hybrid', rating: 4, risk: 'Moderate', nav: 23.64, navChg: 0.03, aum: 4210, expense: 0.58, exitLoad: 'Nil', ret: { '1y': 8.1, '3y': 9.9, '5y': 10.6, '10y': 9.1 }, cat: { '1y': 7.3, '3y': 9.0, '5y': 9.7, '10y': 8.4 }, launch: 'Jul 2015', manager: 'Rahul Bhatt', benchmark: 'Nifty Equity Savings', tags: ['income'] }),
  f({ id: 'meridian-multi-asset', name: 'Meridian Multi Asset Allocation', amc: 'Meridian Funds', category: 'Multi Asset Allocation', type: 'Hybrid', rating: 5, risk: 'High', nav: 39.85, navChg: 0.18, aum: 8890, expense: 0.66, ret: { '1y': 13.2, '3y': 17.4, '5y': 18.9, '10y': 13.1 }, cat: { '1y': 11.4, '3y': 14.8, '5y': 15.6, '10y': 11.2 }, launch: 'Jan 2014', manager: 'Kavita Menon', benchmark: '65% Nifty 500, 25% debt, 10% gold', tags: ['wealth', 'income'] }),
  f({ id: 'harbor-short-duration', name: 'Harbor Short Duration Fund', amc: 'Harbor Capital MF', category: 'Short Duration', type: 'Debt', rating: 4, risk: 'Moderate', nav: 31.42, navChg: 0.02, aum: 14320, expense: 0.36, exitLoad: 'Nil', ret: { '1y': 7.8, '3y': 7.1, '5y': 6.6, '10y': 7.4 }, cat: { '1y': 7.4, '3y': 6.7, '5y': 6.2, '10y': 7.0 }, launch: 'Mar 2007', manager: 'Deepak Jain', benchmark: 'CRISIL Short Duration Debt A-II', tags: ['income'] }),
  f({ id: 'cedar-corporate-bond', name: 'Cedar Corporate Bond Fund', amc: 'Cedar Mutual Fund', category: 'Corporate Bond', type: 'Debt', rating: 5, risk: 'Moderate', nav: 28.07, navChg: 0.03, aum: 22870, expense: 0.32, exitLoad: 'Nil', ret: { '1y': 8.1, '3y': 7.4, '5y': 6.9, '10y': 7.8 }, cat: { '1y': 7.6, '3y': 6.9, '5y': 6.4, '10y': 7.3 }, launch: 'Aug 2009', manager: 'Ishita Ghosh', benchmark: 'CRISIL Corporate Debt A-II', tags: ['income'] }),
  f({ id: 'banyan-liquid', name: 'Banyan Liquid Fund', amc: 'Banyan Asset Mgmt', category: 'Liquid', type: 'Debt', rating: 4, risk: 'Low to Moderate', nav: 3812.55, navChg: 0.02, aum: 41230, expense: 0.19, exitLoad: 'Graded, nil after 7 days', ret: { '1y': 6.9, '3y': 6.6, '5y': 5.4, '10y': 6.5 }, cat: { '1y': 6.8, '3y': 6.5, '5y': 5.3, '10y': 6.4 }, launch: 'Apr 2004', manager: 'Deepak Jain', benchmark: 'CRISIL Liquid Debt A-I', tags: ['income'] }),
  f({ id: 'northstar-gilt', name: 'Northstar Gilt Fund', amc: 'Northstar MF', category: 'Gilt', type: 'Debt', rating: 3, risk: 'Moderate', nav: 64.18, navChg: -0.06, aum: 6340, expense: 0.47, exitLoad: 'Nil', ret: { '1y': 7.2, '3y': 7.9, '5y': 6.1, '10y': 8.0 }, cat: { '1y': 7.5, '3y': 7.6, '5y': 5.9, '10y': 7.8 }, launch: 'Dec 2001', manager: 'Ishita Ghosh', benchmark: 'CRISIL Dynamic Gilt', tags: [] }),
  f({ id: 'lotus-banking-psu-debt', name: 'Lotus Banking & PSU Debt Fund', amc: 'Lotus AMC', category: 'Banking and PSU', type: 'Debt', rating: 4, risk: 'Moderate', nav: 22.91, navChg: 0.02, aum: 9810, expense: 0.34, exitLoad: 'Nil', ret: { '1y': 7.9, '3y': 7.0, '5y': 6.5, '10y': 7.5 }, cat: { '1y': 7.6, '3y': 6.8, '5y': 6.2, '10y': 7.2 }, launch: 'Jan 2010', manager: 'Rahul Bhatt', benchmark: 'CRISIL Banking & PSU Debt A-II', tags: ['income'] }),
  f({ id: 'kestrel-focused', name: 'Kestrel Focused Equity Fund', amc: 'Kestrel Investments', category: 'Focused', type: 'Equity', rating: 3, risk: 'Very High', nav: 52.33, navChg: -0.66, aum: 7340, expense: 0.92, ret: { '1y': 7.4, '3y': 14.9, '5y': 17.6, '10y': 13.0 }, cat: { '1y': 9.8, '3y': 15.7, '5y': 18.3, '10y': 13.5 }, launch: 'Jun 2012', manager: 'Sana Iqbal', benchmark: 'Nifty 500 TRI', tags: [] }),
  f({ id: 'harbor-value', name: 'Harbor Value Discovery Fund', amc: 'Harbor Capital MF', category: 'Value', type: 'Equity', rating: 5, risk: 'Very High', nav: 118.9, navChg: -0.18, aum: 17220, expense: 0.77, ret: { '1y': 12.8, '3y': 23.6, '5y': 26.4, '10y': 17.1 }, cat: { '1y': 10.6, '3y': 19.8, '5y': 22.1, '10y': 14.9 }, launch: 'Feb 2008', manager: 'Rohan Mehta', benchmark: 'Nifty 500 TRI', tags: ['wealth'] }),
  f({ id: 'meridian-intl-fof', name: 'Meridian Global Equity FoF', amc: 'Meridian Funds', category: 'International FoF', type: 'Equity', rating: 3, risk: 'Very High', nav: 18.72, navChg: 0.37, aum: 2140, expense: 0.98, ret: { '1y': 16.9, '3y': 12.4, '5y': 13.8, '10y': null }, cat: { '1y': 14.2, '3y': 10.1, '5y': 11.6, '10y': null }, launch: 'Sep 2017', manager: 'Overseas Desk', benchmark: 'MSCI ACWI TRI', tags: [] }),
  f({ id: 'cedar-gold-etf-fof', name: 'Cedar Gold Savings Fund', amc: 'Cedar Mutual Fund', category: 'Gold FoF', type: 'Commodity', rating: 4, risk: 'High', nav: 34.06, navChg: 0.6, aum: 3810, expense: 0.15, exitLoad: 'Nil', ret: { '1y': 31.4, '3y': 24.8, '5y': 15.9, '10y': 12.4 }, cat: { '1y': 30.9, '3y': 24.3, '5y': 15.5, '10y': 12.1 }, launch: 'Mar 2012', manager: 'Index Team', benchmark: 'Domestic price of gold', tags: [] }),
];

export const fundById = (id) => funds.find((x) => x.id === id);

export const fundCategories = {
  Equity: [
    { name: 'Large Cap', funds: 32, ret1y: 8.4, ret3y: 14.1, ret5y: 16.9, aum: 412000 },
    { name: 'Flexi Cap', funds: 41, ret1y: 11.2, ret3y: 17.6, ret5y: 19.8, aum: 468000 },
    { name: 'Mid Cap', funds: 30, ret1y: 15.1, ret3y: 23.4, ret5y: 25.2, aum: 386000 },
    { name: 'Small Cap', funds: 29, ret1y: 13.7, ret3y: 25.6, ret5y: 30.4, aum: 334000 },
    { name: 'ELSS', funds: 40, ret1y: 10.8, ret3y: 16.9, ret5y: 19.1, aum: 246000 },
    { name: 'Value', funds: 23, ret1y: 10.6, ret3y: 19.8, ret5y: 22.1, aum: 198000 },
    { name: 'Focused', funds: 28, ret1y: 9.8, ret3y: 15.7, ret5y: 18.3, aum: 152000 },
    { name: 'Sectoral / Thematic', funds: 214, ret1y: 7.2, ret3y: 18.4, ret5y: 21.0, aum: 521000 },
  ],
  Debt: [
    { name: 'Liquid', funds: 37, ret1y: 6.8, ret3y: 6.5, ret5y: 5.3, aum: 562000 },
    { name: 'Short Duration', funds: 22, ret1y: 7.4, ret3y: 6.7, ret5y: 6.2, aum: 112000 },
    { name: 'Corporate Bond', funds: 21, ret1y: 7.6, ret3y: 6.9, ret5y: 6.4, aum: 189000 },
    { name: 'Banking and PSU', funds: 22, ret1y: 7.6, ret3y: 6.8, ret5y: 6.2, aum: 98000 },
    { name: 'Gilt', funds: 22, ret1y: 7.5, ret3y: 7.6, ret5y: 5.9, aum: 41000 },
    { name: 'Money Market', funds: 25, ret1y: 7.3, ret3y: 6.9, ret5y: 5.8, aum: 271000 },
  ],
  Hybrid: [
    { name: 'Aggressive Hybrid', funds: 30, ret1y: 10.1, ret3y: 15.0, ret5y: 16.6, aum: 228000 },
    { name: 'Dynamic Asset Allocation', funds: 33, ret1y: 8.7, ret3y: 12.1, ret5y: 13.2, aum: 301000 },
    { name: 'Multi Asset Allocation', funds: 26, ret1y: 11.4, ret3y: 14.8, ret5y: 15.6, aum: 124000 },
    { name: 'Equity Savings', funds: 23, ret1y: 7.3, ret3y: 9.0, ret5y: 9.7, aum: 39000 },
    { name: 'Arbitrage', funds: 28, ret1y: 7.0, ret3y: 6.8, ret5y: 5.6, aum: 245000 },
  ],
};

export const curatedLists = [
  { id: 'wealth', title: 'Wealth Builders', blurb: 'Core equity and hybrid funds suited to a 7+ year growth portfolio.', icon: '↗', tone: 'brand' },
  { id: 'income', title: 'Steady Income', blurb: 'Lower-volatility picks for dependable, inflation-aware income.', icon: '≋', tone: 'accent' },
  { id: 'tax', title: 'Tax Savers', blurb: 'ELSS funds combining long-term growth with Section 80C savings.', icon: '%', tone: 'navy' },
  { id: 'index', title: 'Low-cost Index', blurb: 'Simple, cheap, rules-based funds that track the market.', icon: '≡', tone: 'brand' },
];

export const nfos = [
  { name: 'Lotus Manufacturing Index Fund', amc: 'Lotus AMC', category: 'Index - Thematic', opens: '14 Oct 2026', closes: '28 Oct 2026', minInv: 1000 },
  { name: 'Cedar Nifty 500 Momentum 50 Fund', amc: 'Cedar Mutual Fund', category: 'Index - Factor', opens: '20 Oct 2026', closes: '03 Nov 2026', minInv: 500 },
  { name: 'Harbor Income Plus Arbitrage FoF', amc: 'Harbor Capital MF', category: 'FoF - Domestic', opens: '22 Oct 2026', closes: '05 Nov 2026', minInv: 5000 },
  { name: 'Kestrel Consumption Opportunities', amc: 'Kestrel Investments', category: 'Thematic', opens: '27 Oct 2026', closes: '10 Nov 2026', minInv: 1000 },
];

/** Generated portfolio detail (holdings / sectors / allocation) so every fund page has content. */
const HOLDINGS_EQ = ['Aravali Bank', 'Indus Digital Services', 'Konkan Energy', 'Sahyadri Finance', 'Deccan Motors', 'Vindhya Pharma', 'Ganga Consumer', 'Narmada Cement', 'Coromandel Telecom', 'Malabar Infra'];
const HOLDINGS_DEBT = ['7.18% GOI 2033', 'NABARD 7.6% 2028', 'REC Ltd 7.5% 2029', 'SIDBI 7.4% 2027', 'Power Finance Corp 7.7% 2030', 'HDB T-Bill 182D', '7.1% GOI 2034', 'Exim Bank 7.3% 2028', 'Treps', 'State Dev Loan 7.6% 2031'];

export function fundPortfolio(fund) {
  const debt = fund.type === 'Debt';
  const names = debt ? HOLDINGS_DEBT : HOLDINGS_EQ;
  const seed = fund.id.length;
  const holdings = names.map((name, i) => ({
    name,
    sector: debt ? (i % 3 === 0 ? 'Sovereign' : 'AAA / A1+') : ['Banks', 'IT Services', 'Energy', 'Finance', 'Auto', 'Pharma', 'FMCG', 'Cement', 'Telecom', 'Capital Goods'][i],
    weight: +(9.2 - i * 0.62 + ((seed + i) % 3) * 0.3).toFixed(2),
  }));
  const sectors = debt
    ? [{ name: 'Sovereign', value: 38 }, { name: 'AAA', value: 44 }, { name: 'A1+', value: 10 }, { name: 'Cash & Eq.', value: 8 }]
    : [{ name: 'Financials', value: 31 }, { name: 'Technology', value: 14 }, { name: 'Consumer', value: 13 }, { name: 'Energy & Utilities', value: 11 }, { name: 'Industrials', value: 10 }, { name: 'Healthcare', value: 8 }, { name: 'Others', value: 13 }];
  const alloc = {
    Equity: [{ name: 'Equity', value: 96.4 }, { name: 'Debt', value: 0.6 }, { name: 'Cash', value: 3.0 }],
    Debt: [{ name: 'Debt', value: 92.8 }, { name: 'Cash', value: 7.2 }],
    Hybrid: [{ name: 'Equity', value: 58.2 }, { name: 'Debt', value: 31.5 }, { name: 'Gold', value: 4.1 }, { name: 'Cash', value: 6.2 }],
    Commodity: [{ name: 'Gold', value: 98.9 }, { name: 'Cash', value: 1.1 }],
  }[fund.type];
  const stats = debt
    ? { 'Avg. maturity': '2.8 yrs', 'Modified duration': '2.3 yrs', 'Yield to maturity': '7.21%', 'Credit quality': 'AAA' }
    : { 'P/E': '24.6', 'P/B': '3.9', 'Avg. market cap': '₹2.1 L Cr', 'Turnover': '28%' };
  return { holdings, sectors, alloc, stats };
}
