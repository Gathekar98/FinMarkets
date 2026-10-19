// Express app with every API route. Used two ways:
//  - server/index.js runs it as a normal Node server (local dev, Render, a VPS…)
//  - api/index.js exports it as a Vercel serverless function
import express from 'express';
import compression from 'compression';
import * as svc from './services.js';

export const app = express();

app.use(compression());
app.disable('x-powered-by');

/**
 * Wrap an async handler: JSON response, consistent errors, and cache headers.
 * `s-maxage` lets a CDN (Vercel's edge) serve the same answer to every visitor for that long,
 * and `stale-while-revalidate` keeps serving the last answer while a fresh one is fetched.
 */
const route = (fn, maxAge = 30) => async (req, res) => {
  try {
    const data = await fn(req);
    if (data == null) return res.status(404).json({ error: 'Not found' });
    const age = typeof maxAge === 'function' ? maxAge(data) : maxAge;
    res.set('Cache-Control', `public, max-age=${age}, s-maxage=${age}, stale-while-revalidate=${age * 10}`);
    res.json(data);
  } catch (err) {
    console.error(`[api] ${req.originalUrl}:`, err.message);
    res.set('Cache-Control', 'no-store');
    res.status(502).json({ error: 'Upstream data source unavailable. Please try again shortly.' });
  }
};

app.get('/api/health', (req, res) => res.json({ ok: true, time: Date.now() }));

// Market
app.get('/api/market/overview', route(() => svc.marketOverview(), 60));
app.get('/api/market/chart/:symbol', route((req) => svc.yahoo.chart(req.params.symbol, req.query.range), 120));

// Stocks
// A fresh serverless instance answers before scores are ready — don't let the CDN hold that answer long.
app.get('/api/stocks', route(() => svc.stockList(), (d) => (d.scored ? 60 : 5)));
app.get('/api/stocks/:ticker', route((req) => svc.stockDetail(req.params.ticker), 60));
app.get('/api/stocks/:ticker/chart', route((req) => svc.yahoo.chart(svc.toSymbol(req.params.ticker), req.query.range), 120));

// Funds (NAVs change once a day, so cache longer)
app.get('/api/funds', route((req) => svc.fundList(req.query), 900));
app.get('/api/funds/meta', route(() => svc.fundMeta(), 900));
app.get('/api/funds/:code', route((req) => svc.fundDetail(Number(req.params.code)), 900));
app.get('/api/funds/:code/chart', route((req) => svc.fundChart(Number(req.params.code), req.query.range), 1800));

// Batched prices for watchlists / portfolios
app.get('/api/prices', route((req) => svc.prices(req.query), 30));

// Search
app.get('/api/search', route((req) => svc.search(String(req.query.q || '')), 300));

app.use('/api', (req, res) => res.status(404).json({ error: 'Unknown endpoint' }));

export { svc };
