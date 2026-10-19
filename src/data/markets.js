// Illustrative market snapshot. Replace with a live feed later; shapes are kept API-friendly.

export const asOf = '16 Oct 2026, 3:30 PM IST';

export const indianIndices = [
  { id: 'sensex', name: 'BSE Sensex', value: 74432.37, change: -412.6, changePct: -0.55, high52: 85978.25, low52: 71425.01 },
  { id: 'nifty50', name: 'Nifty 50', value: 22561.9, change: -118.35, changePct: -0.52, high52: 26277.35, low52: 21743.65 },
  { id: 'bse500', name: 'BSE 500', value: 34757.04, change: 86.2, changePct: 0.25, high52: 38902.1, low52: 32110.4 },
  { id: 'niftybank', name: 'Nifty Bank', value: 48120.55, change: -284.1, changePct: -0.59, high52: 57628.4, low52: 46077.85 },
  { id: 'midcap', name: 'Nifty Midcap 150', value: 19843.2, change: 142.75, changePct: 0.72, high52: 22510.6, low52: 17604.3 },
  { id: 'smallcap', name: 'Nifty Smallcap 250', value: 15402.65, change: 133.4, changePct: 0.87, high52: 18688.3, low52: 13540.1 },
  { id: 'bseipo', name: 'BSE IPO', value: 18096.9, change: 211.3, changePct: 1.18, high52: 20410.7, low52: 14820.5 },
  { id: 'bsefin', name: 'BSE Finance', value: 11978.91, change: -45.8, changePct: -0.38, high52: 13240.2, low52: 10915.6 },
];

export const globalIndices = [
  { id: 'djia', name: 'Dow Jones', region: 'USA', value: 46120.4, change: 182.3, changePct: 0.4 },
  { id: 'spx', name: 'S&P 500', region: 'USA', value: 6512.85, change: 21.6, changePct: 0.33 },
  { id: 'nasdaq', name: 'Nasdaq', region: 'USA', value: 21304.1, change: -40.2, changePct: -0.19 },
  { id: 'ftse', name: 'FTSE 100', region: 'UK', value: 9184.25, change: -12.4, changePct: -0.13 },
  { id: 'dax', name: 'DAX', region: 'Germany', value: 24031.6, change: 96.1, changePct: 0.4 },
  { id: 'nikkei', name: 'Nikkei 225', region: 'Japan', value: 44820.3, change: 410.9, changePct: 0.93 },
  { id: 'hsi', name: 'Hang Seng', region: 'Hong Kong', value: 25110.7, change: -205.4, changePct: -0.81 },
  { id: 'sti', name: 'Straits Times', region: 'Singapore', value: 4251.4, change: 8.2, changePct: 0.19 },
];

export const commodities = [
  { id: 'gold', name: 'Gold (10g)', value: 121480, changePct: 0.64, unit: '₹' },
  { id: 'silver', name: 'Silver (1kg)', value: 151200, changePct: 1.12, unit: '₹' },
  { id: 'brent', name: 'Brent Crude', value: 68.4, changePct: -0.92, unit: '$' },
  { id: 'usdinr', name: 'USD / INR', value: 87.62, changePct: 0.08, unit: '₹' },
];

export const sectors = [
  { name: 'IT Services', changePct: 1.42, weight: 13 },
  { name: 'Banks', changePct: -0.74, weight: 26 },
  { name: 'Auto', changePct: 0.88, weight: 7 },
  { name: 'Pharma', changePct: 1.06, weight: 5 },
  { name: 'FMCG', changePct: -0.31, weight: 8 },
  { name: 'Metals', changePct: -1.52, weight: 4 },
  { name: 'Energy', changePct: -0.48, weight: 11 },
  { name: 'Realty', changePct: 2.14, weight: 2 },
  { name: 'Capital Goods', changePct: 0.57, weight: 6 },
  { name: 'Telecom', changePct: -0.22, weight: 4 },
  { name: 'Consumer Durables', changePct: 0.36, weight: 3 },
  { name: 'Chemicals', changePct: -0.66, weight: 3 },
];

export const breadth = { advances: 2184, declines: 1712, unchanged: 141 };

export const fiiDii = [
  { day: '10 Oct', fii: -1840, dii: 2410 },
  { day: '13 Oct', fii: -920, dii: 1630 },
  { day: '14 Oct', fii: 410, dii: 880 },
  { day: '15 Oct', fii: -2260, dii: 3120 },
  { day: '16 Oct', fii: -1185, dii: 1975 },
];
