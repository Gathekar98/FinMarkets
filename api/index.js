// Vercel serverless entry point. vercel.json rewrites every /api/* request here,
// and Express routes it using the original URL.
import { app, mountPages } from '../server/app.js';

// Static files are served by Vercel before this function is reached.
mountPages(app);

export default app;
