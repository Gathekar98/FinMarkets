export const plans = [
  {
    id: 'free',
    name: 'Portfolio Tracker',
    tagline: 'Every rupee your family owns, in one place.',
    price: 0,
    period: 'Free, forever',
    cta: 'Track my portfolio',
    to: '/portfolio',
    features: ['Track funds, stocks, FDs and gold', 'Ratings on everything you hold', 'Overlap and cost X-Ray', 'Family portfolios'],
  },
  {
    id: 'stocks',
    name: 'Stock Advisor',
    tagline: 'What to buy, and when to sell.',
    price: 9990,
    period: '/ year',
    cta: 'See the stock picks',
    to: '/pricing#stocks',
    highlight: true,
    features: ['Model portfolios with clear weights', 'Buy, hold and sell alerts', 'Deep-dive research reports', 'Quarterly results analysis', 'Ask-the-analyst access'],
  },
  {
    id: 'funds',
    name: 'Fund Advisor',
    tagline: 'The confidence to invest well, for life.',
    price: 4900,
    period: '/ year',
    cta: 'Get fund advice',
    to: '/pricing#funds',
    features: ['Goal-based fund portfolios', 'Switch and exit recommendations', 'Annual portfolio review', 'Tax-harvesting reminders'],
  },
];

export const ratingScale = [
  { stars: 5, label: 'Top 10%', text: 'Best risk-adjusted returns in the category' },
  { stars: 4, label: 'Next 22.5%', text: 'Consistently above average' },
  { stars: 3, label: 'Middle 35%', text: 'In line with the category' },
  { stars: 2, label: 'Next 22.5%', text: 'Below average' },
  { stars: 1, label: 'Bottom 10%', text: 'Weakest risk-adjusted record' },
];
