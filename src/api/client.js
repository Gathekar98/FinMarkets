import { useCallback, useEffect, useRef, useState } from 'react';

const memo = new Map(); // url -> { at, data } so revisiting a page renders instantly

export async function api(url) {
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.error || `Request failed (${r.status})`);
  memo.set(url, { at: Date.now(), data: body });
  return body;
}

/**
 * Fetch JSON from our API and keep it fresh.
 * `refresh` (ms) re-polls while the tab is visible — use it for live prices.
 */
export function useApi(url, { refresh = 0 } = {}) {
  const cachedEntry = url ? memo.get(url) : null;
  const [state, setState] = useState({ data: cachedEntry?.data ?? null, error: null, loading: !cachedEntry && !!url });
  const urlRef = useRef(url);
  urlRef.current = url;

  const load = useCallback(async (quiet) => {
    if (!url) return;
    if (!quiet) setState((s) => ({ ...s, loading: !memo.get(url), error: null }));
    try {
      const data = await api(url);
      if (urlRef.current === url) setState({ data, error: null, loading: false });
    } catch (error) {
      if (urlRef.current === url) setState((s) => ({ data: s.data, error, loading: false }));
    }
  }, [url]);

  useEffect(() => {
    const hit = url ? memo.get(url) : null;
    setState({ data: hit?.data ?? null, error: null, loading: !hit && !!url });
    load(!!hit);
    if (!refresh) return undefined;
    const id = setInterval(() => document.visibilityState === 'visible' && load(true), refresh);
    return () => clearInterval(id);
  }, [url, refresh, load]);

  return { ...state, reload: () => load(false) };
}

export const LIVE = 60 * 1000;

/** "16 Oct, 3:42 PM" from a timestamp. */
export const timeLabel = (t) =>
  t ? new Date(t).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '';

export const marketStateLabel = (s) => ({ REGULAR: 'Market open', PRE: 'Pre-open', PREPRE: 'Closed', POST: 'Closed', POSTPOST: 'Closed', CLOSED: 'Closed' }[s] || 'Closed');
