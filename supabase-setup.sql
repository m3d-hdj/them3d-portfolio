-- ============================================================
-- TheM3d portfolio — Supabase setup
-- Run this ONCE: Supabase Dashboard → SQL Editor → New query →
-- paste everything → Run. Safe to re-run.
-- ============================================================

-- 1) Projects table -------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text,
  year        text,
  video_kind  text not null default 'embed',   -- 'embed' | 'file' | 'none'
  video_url   text,                            -- YouTube/Vimeo link OR uploaded clip URL
  thumb_url   text,                            -- thumbnail image URL
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Anyone can READ (the public site needs this)
drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects
  for select using (true);

-- Only logged-in users (you) can WRITE
drop policy if exists "auth insert projects" on public.projects;
create policy "auth insert projects" on public.projects
  for insert to authenticated with check (true);

drop policy if exists "auth update projects" on public.projects;
create policy "auth update projects" on public.projects
  for update to authenticated using (true);

drop policy if exists "auth delete projects" on public.projects;
create policy "auth delete projects" on public.projects
  for delete to authenticated using (true);

-- 2) Storage bucket for thumbnails + small clips --------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can VIEW files (public portfolio)
drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

-- Only logged-in users (you) can UPLOAD / MODIFY / DELETE
drop policy if exists "auth upload media" on storage.objects;
create policy "auth upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "auth update media" on storage.objects;
create policy "auth update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "auth delete media" on storage.objects;
create policy "auth delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- Done! Next steps: create your admin user (Authentication → Users →
-- Add user), then DISABLE public signups (Authentication → Sign In /
-- Providers → Email → turn off "Allow new users to sign up").
