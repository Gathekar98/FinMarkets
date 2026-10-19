-- finMarkets — run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Creates per-user tables with row-level security so each user only sees their own data.

create table if not exists public.holdings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  kind        text not null check (kind in ('Fund', 'Stock', 'Gold', 'FD', 'Other')),
  ref         text,              -- AMFI scheme code for funds, NSE ticker for stocks
  name        text not null,
  units       numeric,           -- units / shares held (funds, stocks)
  invested    numeric not null,  -- total amount invested in ₹
  current     numeric,           -- manual current value for assets without a live price
  buy_date    date,
  created_at  timestamptz not null default now()
);

create table if not exists public.watchlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  kind        text not null check (kind in ('Fund', 'Stock')),
  ref         text not null,
  name        text,
  created_at  timestamptz not null default now(),
  unique (user_id, kind, ref)
);

alter table public.holdings  enable row level security;
alter table public.watchlist enable row level security;

drop policy if exists "own holdings" on public.holdings;
create policy "own holdings" on public.holdings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own watchlist" on public.watchlist;
create policy "own watchlist" on public.watchlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists holdings_user_idx  on public.holdings (user_id);
create index if not exists watchlist_user_idx on public.watchlist (user_id);
