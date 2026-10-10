# Frequently Asked Questions

> ### ⚠️ Correction notice
>
> An earlier revision of this page described certifications, customer counts, jurisdiction coverage,
> accuracy figures, and a proprietary foundation model ("LexLLM™") that were not substantiated by
> anything in this repository. Those claims have been removed. See
> [`docs/CLAIMS_CORRECTION.md`](../docs/CLAIMS_CORRECTION.md).

---

## General

### What is Lexora AI?
Lexora AI is an early-stage product for AI-assisted legal and immigration document work: document intake, AI-assisted drafting and summarisation, and case/document tracking. It supports legal professionals — it does not give legal advice and does not replace a lawyer.

### Who uses Lexora AI?
We are pre-scale and onboarding our first customers. We publish no customer count because we cannot substantiate one. The product is built for individuals working through immigration paperwork and for small legal teams handling document-heavy matters.

### In what jurisdictions does Lexora AI work?
Today the product's reference content is US immigration focused (`uscis_knowledge`). We do not claim native coverage of other jurisdictions. Document workflows themselves are jurisdiction-agnostic, but the reference material is not.

---

## Technology

### Is Lexora AI built on ChatGPT or another general-purpose AI?
Lexora AI is built on commercial large language models, reached through the Balamonis AI Gateway. We do not train a foundation model. What we build and control is the retrieval, grounding, prompting, and review layer around those models.

### How accurate is Lexora AI?
We do not publish an accuracy figure, because we do not yet measure one reproducibly. Outputs cite the source passage they came from so a reviewer can verify each statement. Treat every output as a draft for human review.

### How fast is it?
Latency depends on document length and the model handling the request. We do not publish a benchmark figure we cannot reproduce on demand.

### Can Lexora AI hallucinate or make mistakes?
Like all AI systems, Lexora AI can make errors. That's why:
- Every output includes confidence scores
- All legal citations are verified against source databases
- We strongly recommend human attorney review for final decisions
- Our human-in-the-loop validation is built into enterprise workflows

---

## Security & Data

### Does my data train your models?
**Never.** Your data is completely isolated from our training pipeline. Full stop.

### Where is my data stored?
You choose your data residency: US, EU, UK, or APAC. Your data never leaves your designated region.

### Is Lexora AI GDPR compliant?
We are not in a position to claim GDPR compliance. We implement encryption in transit and at rest, per-tenant row-level security, and audit logging on privileged actions. We do not currently offer EU data residency or a DPA. If you have a GDPR requirement, talk to us before you sign anything.

### Does Lexora AI preserve attorney-client privilege?
Yes. Our architecture is designed to preserve attorney-client privilege. Data is isolated per client matter, access is role-controlled, and we provide audit trails for privilege log support.

---

## Pricing & Access

### How much does Lexora AI cost?
We offer tiered pricing (Starter, Professional, Enterprise, Government). Contact **sales@lexora.ai** for a custom quote based on your firm size and use case.

### Is there a free trial?
Yes — we offer a **14-day free trial** with full platform access. No credit card required. Book a demo at [lexora.ai/demo](#).

### What integrations are supported?
- Document management: iManage, NetDocuments, SharePoint
- Practice management: Clio, MyCase, PracticePanther
- Data rooms: Intralinks, Datasite, Firmex
- SSO: Okta, Azure AD, Google Workspace
- API access for custom integrations

---

## Support

### What support is available?
| Tier | Support |
|---|---|
| Starter | Email (48h response) |
| Professional | Email + chat (24h response) |
| Enterprise | Dedicated CSM + 4h SLA |
| Government | 24/7 support + dedicated team |

### How do I report a bug or request a feature?
- Bug reports: [GitHub Issues](../../issues/new?template=bug_report.md)
- Feature requests: [GitHub Issues](../../issues/new?template=feature_request.md)
- Security issues: security@lexora.ai (never use public issues for security)
- General: support@lexora.ai

---

*Didn't find your answer? Email us at **hello@lexora.ai***
