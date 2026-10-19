import express from 'express';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as svc from './services.js';

const app = express();
const PORT = Number(process.env.PORT) || 8787;
const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

app.use(compression());
app.disable('x-powered-by');

/** Wrap an async handler: JSON response, short browser cache, consistent errors. */
const route = (fn, maxAge = 30) => async (req, res) => {
  try {
    const data = await fn(req);
    if (data == null) return res.status(404).json({ error: 'Not found' });
    res.set('Cache-Control', `public, max-age=${maxAge}`);
    res.json(data);
  } catch (err) {
    console.error(`[api] ${req.originalUrl}:`, err.message);
    res.status(502).json({ error: 'Upstream data source unavailable. Please try again shortly.' });
  }
};

app.get('/api/health', (req, res) => res.json({ ok: true, time: Date.now() }));

// Market
app.get('/api/market/overview', route(() => svc.marketOverview()));
app.get('/api/market/chart/:symbol', route((req) => svc.yahoo.chart(req.params.symbol, req.query.range), 120));

// Stocks
app.get('/api/stocks', route(() => svc.stockList()));
app.get('/api/stocks/:ticker', route((req) => svc.stockDetail(req.params.ticker)));
app.get('/api/stocks/:ticker/chart', route((req) => svc.yahoo.chart(svc.toSymbol(req.params.ticker), req.query.range), 120));

// Funds
app.get('/api/funds', route((req) => svc.fundList(req.query), 300));
app.get('/api/funds/meta', route(() => svc.fundMeta(), 300));
app.get('/api/funds/:code', route((req) => svc.fundDetail(Number(req.params.code)), 300));
app.get('/api/funds/:code/chart', route((req) => svc.fundChart(Number(req.params.code), req.query.range), 600));

// Search
app.get('/api/search', route((req) => svc.search(String(req.query.q || '')), 60));

app.use('/api', (req, res) => res.status(404).json({ error: 'Unknown endpoint' }));

// Production: serve the built SPA
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST, { maxAge: '1h', index: false }));
  app.get('*', (req, res) => res.sendFile(path.join(DIST, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`finMarkets API on http://localhost:${PORT}`);
  // Warm the heavy caches so the first visitor is not kept waiting.
  svc.amfi.universe().then((u) => console.log(`[warm] ${u.rows.length} funds, NAV date ${u.asOf}`)).catch((e) => console.warn('[warm] funds', e.message));
  svc.warmFundamentals()?.then(() => console.log('[warm] stock fundamentals ready'));
});
