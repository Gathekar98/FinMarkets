# finMarkets

A research and tools website for Indian mutual funds and stocks, built with React + Vite. Right now every page runs on **static sample data** so the layout, content and UI standards can be settled before any backend work.

> All fund houses, schemes, companies, prices and ratings are fictional placeholders.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Hero with an investor-type selector, market pulse, product cards, magazine-style stories, market snapshot + sector heatmap, top-rated funds, tools bento, how ratings work, learn strip, Q&A + newsletter |
| `/funds` | Curated lists, filterable and sortable fund screener, category monitor, NFOs |
| `/funds/:id` | NAV chart, our view, returns vs category, SIP returns, allocation, sectors, holdings, riskometer, peers, investment calculator |
| `/stocks` | Gainers and losers, sector performance, preset screens + screener with Q/G/V/M scores |
| `/stocks/:id` | Price chart, scorecard rings, 5-year financials, shareholding, peers, 52-week range |
| `/markets` | Index board with chart, market breadth, FII/DII flows, commodities |
| `/ipo` | Open IPOs, full IPO calendar |
| `/tools` | SIP, lumpsum, goal and retirement calculators (working maths) |
| `/portfolio` | Demo tracker: summary, asset mix, health checks, add/remove holdings |
| `/learn` | Learning tracks, guides, podcast, videos, glossary |
| `/stories`, `/stories/:id` | Article listing by category and article page |
| `/pricing` | Plans, feature comparison, FAQ |

## Structure

```
src/
  data/         static data — the only place to change when wiring real APIs
  components/
    layout/     Header (ticker tape, mega-menus, search, theme toggle), Footer, nav model
    ui/         Bits (stars, change pills, tabs, chips, hero), charts, gauges, story cards, sparkline
  pages/        one file per route
  styles/       tokens.css (colours/fonts, light + dark), base, components, layout, pages
  utils/        number formatting (Indian notation) and seeded chart series
```

## Moving to live data

Each `src/data/*.js` module exports plain arrays/objects plus small helpers (`fundById`, `fundPortfolio`, `stockFinancials`…). Keep those shapes and replace their bodies with API calls (or a hook such as `useFund(id)`). Charts currently use deterministic generated series from `utils/series.js`; swap `rangeSeries()` for real NAV/price history.
