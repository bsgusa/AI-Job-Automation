# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lexora AI** is a legal intelligence platform (v2.0.0) consisting of two parallel frontends:

1. **Static marketing site** — pure HTML/CSS/vanilla JS, no build step, served directly from the repo root
2. **Next.js app** (`lexora-ui/`) — React 19, Next.js 16, TypeScript, Tailwind CSS, shadcn/ui

The backend is fully managed via **Supabase** (PostgreSQL + Auth). There is no custom server-side code.

## Development Commands

### Static site (root)
```bash
npm run dev       # Starts local server via `npx serve .` on port 3000
```
No build required. Changes to `.html`, `css/`, or `js/` files are reflected immediately.

### Next.js app (lexora-ui/)
```bash
cd lexora-ui
npm run dev       # Dev server on port 3000
npm run build     # Production build
npm run lint      # ESLint (Next.js recommended + TypeScript rules)
```

> **Important:** `lexora-ui/AGENTS.md` notes that this Next.js version has breaking API changes from common training data. Before writing Next.js code, consult `node_modules/next/dist/docs/` for the actual API.

### Database
Schema is applied manually (no migration runner):
```bash
# Paste supabase/schema.sql into Supabase Dashboard → SQL Editor, or:
supabase db push
```

## Architecture

### Two-Frontend Pattern
The static site (`index.html`, `auth.html`, `dashboard.html`, `immigration.html`) and the Next.js app (`lexora-ui/`) are independent. They share no code or build pipeline. The static site is the primary public-facing product; `lexora-ui/` contains a React re-implementation of the landing page.

### Static Site JS Module System
The four HTML pages load JS as ES modules. The module graph is:
- `js/config.js` — Creates and exports the Supabase client + `APP_CONFIG`. **Must be loaded first** (requires Supabase UMD CDN bundle to be in scope as `window.supabase`).
- `js/auth.js` — Auth API (`signInWithMagicLink`, `signOut`, `getUser`, `requireAuth`). Imports from `config.js`.
- `js/forms.js` — Form validation and Formspree submission. Imports from `config.js`.
- `js/main.js` — Page animations, particle canvas, scroll interactions. No auth dependency.

### Authentication Flow
All auth is **passwordless magic link** via Supabase. `auth.js:requireAuth()` is called at the top of authenticated pages (`dashboard.html`, `immigration.html`) and redirects to `auth.html` if no session exists. Sessions persist in `localStorage` with auto-refresh enabled.

### Database & RLS
All five Postgres tables have Row Level Security enforced — users can only access their own rows. `form_submissions` allows anonymous INSERT (unauthenticated leads from the marketing site). A trigger on `auth.users` auto-creates a `profiles` row on signup. The `set_updated_at()` trigger function is shared across tables.

Tables: `profiles`, `form_submissions`, `immigration_intakes`, `immigration_cases`, `case_documents`.

### Next.js App Structure
```
lexora-ui/app/layout.tsx   — Root layout with metadata
lexora-ui/app/page.tsx     — Single page, composes all landing sections
lexora-ui/components/landing/  — One file per section (Navbar, Hero, Features, etc.)
lexora-ui/components/ui/       — shadcn/ui primitives
```
Path alias `@/` maps to `lexora-ui/` root (configured in `tsconfig.json`).

## CI Pipeline

Three blocking jobs run on push to `main`, `claude/**`, and `feature/**`:
1. **validate** — HTML5 validation of all `.html` files + CSS, verifies required files exist
2. **security-scan** — TruffleHog secret detection (diff against `main`)
3. **lighthouse** — Performance/accessibility audit (`continue-on-error: true`, so non-blocking in practice)

The `deploy-preview` job only runs on PRs and is currently a placeholder.

## Key Conventions

- **Supabase anon key** in `js/config.js` is intentionally client-side — safe only because RLS is enabled on every table. Do not add tables without RLS policies.
- **No framework on the static site** — do not introduce bundlers, npm imports, or `import` from CDN URLs into the HTML pages. All external libraries load via `<script>` CDN tags before module scripts.
- **Commit style** follows Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`).
- **Deployment** is via Vercel (configured in `vercel.json`). Security headers (CSP, X-Frame-Options, X-Content-Type-Options) are set there, not in HTML meta tags.
- The static site targets **ES2017+** (no transpilation); `lexora-ui/` targets ES2017 via `tsconfig.json`.
