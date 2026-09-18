# Welcome to Lexora AI

> **AI-assisted legal &amp; immigration document automation**

> ### ⚠️ Correction notice
>
> An earlier revision of this page described certifications, customer counts, jurisdiction coverage,
> accuracy figures, and a proprietary foundation model ("LexLLM™") that were not substantiated by
> anything in this repository. Those claims have been removed. See
> [`docs/CLAIMS_CORRECTION.md`](../docs/CLAIMS_CORRECTION.md).

Lexora AI helps people and small legal teams move document-heavy immigration and legal work through a
structured, auditable workflow. It uses commercial large language models to draft, summarise, and
check documents. It supports legal professionals — it does not give legal advice and does not replace
a lawyer.

---

## 📚 Wiki Navigation

| Page | Description |
|---|---|
| **[[Home]]** | Platform overview (this page) |
| **[[Getting-Started]]** | Quick start &amp; setup guide |
| **[[Products]]** | What the product does today |
| **[[Technology]]** | System architecture |
| **[[Security-and-Compliance]]** | Security posture (no certifications currently held) |
| **[[API-Reference]]** | Developer integration guide |
| **[[Deployment]]** | Hosting &amp; deployment options |
| **[[FAQ]]** | Frequently asked questions |
| **[[Roadmap]]** | Product roadmap |
| **[[Contributing]]** | How to contribute |

---

## What is actually built

| Capability | Implementation |
|---|---|
| Marketing site | `index.html` + `css/` + `js/` — vanilla ES modules, no build step |
| Passwordless sign-in | `js/auth.js` + Supabase Auth magic link |
| Lead capture | `js/forms.js` → `form_submissions` |
| Immigration intake | `immigration.html` → `immigration_intakes` |
| Case &amp; document tracking | `dashboard.html` → `immigration_cases`, `case_documents` |
| Marriage green-card flow | `lexora-ui/app/apply/` → `marriage_cases` |
| Retrieval over USCIS text | `lexora-ui/lib/rag.ts` → `uscis_knowledge` |
| React landing page | `lexora-ui/` — Next.js 16, React 19 |

## What is not built

No security certifications. No proprietary foundation model. No litigation outcome prediction. No
automated government filing. No multi-jurisdiction legal coverage.

## Stage

Early-stage, pre-scale. We are onboarding our first customers. We publish no customer count,
accuracy figure, or cost-reduction number because we cannot yet substantiate one.

## Role in Balamonis Group

This repository is the **Career &amp; Document Automation Engine** venture. Identity, billing, AI
provider access, and audit logging come from Balamonis Core — see
[`docs/PLATFORM_INTEGRATION.md`](../docs/PLATFORM_INTEGRATION.md).
