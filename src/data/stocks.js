// Illustrative listed companies. Names and figures are fictional placeholders.
// scores: 0–10 on Quality, Growth, Valuation, Momentum. mcap in ₹ crore.

export const stocks = [
  { id: 'aravali-bank', name: 'Aravali Bank', ticker: 'ARAVBANK', sector: 'Banks', price: 1684.2, chg: -1.12, mcap: 1284000, pe: 19.4, pb: 2.8, roe: 16.2, div: 1.1, high52: 1880, low52: 1452, scores: { quality: 8, growth: 6, valuation: 6, momentum: 4 }, rating: 4, cap: 'Large' },
  { id: 'indus-digital', name: 'Indus Digital Services', ticker: 'INDUSDIG', sector: 'IT Services', price: 3912.5, chg: 1.86, mcap: 1416000, pe: 28.1, pb: 12.4, roe: 46.8, div: 1.9, high52: 4290, low52: 3305, scores: { quality: 10, growth: 6, valuation: 5, momentum: 7 }, rating: 5, cap: 'Large' },
  { id: 'konkan-energy', name: 'Konkan Energy', ticker: 'KONKANEN', sector: 'Energy', price: 1306.8, chg: -0.64, mcap: 1768000, pe: 24.7, pb: 2.2, roe: 9.4, div: 0.4, high52: 1610, low52: 1201, scores: { quality: 6, growth: 5, valuation: 5, momentum: 3 }, rating: 3, cap: 'Large' },
  { id: 'sahyadri-finance', name: 'Sahyadri Finance', ticker: 'SAHYFIN', sector: 'Finance', price: 7248.0, chg: 0.42, mcap: 448000, pe: 31.6, pb: 5.9, roe: 20.4, div: 0.5, high52: 7920, low52: 6110, scores: { quality: 9, growth: 9, valuation: 3, momentum: 6 }, rating: 4, cap: 'Large' },
  { id: 'deccan-motors', name: 'Deccan Motors', ticker: 'DECMOT', sector: 'Auto', price: 11840.5, chg: 1.24, mcap: 372000, pe: 26.3, pb: 4.6, roe: 17.9, div: 1.0, high52: 13105, low52: 9480, scores: { quality: 8, growth: 7, valuation: 5, momentum: 8 }, rating: 4, cap: 'Large' },
  { id: 'vindhya-pharma', name: 'Vindhya Pharma', ticker: 'VINDPHAR', sector: 'Pharma', price: 1742.3, chg: 2.08, mcap: 418000, pe: 34.8, pb: 5.4, roe: 15.6, div: 0.7, high52: 1815, low52: 1288, scores: { quality: 8, growth: 8, valuation: 4, momentum: 9 }, rating: 4, cap: 'Large' },
  { id: 'ganga-consumer', name: 'Ganga Consumer Products', ticker: 'GANGACON', sector: 'FMCG', price: 2386.1, chg: -0.28, mcap: 560000, pe: 52.4, pb: 11.2, roe: 21.4, div: 1.7, high52: 2810, low52: 2204, scores: { quality: 9, growth: 4, valuation: 2, momentum: 3 }, rating: 3, cap: 'Large' },
  { id: 'narmada-cement', name: 'Narmada Cement', ticker: 'NARMCEM', sector: 'Cement', price: 10920.0, chg: 0.36, mcap: 315000, pe: 44.2, pb: 4.8, roe: 11.3, div: 0.6, high52: 12210, low52: 9640, scores: { quality: 7, growth: 6, valuation: 3, momentum: 5 }, rating: 3, cap: 'Large' },
  { id: 'coromandel-telecom', name: 'Coromandel Telecom', ticker: 'CORTEL', sector: 'Telecom', price: 1594.6, chg: -0.21, mcap: 958000, pe: 58.9, pb: 9.1, roe: 18.2, div: 0.5, high52: 1780, low52: 1320, scores: { quality: 7, growth: 8, valuation: 3, momentum: 6 }, rating: 4, cap: 'Large' },
  { id: 'malabar-infra', name: 'Malabar Infra Engineering', ticker: 'MALINFRA', sector: 'Capital Goods', price: 3420.8, chg: 0.94, mcap: 470000, pe: 32.1, pb: 5.2, roe: 16.8, div: 0.8, high52: 3910, low52: 2995, scores: { quality: 8, growth: 7, valuation: 4, momentum: 6 }, rating: 4, cap: 'Large' },
  { id: 'thar-metals', name: 'Thar Metals & Mining', ticker: 'THARMET', sector: 'Metals', price: 642.15, chg: -2.36, mcap: 168000, pe: 11.8, pb: 1.6, roe: 13.5, div: 3.4, high52: 785, low52: 590, scores: { quality: 6, growth: 4, valuation: 8, momentum: 2 }, rating: 3, cap: 'Mid' },
  { id: 'nilgiri-realty', name: 'Nilgiri Realty', ticker: 'NILREAL', sector: 'Realty', price: 1218.4, chg: 3.12, mcap: 112000, pe: 38.6, pb: 4.1, roe: 10.9, div: 0.3, high52: 1302, low52: 822, scores: { quality: 6, growth: 9, valuation: 4, momentum: 9 }, rating: 3, cap: 'Mid' },
  { id: 'saraswati-chem', name: 'Saraswati Specialty Chemicals', ticker: 'SARACHEM', sector: 'Chemicals', price: 2884.0, chg: -0.92, mcap: 54000, pe: 36.4, pb: 6.3, roe: 18.6, div: 0.4, high52: 3420, low52: 2610, scores: { quality: 8, growth: 7, valuation: 4, momentum: 3 }, rating: 4, cap: 'Mid' },
  { id: 'kaveri-power', name: 'Kaveri Power Grid', ticker: 'KAVPOWER', sector: 'Utilities', price: 318.65, chg: 0.58, mcap: 296000, pe: 17.2, pb: 3.0, roe: 18.1, div: 3.6, high52: 362, low52: 276, scores: { quality: 7, growth: 5, valuation: 7, momentum: 5 }, rating: 4, cap: 'Large' },
  { id: 'brahmaputra-tea', name: 'Brahmaputra Beverages', ticker: 'BRAHBEV', sector: 'FMCG', price: 1062.3, chg: 0.18, mcap: 101000, pe: 64.1, pb: 8.8, roe: 14.2, div: 0.9, high52: 1190, low52: 880, scores: { quality: 7, growth: 6, valuation: 2, momentum: 6 }, rating: 3, cap: 'Mid' },
  { id: 'pamba-logistics', name: 'Pamba Logistics', ticker: 'PAMBALOG', sector: 'Logistics', price: 486.9, chg: 1.64, mcap: 28400, pe: 29.4, pb: 4.7, roe: 17.2, div: 0.6, high52: 540, low52: 362, scores: { quality: 7, growth: 8, valuation: 5, momentum: 8 }, rating: 4, cap: 'Small' },
  { id: 'tapti-textiles', name: 'Tapti Textiles', ticker: 'TAPTITEX', sector: 'Textiles', price: 214.35, chg: -1.48, mcap: 9800, pe: 14.6, pb: 1.9, roe: 13.8, div: 1.4, high52: 268, low52: 196, scores: { quality: 5, growth: 5, valuation: 8, momentum: 3 }, rating: 3, cap: 'Small' },
  { id: 'sindhu-insurance', name: 'Sindhu Life Insurance', ticker: 'SINDHULI', sector: 'Insurance', price: 742.8, chg: -0.36, mcap: 160000, pe: 82.3, pb: 9.6, roe: 12.1, div: 0.3, high52: 812, low52: 628, scores: { quality: 7, growth: 7, valuation: 2, momentum: 4 }, rating: 3, cap: 'Large' },
  { id: 'godavari-hospitals', name: 'Godavari Hospitals', ticker: 'GODHOSP', sector: 'Healthcare', price: 6980.0, chg: 1.02, mcap: 100400, pe: 72.6, pb: 12.9, roe: 18.9, div: 0.2, high52: 7440, low52: 5810, scores: { quality: 8, growth: 9, valuation: 2, momentum: 7 }, rating: 4, cap: 'Mid' },
  { id: 'chambal-fert', name: 'Chambal Agro Nutrients', ticker: 'CHAMBAGR', sector: 'Fertilisers', price: 512.4, chg: 2.42, mcap: 21300, pe: 12.9, pb: 2.4, roe: 19.6, div: 2.1, high52: 548, low52: 398, scores: { quality: 7, growth: 6, valuation: 8, momentum: 8 }, rating: 5, cap: 'Small' },
];

