import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Serverless hosts (Vercel) only allow writes to /tmp, which survives while a function instance stays warm.
const DISK_DIR = process.env.VERCEL
  ? path.join('/tmp', 'finmarkets-cache')
  : path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.cache');
const mem = new Map();
const inflight = new Map();

/**
 * Memoise an async loader for `ttl` ms.
 * - Concurrent callers share one in-flight request.
 * - If a refresh fails, the last good value is served (stale) instead of an error.
 * - `disk: true` also persists the value so a restart does not refetch large files.
 */
export async function cached(key, ttl, loader, { disk = false } = {}) {
  const hit = mem.get(key);
  const now = Date.now();
  if (hit && now - hit.at < ttl) return hit.value;

  if (!hit && disk) {
    const fromDisk = await readDisk(key);
    if (fromDisk && now - fromDisk.at < ttl) {
      mem.set(key, fromDisk);
      return fromDisk.value;
    }
  }

  if (inflight.has(key)) return inflight.get(key);
  const p = (async () => {
    try {
      const value = await loader();
      const entry = { at: Date.now(), value };
      mem.set(key, entry);
      if (disk) writeDisk(key, entry).catch(() => {});
      return value;
    } catch (err) {
      const stale = hit || (disk && (await readDisk(key)));
      if (stale) {
        console.warn(`[cache] ${key} refresh failed, serving stale: ${err.message}`);
        return stale.value;
      }
      throw err;
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, p);
  return p;
}

const file = (key) => path.join(DISK_DIR, `${key.replace(/[^a-z0-9_-]/gi, '_')}.json`);

async function readDisk(key) {
  try {
    return JSON.parse(await fs.readFile(file(key), 'utf8'));
  } catch {
    return null;
  }
}

async function writeDisk(key, entry) {
  await fs.mkdir(DISK_DIR, { recursive: true });
  await fs.writeFile(file(key), JSON.stringify(entry));
}

/** Run async `fn` over `items` with at most `limit` in flight. */
export async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      try {
        out[idx] = await fn(items[idx], idx);
      } catch {
        out[idx] = null;
      }
    }
  });
  await Promise.all(workers);
  return out;
}

export const MIN = 60 * 1000;
export const HOUR = 60 * MIN;
