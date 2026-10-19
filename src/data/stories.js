// Editorial content. Placeholder copy written for layout and tone; authors are fictional.

export const storyCategories = ['Latest', 'Stock Ideas', 'Fund Picks', 'Fund Insight', 'Wealth Insight', 'Ask Us', 'Announcements'];

export const authors = {
  ak: { name: 'Anika Kapoor', role: 'Senior Equity Analyst' },
  rm: { name: 'Raghav Menon', role: 'Editor-in-Chief' },
  sd: { name: 'Shreya Das', role: 'Fund Research Lead' },
  vt: { name: 'Vivek Thakur', role: 'Personal Finance Writer' },
  team: { name: 'finMarkets Research Desk', role: 'Research Team' },
};

const body = {
  dhanteras: [
    'Every year around Dhanteras, gold sales spike. Families buy coins, jewellery and bars as a symbol of prosperity, and that tradition deserves respect. But it helps to be honest about what this purchase is: a cultural ritual, not an investment plan.',
    'Jewellery carries making charges of 8–25%, and resale value is typically assessed only on gold content. A coin bought from a jeweller at a premium is often bought back at a discount. Before the price of gold has moved at all, you may already be down by a tenth of your money.',
    'If your goal is to hold gold as a portfolio diversifier, there are cleaner routes. Gold ETFs and gold fund-of-funds track the domestic price at an expense ratio well under 1%, carry no purity risk, and can be bought in small amounts through an SIP.',
    'How much gold is enough? For most long-term investors, 5–10% of the portfolio is plenty. Gold does not compound like a business; it protects against currency weakness and periods of panic. That is a valuable role — but a limited one.',
    'So buy the coin if it brings joy to the festival. Just do not count it as part of your retirement corpus, and do not let a good year for gold prices persuade you to make it the centre of your plan.',
  ],
  generic: [
    'Markets have had an uneven few months. Headline indices are within a few percent of where they started the year, yet beneath the surface there has been a sharp rotation: some sectors have re-rated meaningfully while others have quietly derated.',
    'For long-term investors, that kind of churn is an opportunity to revisit the fundamentals. What has actually changed about the business — its revenue mix, its margins, its balance sheet — and what has changed only in the price?',
    'We looked at five years of reported numbers, management commentary and peer comparisons. Three things stand out: the quality of earnings has held up, capital allocation has been disciplined, and valuation has come back to a range that leaves room for error.',
    'None of this makes the next twelve months predictable. It does mean the odds are more reasonable than they were. For investors with a horizon of five years or more, staggering purchases over the next few quarters is a sensible way to build a position.',
    'As always, size matters more than timing. No single stock should be large enough that a bad outcome derails your financial goals, and every holding should earn its place against a low-cost index fund.',
  ],
};

export const stories = [
  { id: 'gold-dhanteras-not-investing', title: 'Buying gold on Dhanteras is a ritual, not an investment', dek: 'Making charges, purity and buy-back discounts quietly eat into returns. Here is how to own gold sensibly.', category: 'Wealth Insight', author: 'rm', date: '18 Oct 2026', mins: 4, featured: true, tone: 'accent', body: body.dhanteras },
  { id: 'indus-digital-next-phase', title: 'Indus Digital: what will drive its next leg of growth?', dek: 'Deal wins are strong, but margins are under pressure from wage hikes and pricing. We weigh both sides.', category: 'Stock Ideas', author: 'ak', date: '18 Oct 2026', mins: 6, tone: 'brand', body: body.generic },
  { id: 'equity-after-retirement', title: '75% in equity after retiring — brave or reckless?', dek: 'A reader asks whether a high equity share makes sense at 61. The answer depends on one number.', category: 'Ask Us', author: 'team', date: '17 Oct 2026', mins: 3, tone: 'navy', body: body.generic },
  { id: 'international-funds-shut', title: 'Most international funds are closed. Do you really need one?', dek: 'With overseas limits biting, domestic funds with global exposure may fill the gap.', category: 'Fund Insight', author: 'sd', date: '17 Oct 2026', mins: 6, tone: 'brand', body: body.generic },
  { id: 'aravali-bank-provisions', title: "Aravali Bank's ₹8,400 crore provisioning question", dek: 'Can the bank absorb a large one-off hit without diluting shareholders? We run the numbers.', category: 'Stock Ideas', author: 'ak', date: '16 Oct 2026', mins: 5, tone: 'accent', body: body.generic },
  { id: 'listing-ran-ahead', title: 'A year after listing, the price has outrun the profits', dek: 'Post-IPO rallies are fun to watch. They are less fun when earnings fail to keep up.', category: 'Stock Ideas', author: 'vt', date: '15 Oct 2026', mins: 4, tone: 'navy', body: body.generic },
  { id: 'five-flexi-caps', title: 'Five flexi-cap funds that have earned a place in a core portfolio', dek: 'Consistency across market cycles, reasonable costs and a clear process — our shortlist.', category: 'Fund Picks', author: 'sd', date: '14 Oct 2026', mins: 7, tone: 'brand', body: body.generic },
  { id: 'rebalancing-drift', title: 'You chose 60:40. The market quietly made it 75:25', dek: 'Why an annual rebalancing check is the most underrated habit in investing.', category: 'Wealth Insight', author: 'vt', date: '13 Oct 2026', mins: 5, tone: 'accent', body: body.generic },
  { id: 'debt-fund-taxation-2026', title: 'Debt funds after the tax changes: still worth it?', dek: 'For short horizons, the case has shifted. For emergency money, liquid funds still win on flexibility.', category: 'Fund Insight', author: 'sd', date: '12 Oct 2026', mins: 6, tone: 'navy', body: body.generic },
  { id: 'new-research-tools', title: 'Introducing portfolio X-Ray and goal tracking', dek: 'See overlap, cost and asset mix across every fund and stock you own — free.', category: 'Announcements', author: 'team', date: '10 Oct 2026', mins: 2, tone: 'brand', body: body.generic },
  { id: 'sip-pause-question', title: 'Should I pause my SIP when markets fall?', dek: 'Short answer: no. Longer answer: falling markets are when SIPs do their best work.', category: 'Ask Us', author: 'team', date: '09 Oct 2026', mins: 3, tone: 'accent', body: body.generic },
  { id: 'smallcap-froth', title: 'Small-cap valuations have cooled. Is it time to add?', dek: 'The premium over large caps has narrowed, but dispersion within the segment is wide.', category: 'Fund Picks', author: 'rm', date: '08 Oct 2026', mins: 5, tone: 'brand', body: body.generic },
];

export const storyById = (id) => stories.find((s) => s.id === id);

export const askQuestions = [
  { q: 'I have ₹10 lakh to invest. Lump sum or STP?', a: 'If the money is meant for equity and your horizon is 7+ years, a 6–12 month STP from a liquid fund reduces regret without hurting long-term returns much.' },
  { q: 'How many mutual funds are too many?', a: 'For most investors, 3–5 funds across categories is enough. Beyond that, overlap rises and you are effectively paying active fees for an index.' },
  { q: 'Is a direct plan always better than a regular plan?', a: 'On cost, yes — typically 0.5–1% a year cheaper. Choose regular only if you genuinely value and use the advice that comes with it.' },
];