export const stockById = (id) => stocks.find((s) => s.id === id);

export const screenerPresets = [
  { id: 'top-rated', title: 'Top Rated Stocks', blurb: 'High-quality businesses, improving fundamentals, sensible prices.', filter: (s) => s.rating >= 4 && s.scores.quality >= 8 },
  { id: 'bluechip-value', title: 'Bluechips on Sale', blurb: 'Large, consistently profitable companies trading below their usual valuations.', filter: (s) => s.cap === 'Large' && s.scores.valuation >= 6 },
  { id: 'garp', title: 'Growth at a Fair Price', blurb: 'Strong earnings growth without paying an excessive multiple.', filter: (s) => s.scores.growth >= 7 && s.pe < 35 },
  { id: 'dividend', title: 'Dividend Champions', blurb: 'Steady payers with dividend yield above 1.5%.', filter: (s) => s.div >= 1.5 },
  { id: 'momentum', title: 'Strong Momentum', blurb: 'Stocks with the best recent price strength and trend.', filter: (s) => s.scores.momentum >= 8 },
  { id: 'near-low', title: 'Near 52-week Low', blurb: 'Quality names within 12% of their one-year low — worth a closer look.', filter: (s) => s.price <= s.low52 * 1.12 },
];

/** Generated 5-year financials and shareholding, so every stock page renders fully. */
export function stockFinancials(s) {
  const base = s.mcap / s.pe;
  const growth = 1 + (s.scores.growth * 1.8) / 100;
  const years = ['FY22', 'FY23', 'FY24', 'FY25', 'FY26'];
  const margin = Math.min(0.32, 0.06 + s.scores.quality * 0.022);
  const rows = years.map((year, i) => {
    const profit = base / Math.pow(growth, years.length - 1 - i);
    const revenue = profit / margin;
    return { year, revenue: Math.round(revenue), profit: Math.round(profit), eps: +((profit * s.price) / s.mcap).toFixed(1) };
  });
  const promoter = s.sector === 'Banks' || s.sector === 'Insurance' ? 26 : 48 + (s.name.length % 20);
  const fii = 18 + (s.ticker.length % 7) * 2;
  const dii = 14 + (s.name.length % 9);
  const shareholding = [
    { name: 'Promoters', value: promoter },
    { name: 'FIIs', value: fii },
    { name: 'DIIs', value: dii },
    { name: 'Public', value: +(100 - promoter - fii - dii).toFixed(1) },
  ];
  return { rows, shareholding };
}
