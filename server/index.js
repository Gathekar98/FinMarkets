// Long-running server: local dev (`npm run dev`) and any host that runs `npm start`.
// On Vercel this file is not used — see api/index.js.
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { app, svc } from './app.js';

// `--port` (used by `npm run dev`) wins over PORT, so a dev tool's PORT for the web server can't collide with the API.
const portArg = process.argv.indexOf('--port');
const PORT = Number(portArg > 0 ? process.argv[portArg + 1] : process.env.PORT) || 8787;
const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

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
