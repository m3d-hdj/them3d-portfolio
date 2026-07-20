# TheM3d — Portfolio

**Video Editor & Graphic Designer** — [live site](https://m3d-hdj.github.io/them3d-portfolio/)

Static portfolio (HTML/CSS/JS) + [Supabase](https://supabase.com) backend.

## Pages
- `index.html` — public portfolio (loads projects from Supabase, demo fallback)
- `admin.html` — private admin panel: login, add/edit/delete projects, upload thumbnails & clips (≤50MB)

## Stack
- Supabase project: `them3d-portfolio` (eu-west-3) — Postgres + Auth + Storage
- Long videos: YouTube/Vimeo embeds · Short clips: Supabase Storage (`media` bucket)
- Hosting: GitHub Pages via Actions workflow (`.github/workflows/deploy-pages.yml`)

## Deploy
Every push to `main` auto-deploys. The publishable key in `config.js` is safe to be public — writes are protected by Row Level Security.
