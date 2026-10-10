# Claims Correction Record

**Date:** 2026-09-18
**Scope:** `bsgusa/AI-Job-Automation`
**Branch:** `claude/balamonis-master-platform-ipb9sp`

This document is the permanent record of unsubstantiated claims that were published in this
repository and have now been removed. It exists so the correction is auditable and so the same claims
do not reappear.

## Why this was urgent

The claims below were not marketing exaggeration. They were assertions of third-party certification,
named customer outcomes, named employee credentials, and regulatory approval rates. Publishing them
while selling a product creates exposure under deceptive-advertising law, and the fabricated
FedRAMP authorization in particular asserted a US federal government authorization that was never
granted.

## 1. Fabricated security certifications — REMOVED

Claimed as held, in `README.md`, `SECURITY.md`, `wiki/Security-and-Compliance.md`, `wiki/Home.md`,
`wiki/Roadmap.md`, `index.html`, and `auth.html`:

| Claim | Reality |
|---|---|
| SOC 2 Type II — "✅ Certified" | Not held. No audit has been performed. |
| ISO 27001 — "✅ Certified" | Not held. |
| HIPAA — "✅ Compliant" | Not assessed. |
| CCPA / CPRA — "✅ Compliant" | Not assessed. |
| GDPR — "✅ Compliant", "fully GDPR compliant with EU data residency, DPA templates" | Not assessed. No EU data residency. No DPA. |
| FedRAMP — "✅ Authorized" | **Never authorized.** No FedRAMP process was ever begun. |

Compliance tables now read `⬜ Not certified — Not currently held; no certification is claimed`.

## 2. Fabricated customers and outcomes — REMOVED

- "trusted by 500+ law firms and enterprises in 47 jurisdictions"
- "500+ organizations", "Government agencies in 12 countries"
- **NovaTech Global** — "processed 12,000+ contracts", "went from 25 attorneys to 6"
- **Rodriguez & Associates** — "win rate jumped 34% in year one"
- **EuroBank AG** — "caught a critical GDPR exposure 6 weeks early", "saving an estimated €4.2M"
- Three customer testimonials attributed to these organizations

None of these organizations appear anywhere in this codebase. The entire `results`, `case-studies`
sections of `index.html` were removed.

## 3. Fabricated people — REMOVED

Six named executives with detailed biographies were published in the `team` section of `index.html`,
including claimed credentials at **Clifford Chance**, **Google Brain**, **Oracle**, **OpenAI**,
Harvard Law, MIT, Stanford, Georgetown, and Oxford, plus "12 patents in large language model
architectures". Six blog posts carried bylines from these people. A "Bessemer VP" investor reference
also appeared.

The `team` section was removed. Blog bylines now read "Lexora AI Team".

> If any of these names correspond to real individuals, publishing invented biographies and
> employment claims about them is a separate and serious problem. Confirm that none of this content
> is still live in any deployed environment, cache, or CDN.

## 4. Fabricated model — REMOVED

"**LexLLM™** — our proprietary large language model trained from scratch on **500M+ legal
documents**" with a training-data breakdown table (180M court opinions, 120M contracts, and so on),
"jurisdiction-specific fine-tuning across 47 legal systems", and "LexLLM™ v2 — 40% accuracy
improvement".

No model training code, training data, model weights, or inference service exists in this repository.
The product calls commercial LLM APIs. Documentation now says so.

## 5. Fabricated performance and outcome metrics — REMOVED

| Claim | Status |
|---|---|
| 94% contract risk-detection accuracy | No measurement exists |
| 85% litigation outcome-prediction accuracy | No such feature exists |
| 97% reduction in contract review time | No measurement exists |
| "< 4 seconds to analyze a 500-page contract" | No benchmark exists |
| 99.99% uptime SLA | No SLA is offered |
| 2.4M+ documents analyzed, 98% client satisfaction, 60% cost reduction | No measurement exists |
| **98% USCIS approval rate** | **No measurement exists.** An immigration approval-rate claim is regulated advertising. |
| 94% IP conflict detection rate | No such feature exists |

## 6. Fabricated capability and regulatory claims — CORRECTED

- "operates natively across **47 jurisdictions**" → reference content is US immigration only.
- "combines artificial intelligence with **licensed immigration attorneys** to guide you through every
  USCIS form" → corrected to an attorney *referral* relationship, with an explicit "we are not a law
  firm and do not provide legal advice" statement.
- "**Attorney-Client Privilege** Preserved" as a security feature → corrected to per-matter isolation
  and audit trails, with privilege identified as a legal question for the customer's counsel.
- "Founded in 2021 by a team of legal scholars, AI researchers, and enterprise technologists" →
  removed; unverifiable.
- "HSM-backed key management with automatic 90-day rotation", "column-level encryption",
  "SSO via SAML 2.0 and OIDC", "IP allowlisting", "data residency in US/EU/UK/APAC",
  "FedRAMP, WAF, API Gateway, Word plugin, mobile app" → none implemented; corrected to describe the
  managed Postgres/storage and row-level-security controls that are.
- `wiki/Roadmap.md` listed SOC 2, FedRAMP, EU/APAC residency, SSO, LexLLM v2, and GA modules for M&A
  and IP under **Shipped**. None shipped. Moved out of Shipped with an inline note.

## Standing rule

Every number, certification, customer count, and accuracy figure in this repository must be traceable
to evidence that also lives in this repository. If the evidence is not here, the claim does not ship.
This is enforced at review time — see `CLAUDE.md`.

## Follow-up required (not code — owner action)

1. **Verify no deployed environment still serves the old content.** Check the Vercel production
   deployment, any preview URLs, and CDN caches. This repository is only the source.
2. **Check other properties for the same claims.** `lexoraai.org`, `lexoraai.space`, and any
   Balamonis-operated site or profile that repeated the certification or customer claims.
3. **Check outbound material.** Pitch decks, proposals, LinkedIn, and any email sequence that quoted
   these figures. `bsgusa/lexoraai-admin` contains a `pitch_decks` table and a social-content
   generator — both should be reviewed for the same claims.
4. **If any of these claims reached a paying customer or investor**, that is a disclosure question for
   counsel, not an engineering one.
