# Technology

> ### ⚠️ Correction notice
>
> An earlier revision of this page described certifications, customer counts, jurisdiction coverage,
> accuracy figures, and a proprietary foundation model ("LexLLM™") that were not substantiated by
> anything in this repository. Those claims have been removed. See
> [`docs/CLAIMS_CORRECTION.md`](../docs/CLAIMS_CORRECTION.md).

## How the AI layer works

Lexora AI does **not** train a foundation model. It orchestrates commercial large language models
behind a retrieval layer that we build and control.

| Layer | What it is |
|---|---|
| Model access | Commercial LLM APIs, reached through the Balamonis AI Gateway |
| Retrieval | Passage retrieval over the customer's own document set plus `uscis_knowledge` reference text (`lexora-ui/lib/rag.ts`) |
| Grounding | Answers cite the source passage so a reviewer can verify each statement |
| Review | A human reviews output before it is used or filed. No automatic submission. |

We publish no accuracy percentage. Groundedness, citation accuracy, and reviewer-correction rate are
the metrics we intend to hold ourselves to; until we measure them reproducibly we will not quote a
number.

---

## System architecture

Two independent frontends, one managed backend. They share no build pipeline and no code.

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
        ┌───────────────────────────────────────┐
        │  Postgres    Auth (magic link)        │
        │  RLS on every table                   │
        └───────────────────────────────────────┘
                            │
                            ▼
                  Balamonis AI Gateway
              (model routing, cost, audit)
```

There is no custom server-side code in this repository. There is no API gateway, WAF, or Word plugin.

### Static site module graph

`js/config.js` must load first — it creates the Supabase client and requires the Supabase UMD
bundle already in scope as `window.supabase`.

```
config.js ──► auth.js    (signInWithMagicLink, signOut, getUser, requireAuth)
          └─► forms.js   (validation + submission)
main.js   (animations, particle canvas — no auth dependency)
```

### Data model

`profiles`, `form_submissions`, `immigration_intakes`, `immigration_cases`,
`case_documents`, `marriage_cases`, `uscis_knowledge`.

Row Level Security is enabled on all of them. `form_submissions` permits anonymous INSERT so the
marketing site can capture leads. The anon key in `js/config.js` is public by design and is safe
only because RLS is enforced — never put a service-role key in browser code.
