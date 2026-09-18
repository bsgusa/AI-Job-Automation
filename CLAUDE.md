# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Read this first

Earlier revisions of this repository's documentation and marketing site described
certifications, customers, executives, accuracy figures, and a proprietary
foundation model that **do not exist**. All of it has been removed.

**Read [`docs/CLAIMS_CORRECTION.md`](docs/CLAIMS_CORRECTION.md) before writing or
editing any documentation, marketing copy, or user-facing text in this repository.**

Lexora AI holds **no** security certification. It does **not** train a foundation
model. It does **not** predict litigation outcomes. It does **not** file anything
with any government agency. Do not reintroduce any of those claims, and do not
write a number you cannot point at evidence for.

## Project Overview

**Lexora AI** — AI-assisted legal and immigration document automation. Its role in
the Balamonis Group platform is the **Career & Document Automation Engine**: the
service Lexora Career OS (`bsgusa/lexoraai-admin`) calls when a workflow needs
document generation, intake, or application tracking.

### Automation guardrails (binding)

1. **No application, filing, or outbound submission without explicit, recorded user
   approval.**
2. No CAPTCHA solving, no authentication bypass, no rate-limit evasion, no
   terms-of-service violation on any third-party site.
3. Regulated legal advice routes to a licensed partner. This product provides
   technology and document support only — it is not a law firm and does not give
   legal advice.
4. Every automation step writes an event record so a human can reconstruct what
   happened.

The repository consists of two parallel frontends:

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

> ⚠️ **There are no migration files.** Schema is applied by hand, so there is no
> history, no review, and no reproducible environment. Combined with a public anon
> key and RLS as the only access control, **a table added without a policy is a
> full data exposure, not a partial one.** Adopting `supabase/migrations/` is
> Phase 2 in `bsgusa/balamonis_group_main/docs/MIGRATION_PLAN.md`. Until then, check
> RLS by hand on every schema change.

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

---

## Balamonis Engineering Constitution

> This repository is part of the **Balamonis Group** ecosystem. This section is
> shared across all six repositories. The architecture it refers to lives in
> [`bsgusa/balamonis_group_main/docs/`](https://github.com/bsgusa/balamonis_group_main/tree/main/docs)
> — start with `INTEGRATION_ARCHITECTURE.md`.

### The ecosystem

Balamonis Core provides identity, organizations, RBAC, billing, the venture
registry, the AI Gateway, the agent runtime, audit, and events. Ventures build on
it. **The repositories are deliberately not merged.**

| Repository | Role | Integration |
|---|---|---|
| `balamonis_group_main` | Balamonis Core + Mobility | core |
| `lexoraai-admin` | Lexora Career OS | federated |
| `AI-Job-Automation` | Career & Document Automation Engine | federated |
| `command-center-bala` | Command Center (admin control plane) | federated |
| `b-strudio` | Balamonis Studio — **AGPL-3.0** | **adapter only** |
| `TradingAgents` | Balamonis Intelligence — Apache-2.0 | adapter |

### Before implementing a feature

1. Read this file.
2. Read the repository's own architecture notes.
3. Inspect the existing implementation. Assume it exists before writing it.
4. Search for duplicate functionality — across repositories, not just this one.
5. Check the shared platform contracts. Do not redefine a shape Core already owns.
6. Check security and permissions implications.
7. Check third-party licenses for anything you add.
8. Write tests.
9. Implement the smallest production-safe change.
10. Run the repository's tests and type checks.
11. Update documentation.
12. Report files changed and remaining risks.

### Never

- **Invent a business metric.** No customer count, accuracy figure, uptime number,
  approval rate, or revenue figure without evidence in the repository. This is not
  a style preference — see `AI-Job-Automation/docs/CLAIMS_CORRECTION.md` for what
  it cost.
- **Claim a certification we do not hold.** No SOC 2, ISO 27001, HIPAA, GDPR,
  CCPA, or FedRAMP claim. We hold none of them today.
- **Invent a person, customer, testimonial, or case study.**
- **Expose a secret.** Never put a service-role key in client code.
- **Bypass authentication**, or trust a `userId` from a request body.
- **Bypass a third party's security controls** — no CAPTCHA solving, no auth
  bypass, no rate-limit evasion, no terms-of-service violation.
- **Take a consequential external action without recorded human approval.**
- **Duplicate an identity system.** Core owns users and organizations.
- **Duplicate AI provider logic.** Everything text goes through the AI Gateway.
- **Name a concrete model in a venture.** Ask for `fast`, `balanced`, or `deep`.
- **Add a table without RLS policies.**
- **Copy AGPL code into proprietary Core.** See `docs/LICENSE_AUDIT.md`.
- **Edit a vendored contract file.** Edit the source in Core and re-sync.
- **Rewrite a working system** without a stated reason.

### Always

- Modular architecture with typed service boundaries.
- Tenant isolation enforced in RLS policy, not application code.
- Audit logs for consequential actions.
- Human approval for anything with an effect outside our systems.
- Observable, cost-bounded AI agents.
- Automated tests and a green build before you claim done.
- Incremental, reversible migration over a big-bang rewrite.

### The shared contracts

The source of truth is
`bsgusa/balamonis_group_main/packages/platform-contracts/src/`. Ventures vendor a
copy, because six repositories deploy independently across four stacks.

```bash
# from balamonis_group_main, with ventures checked out as siblings
node scripts/sync-contracts.mjs --check   # drift check, exits 1 on drift
node scripts/sync-contracts.mjs           # write the copies
```

Vendored files carry a `GENERATED FILE — DO NOT EDIT` banner and a
`manifest.json` with a version and content hash. Edits are overwritten.

### Using AI in a venture

```js
const result = await callModel({
  feature: 'resume-review',   // stable slug; quota and cost key off it
  system: SYSTEM_PROMPT,
  userContent,
  maxOutputTokens: 2000,
  modelClass: 'balanced',     // never a model name
  userJwt: token,             // the END USER's token, never a service key
});
```

The gateway owns provider credentials, model selection, quota, cost estimation,
fallback, and audit. If you find yourself writing a provider `fetch` in a venture,
stop.

### Reporting work

State what you changed, what you verified and how, and what risk remains. If tests
fail, say so and show the output. If you skipped something, say so. Do not report
done until it is done.
