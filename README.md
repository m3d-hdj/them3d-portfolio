# TheM3d — Portfolio

**Video Editor & Graphic Designer** — live at [m3d-hdj.github.io/them3d-portfolio](https://m3d-hdj.github.io/them3d-portfolio/)

## Stack
- **React 18 + TypeScript + Vite** — component architecture, strict types
- **Tailwind CSS** — brand design system (royal blue #0045DF / navy gradients / Archivo Black + Poppins)
- **Framer Motion** — scroll reveals, lightbox, drag-to-reorder
- **Supabase** — Postgres + Auth + Storage (project `chqdunxchpqiulywfcnl`, eu-west-3)

## Structure
- `/` — public portfolio (projects, filters, video lightbox, contact form)
- `/admin` — CMS: projects (drag reorder, uploads ≤50MB), messages inbox, site settings, testimonials
- `docs/` — built output, served by GitHub Pages (Settings → Pages → main /docs)

## Development
```bash
npm install
npm run dev     # local dev server
npm run build   # type-check + build to docs/
```

Every push to `main` with a rebuilt `docs/` updates the live site. The publishable Supabase key in the client is safe — data is protected by Row Level Security.
