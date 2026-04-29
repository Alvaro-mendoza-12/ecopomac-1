-- EcoPómac · Supabase enterprise add-ons
-- Ejecutar en Supabase SQL Editor DESPUÉS de schema.sql

begin;

-- =========================
-- Certificates: store URLs
-- =========================
alter table public.certificates
  add column if not exists public_url text;

-- =========================
-- Leaderboard: best-score table + RPC
-- =========================
create table if not exists public.leaderboard_best (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  best_score int not null check (best_score between 0 and 100),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_best_score_idx
  on public.leaderboard_best (best_score desc, updated_at asc);

alter table public.leaderboard_best enable row level security;

drop policy if exists "leaderboard_best_read_auth" on public.leaderboard_best;
create policy "leaderboard_best_read_auth"
on public.leaderboard_best for select
to authenticated
using (true);

drop policy if exists "leaderboard_best_insert_self" on public.leaderboard_best;
create policy "leaderboard_best_insert_self"
on public.leaderboard_best for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "leaderboard_best_update_self" on public.leaderboard_best;
create policy "leaderboard_best_update_self"
on public.leaderboard_best for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.submit_best_score(p_score int)
returns public.leaderboard_best
language plpgsql
security invoker
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.leaderboard_best;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  if p_score < 0 or p_score > 100 then
    raise exception 'invalid score';
  end if;

  insert into public.leaderboard_best (user_id, best_score)
  values (v_uid, p_score)
  on conflict (user_id) do update
    set best_score = greatest(public.leaderboard_best.best_score, excluded.best_score),
        updated_at = now();

  select * into v_row from public.leaderboard_best where user_id = v_uid;
  return v_row;
end;
$$;

revoke all on function public.submit_best_score(int) from public;
grant execute on function public.submit_best_score(int) to authenticated;

-- =========================
-- Storage: bucket policies
-- =========================
-- Create bucket manually in Dashboard: certificates
-- Policies below allow authenticated users to upload only within:
--   certificates/<auth.uid()>/...

drop policy if exists "certificates_objects_read_public" on storage.objects;
create policy "certificates_objects_read_public"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'certificates');

drop policy if exists "certificates_objects_insert_own_folder" on storage.objects;
create policy "certificates_objects_insert_own_folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'certificates'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "certificates_objects_update_own_folder" on storage.objects;
create policy "certificates_objects_update_own_folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'certificates'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'certificates'
  and (storage.foldername(name))[1] = auth.uid()::text
);

commit;

