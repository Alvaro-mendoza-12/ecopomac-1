-- EcoPómac · Supabase schema (PostgreSQL)
-- Ejecutar en Supabase SQL Editor.
-- Requiere: auth (por defecto) + extensiones.

begin;

-- Extensions
create extension if not exists pgcrypto;

-- =========
-- PROFILES
-- =========
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Usuario EcoPómac',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_created_at_idx on public.profiles (created_at desc);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'Usuario EcoPómac'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =======
-- REPORTS
-- =======
do $$
begin
  if not exists (select 1 from pg_type where typname = 'report_type') then
    create type public.report_type as enum ('Tala ilegal', 'Incendio', 'Contaminación');
  end if;
end $$;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete restrict,
  type public.report_type not null,
  description text not null check (char_length(description) between 10 and 800),
  location_hint text not null check (char_length(location_hint) between 3 and 160),
  contact_email text check (contact_email is null or position('@' in contact_email) > 1),
  created_at timestamptz not null default now()
);

create index if not exists reports_created_at_idx on public.reports (created_at desc);
create index if not exists reports_type_idx on public.reports (type);
create index if not exists reports_created_by_idx on public.reports (created_by);

-- ==========
-- LEADERBOARD
-- ==========
create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score int not null check (score between 0 and 100),
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_score_idx on public.leaderboard (score desc, created_at asc);
create index if not exists leaderboard_user_id_idx on public.leaderboard (user_id);

-- ========
-- CERTIFICATES
-- ========
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null,
  score int check (score between 0 and 100),
  is_public boolean not null default true,
  storage_path text, -- opcional: ruta en Storage (pdf/png)
  created_at timestamptz not null default now()
);

create index if not exists certificates_user_id_idx on public.certificates (user_id);
create index if not exists certificates_created_at_idx on public.certificates (created_at desc);

-- =====================
-- RLS + POLICIES
-- =====================
alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.leaderboard enable row level security;
alter table public.certificates enable row level security;

-- PROFILES: read all (for leaderboard display), update self
drop policy if exists "profiles_read_all" on public.profiles;
create policy "profiles_read_all"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- REPORTS: authenticated can insert; read all authenticated (moderación futura)
drop policy if exists "reports_insert_auth" on public.reports;
create policy "reports_insert_auth"
on public.reports for insert
to authenticated
with check (auth.uid() = created_by);

drop policy if exists "reports_read_auth" on public.reports;
create policy "reports_read_auth"
on public.reports for select
to authenticated
using (true);

-- LEADERBOARD: authenticated can read; insert self
drop policy if exists "leaderboard_read_auth" on public.leaderboard;
create policy "leaderboard_read_auth"
on public.leaderboard for select
to authenticated
using (true);

drop policy if exists "leaderboard_insert_self" on public.leaderboard;
create policy "leaderboard_insert_self"
on public.leaderboard for insert
to authenticated
with check (auth.uid() = user_id);

-- CERTIFICATES: public can read if is_public; authenticated can insert self; authenticated can read own
drop policy if exists "certificates_public_read" on public.certificates;
create policy "certificates_public_read"
on public.certificates for select
to anon, authenticated
using (is_public = true);

drop policy if exists "certificates_read_own" on public.certificates;
create policy "certificates_read_own"
on public.certificates for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "certificates_insert_self" on public.certificates;
create policy "certificates_insert_self"
on public.certificates for insert
to authenticated
with check (auth.uid() = user_id);

commit;

