// Per-user data stored in Supabase (row-level security limits each user to their own rows).
// Tables are created by supabase/schema.sql.

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';

async function q(p) {
  const { data, error } = await p;
  if (error) throw error;
  return data;
}

export function useHoldings() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!user || !supabase) { setRows([]); return; }
    setLoading(true);
    try {
      setRows(await q(supabase.from('holdings').select('*').order('created_at')));
      setError(null);
    } catch (e) { setError(e); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const add = async (h) => {
    const row = await q(supabase.from('holdings').insert({ ...h, user_id: user.id }).select().single());
    setRows((r) => [...r, row]);
  };
  const remove = async (id) => {
    await q(supabase.from('holdings').delete().eq('id', id));
    setRows((r) => r.filter((x) => x.id !== id));
  };
  return { rows, loading, error, add, remove, reload: load };
}

export function useWatchlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user || !supabase) { setItems([]); return; }
    q(supabase.from('watchlist').select('*').order('created_at')).then(setItems).catch(() => setItems([]));
  }, [user]);

  const has = (kind, ref) => items.some((i) => i.kind === kind && i.ref === String(ref));
  const toggle = async (kind, ref, name) => {
    const existing = items.find((i) => i.kind === kind && i.ref === String(ref));
    if (existing) {
      await q(supabase.from('watchlist').delete().eq('id', existing.id));
      setItems((x) => x.filter((i) => i.id !== existing.id));
    } else {
      const row = await q(supabase.from('watchlist').insert({ user_id: user.id, kind, ref: String(ref), name }).select().single());
      setItems((x) => [...x, row]);
    }
  };
  return { items, has, toggle, signedIn: !!user };
}
