// Knowledge centre content: learning tracks, guides, podcasts, videos and glossary.

export const investorTypes = [
  {
    id: 'start',
    label: 'Just starting',
    title: 'Begin with a plan, not a product',
    text: 'Build an emergency fund, get adequate insurance, then start a simple SIP in one or two diversified funds. We walk you through each step in plain language.',
    cta: 'Start the beginner track',
    to: '/learn#start',
    points: ['Emergency fund first', 'Term + health cover', 'Your first SIP'],
  },
  {
    id: 'index',
    label: 'Index investor',
    title: 'Own the market, cheaply and calmly',
    text: 'Low-cost index funds and ETFs, a sensible asset mix, and an annual rebalance. Fewer decisions, lower costs, and fewer chances to make expensive mistakes.',
    cta: 'Explore index investing',
    to: '/learn#index',
    points: ['Pick 2–3 index funds', 'Set your equity : debt mix', 'Rebalance once a year'],
  },
  {
    id: 'growth',
    label: 'Growth investor',
    title: 'Compound wealth over decades',
    text: 'A core of high-quality active and passive funds, optionally paired with a focused basket of well-researched stocks for investors who want more control.',
    cta: 'See wealth-builder funds',
    to: '/funds?list=wealth',
    points: ['Core-and-satellite portfolio', 'Quality stocks at fair prices', 'Stay invested through cycles'],
  },
  {
    id: 'income',
    label: 'Income investor',
    title: 'Dependable income that beats inflation',
    text: 'Combine debt and hybrid funds with a disciplined withdrawal plan so your money keeps pace with rising costs — whether you are retired or simply want cash flow.',
    cta: 'See steady-income funds',
    to: '/funds?list=income',
    points: ['Bucket strategy', 'Systematic withdrawals', 'Tax-efficient payouts'],
  },
];

export const tracks = [
  {
    id: 'start',
    title: 'Get Started',
    blurb: 'The foundations every investor needs before buying a single fund.',
    lessons: ['Why saving alone is not enough', 'Building an emergency fund', 'Insurance before investment', 'What is a mutual fund?', 'SIP vs lump sum', 'Direct vs regular plans', 'Setting your first goal'],
  },
  {
    id: 'index',
    title: 'Index Investor',
    blurb: 'A low-cost, low-maintenance way to own the whole market.',
    lessons: ['What an index really measures', 'Index funds vs ETFs', 'Tracking error explained', 'Large, mid and small indices', 'Building a 3-fund portfolio', 'When and how to rebalance'],
  },
  {
    id: 'growth',
    title: 'Growth Investor',
    blurb: 'Building long-term wealth with funds and carefully chosen stocks.',
    lessons: ['Reading a fund factsheet', 'How fund ratings work', 'Core and satellite', 'Judging business quality', 'Valuation without spreadsheets', 'Avoiding behavioural traps', 'Reviewing your portfolio'],
  },
  {
    id: 'income',
    title: 'Income Investor',
    blurb: 'Generating reliable, inflation-protected income from your savings.',
    lessons: ['How debt funds earn returns', 'Interest-rate and credit risk', 'The bucket strategy', 'Systematic withdrawal plans', 'Taxation of withdrawals', 'Planning for a 30-year retirement'],
  },
];

export const guides = [
  { title: 'A Beginner’s Guide to Passive Investing', pages: 32, tag: 'Passive' },
  { title: 'Understanding India’s Indices', pages: 24, tag: 'Markets' },
  { title: 'Passive Debt, Simply Explained', pages: 18, tag: 'Debt' },
  { title: 'Investing Without the Noise', pages: 28, tag: 'Behaviour' },
  { title: 'A Retirement Plan That Lasts', pages: 36, tag: 'Retirement' },
  { title: 'Tax-smart Investing 2026–27', pages: 22, tag: 'Tax' },
];

export const podcasts = [
  { ep: 231, title: 'Why most insurance payouts are not death claims', mins: 18, date: '17 Oct' },
  { ep: 230, title: 'Buying the fund house instead of the fund', mins: 22, date: '14 Oct' },
  { ep: 229, title: "Retirement's biggest risk is an empty afternoon", mins: 16, date: '10 Oct' },
  { ep: 228, title: 'Judging a new fund before it has a track record', mins: 20, date: '07 Oct' },
  { ep: 227, title: 'A ₹10 NAV is not cheap: the NAV illusion', mins: 14, date: '03 Oct' },
];

export const videos = [
  { title: 'Rebalancing in 3 minutes', mins: '3:12', tag: 'Asset allocation' },
  { title: 'Three questions that expose an investment scam', mins: '4:45', tag: 'Safety' },
  { title: 'How to read a fund factsheet', mins: '6:20', tag: 'Funds' },
  { title: 'P/E ratio, explained without jargon', mins: '5:08', tag: 'Stocks' },
];

export const glossary = [
  { term: 'NAV', def: 'Net Asset Value — the per-unit price of a mutual fund, calculated at the end of each business day.' },
  { term: 'Expense ratio', def: 'The annual fee a fund charges as a percentage of your investment, deducted from the NAV.' },
  { term: 'XIRR', def: 'Extended internal rate of return — the annualised return on investments made at different times, such as SIPs.' },
  { term: 'CAGR', def: 'Compound annual growth rate — the steady yearly rate that would take an investment from its start to end value.' },
  { term: 'Exit load', def: 'A fee charged when you redeem units before a specified holding period.' },
  { term: 'P/E ratio', def: 'Share price divided by earnings per share — how many rupees investors pay for each rupee of annual profit.' },
  { term: 'ROE', def: 'Return on equity — net profit as a percentage of shareholders’ funds; a key measure of business quality.' },
  { term: 'Modified duration', def: 'How much a bond fund’s NAV is likely to change for a 1% change in interest rates.' },
];
