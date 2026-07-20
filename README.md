# TheM3d — Portfolio

**Video Editor & Graphic Designer**

## Stack
- **React 18 + TypeScript + Vite** — component architecture, strict types
- **Tailwind CSS** — brand design system (royal blue #0045DF / navy gradients / Archivo Black + Poppins)
- **Framer Motion** — scroll reveals, lightbox, drag-to-reorder
- **Supabase** — Postgres + Auth + Storage (RLS-protected, writes locked to the admin account)

## Hosting
**Netlify**, connected to this repo — every push to `main` auto-builds and deploys.
Build: `npm run build` → publish `dist/` (see `netlify.toml`). SPA deep links handled by `public/_redirects`.

## Routes
- `/` — public portfolio (projects, category filters, video lightbox, contact form)
- `/admin` — CMS: projects (drag reorder, uploads ≤50MB), messages inbox, site settings, testimonials

## Development
```bash
npm install
npm run dev     # local dev server
npm run build   # type-check + build to dist/
```

## Security notes
- The Supabase **publishable key** in client code is public by design — all data access is enforced by Row Level Security on the server.
- Auth signups are disabled; write policies are additionally locked to the admin user id.
- Contact form allows anonymous INSERT only; messages are readable only by the admin.
