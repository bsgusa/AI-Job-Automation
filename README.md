<div align="center">

<img src="assets/favicon.svg" width="80" height="80" alt="Lexora AI Logo" />

# Lexora AI

### AI-assisted legal &amp; immigration document automation

[![License: MIT](https://img.shields.io/badge/License-MIT-6C63FF.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-3ECFCF.svg?style=for-the-badge)](CHANGELOG.md)

**Document intake, AI-assisted drafting, and case tracking for immigration and legal workflows — with a human reviewer in the loop at every step.**

[📖 Documentation](docs/) · [🔐 Security](SECURITY.md) · [🤝 Contributing](CONTRIBUTING.md)

</div>

---

> ### ⚠️ Documentation correction notice
>
> Earlier revisions of this README, the wiki, and the marketing site described Lexora AI as holding
> SOC 2 Type II, ISO 27001, HIPAA, CCPA and FedRAMP certification, serving "500+ law firms across 47
> jurisdictions", and running a proprietary foundation model ("LexLLM™") trained on "500M+ legal
> documents". **None of those claims were substantiated by anything in this repository, and all of
> them have been removed.** Lexora AI holds no third-party security certification today. This README
> now describes only what the code in this repository actually does. See
> [`docs/CLAIMS_CORRECTION.md`](docs/CLAIMS_CORRECTION.md) for the full record.

---

## What is Lexora AI?

Lexora AI is an early-stage product that helps people and small legal teams move document-heavy
immigration and legal work through a structured, auditable workflow. It uses commercial large
language models to draft, summarise, and check documents — it does not replace a lawyer, and it does
not give legal advice.

**What it does today:**

| Capability | Where it lives |
|---|---|
| Public marketing site | `index.html`, `css/`, `js/` (vanilla ES modules, no build step) |
| Passwordless sign-in (magic link) | `js/auth.js` + Supabase Auth |
| Lead / contact capture | `js/forms.js` → `form_submissions` |
| Immigration intake questionnaire | `immigration.html` → `immigration_intakes` |
| Case + document tracking | `dashboard.html` → `immigration_cases`, `case_documents` |
| Marriage green-card product flow | `lexora-ui/app/apply/` → `marriage_cases` |
| Retrieval over USCIS reference text | `lexora-ui/lib/rag.ts` → `uscis_knowledge` |
| React re-implementation of the landing page | `lexora-ui/` (Next.js 16, React 19) |

**What it does not do:** it does not hold security certifications, it does not train its own
foundation model, it does not predict litigation outcomes, it does not file anything with any
government agency on your behalf, and it does not operate in "47 jurisdictions".

## Role in the Balamonis Group platform

This repository is a **venture** in the Balamonis Group ecosystem. Its platform-facing role is the
**Career &amp; Document Automation Engine** — the service that Lexora Career OS
([`bsgusa/lexoraai-admin`](https://github.com/bsgusa/lexoraai-admin)) calls when a workflow needs
document generation, intake, or application tracking.

```
Lexora Career OS  ──►  Automation Engine (this repo)  ──►  Balamonis Core
  (user-facing)          job + document workflows           identity, billing,
                                                            AI Gateway, audit
```

Identity, billing, AI provider access, and audit logging are **not** this repo's job — they belong to
Balamonis Core. See [`docs/PLATFORM_INTEGRATION.md`](docs/PLATFORM_INTEGRATION.md).

### Automation guardrails (binding)

1. No application, filing, or outbound submission happens without an explicit, recorded user approval.
2. No CAPTCHA solving, no authentication bypass, no rate-limit evasion, no terms-of-service violation
   on any third-party site.
3. Regulated legal advice is routed to a licensed partner. This product provides technology and
   document support only.
4. Every automation step writes an event record so a human can reconstruct what happened.

## Architecture

Two independent frontends, one managed backend. They share no build pipeline.

```
┌──────────────────────────┐   ┌──────────────────────────┐
│  Static site (repo root) │   │  lexora-ui/ (Next.js 16) │
│  *.html + css/ + js/     │   │  React 19 + Tailwind     │
│  no build step           │   │  shadcn/ui               │
└────────────┬─────────────┘   └────────────┬─────────────┘
             │                              │
             └──────────────┬───────────────┘
                            ▼
                    Supabase (managed)
              Postgres + Auth + RLS on every table
```

### Static site module graph

`js/config.js` must load first — it creates the Supabase client and exports `APP_CONFIG`, and it
requires the Supabase UMD bundle to already be in scope as `window.supabase`.

```
config.js ──► auth.js    (signInWithMagicLink, signOut, getUser, requireAuth)
          └─► forms.js   (validation + submission)
main.js   (animations, particle canvas — no auth dependency)
```

### Database

Schema is applied manually — there is no migration runner:

```bash
# Paste supabase/schema.sql into Supabase Dashboard → SQL Editor, or:
supabase db push
```

Tables: `profiles`, `form_submissions`, `immigration_intakes`, `immigration_cases`,
`case_documents`, `marriage_cases`, `uscis_knowledge`.

**Row Level Security is enabled on every table.** Users reach only their own rows.
`form_submissions` permits anonymous INSERT so the marketing site can capture leads. A trigger on
`auth.users` creates the matching `profiles` row on signup. **Do not add a table without RLS
policies.**

## Development

### Static site
```bash
npm run dev      # npx serve . on port 3000 — no build required
```

### Next.js app
```bash
cd lexora-ui
npm run dev      # port 3000
npm run build
npm run lint
```

> **Next.js version note:** `lexora-ui/AGENTS.md` records that this Next.js version has breaking API
> changes relative to common training data. Check `node_modules/next/dist/docs/` for the real API
> before writing Next.js code here.

## CI

Three jobs run on push to `main`, `claude/**`, and `feature/**`:

| Job | What it does | Blocking |
|---|---|---|
| `validate` | HTML5 + CSS validation, required-file check | yes |
| `security-scan` | TruffleHog secret detection (diff vs `main`) | yes |
| `lighthouse` | Performance / accessibility audit | no (`continue-on-error`) |

`deploy-preview` runs on PRs only and is currently a placeholder.

## Conventions

- **The Supabase anon key in `js/config.js` is intentionally public.** It is safe *only* because RLS
  is enabled on every table. Never put a service-role key in browser code.
- **No bundler on the static site.** External libraries load via `<script>` CDN tags before the
  module scripts. Do not introduce npm imports or CDN `import` statements into the HTML pages.
- **Commits follow Conventional Commits** (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`).
- **Deployment** is Vercel (`vercel.json`). Security headers (CSP, X-Frame-Options,
  X-Content-Type-Options) are set there, not in HTML meta tags.
- Static site targets **ES2017+** with no transpilation; `lexora-ui/` targets ES2017 via `tsconfig.json`.

## Claims policy

Any number, certification, customer count, or accuracy figure in this repository must be traceable
to evidence that also lives in this repository. If you cannot point at the evidence, do not write the
claim. This is enforced by review — see [`CLAUDE.md`](CLAUDE.md).

## License

MIT — see [LICENSE](LICENSE).
