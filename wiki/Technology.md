# Technology

## LexLLM™ — Legal-Native AI

LexLLM™ is Lexora AI's proprietary large language model, built from scratch for legal work.

### Training Data
| Source | Volume |
|---|---|
| Court opinions & case law | 180M+ documents |
| Contracts & agreements | 120M+ documents |
| Statutes & regulations | 80M+ documents |
| Legal commentary & treatises | 60M+ documents |
| Regulatory filings | 40M+ documents |
| Academic legal literature | 20M+ documents |
| **Total** | **500M+ documents** |

### Architecture
- **Base model:** Custom transformer architecture optimized for long legal documents
- **Context window:** 200K tokens (handle entire contracts in one pass)
- **Fine-tuning:** Jurisdiction-specific models for 47 legal systems
- **RAG layer:** Real-time retrieval from live legal databases
- **Citator:** Integrated validity checking against all major citation systems

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
│         Web App  ·  API  ·  Word Plugin  ·  Mobile          │
└───────────────────────────┬─────────────────────────────────┘
                             │ TLS 1.3
┌───────────────────────────▼─────────────────────────────────┐
│                    API GATEWAY                               │
│          Auth  ·  Rate Limiting  ·  WAF  ·  Routing         │
└──────────┬──────────┬──────────┬──────────┬────────────────-┘
           │          │          │          │
    ┌──────▼──┐ ┌─────▼───┐ ┌───▼──────┐ ┌▼──────────┐
    │Contract │ │Research │ │Compliance│ │Litigation │
    │ Service │ │ Service │ │ Service  │ │ Service   │
    └──────┬──┘ └─────┬───┘ └───┬──────┘ └┬──────────┘
           └──────────┴──────────┴─────────┘
                            │
                   ┌────────▼────────┐
                   │   LexLLM™ Core   │
                   │  Inference Layer  │
                   └────────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
       ┌──────▼──┐   ┌──────▼──┐   ┌─────▼───┐
       │  Vector │   │  Graph  │   │  Legal  │
       │   DB    │   │   DB    │   │   DB    │
       └─────────┘   └─────────┘   └─────────┘
```

---

## Frontend Technology

The Lexora AI website is built with **zero dependencies** for maximum performance and security:

| Component | Technology | Rationale |
|---|---|---|
| Framework | Vanilla HTML5 | No bundle overhead, instant load |
| Styling | CSS Custom Properties | Native theming, no preprocessor |
| Animations | CSS Keyframes + rAF | GPU-accelerated, no library |
| Scroll Effects | IntersectionObserver | Performant, no event listeners |
| Particles | Canvas API | Native browser, no WebGL needed |
| Fonts | Google Fonts CDN | Cached globally, fast load |

### Performance Targets
| Metric | Target | Status |
|---|---|---|
| First Contentful Paint | < 1.0s | ✅ |
| Largest Contentful Paint | < 2.5s | ✅ |
| Total Blocking Time | < 50ms | ✅ |
| Cumulative Layout Shift | < 0.05 | ✅ |
| Lighthouse Performance | > 90 | ✅ |
| Lighthouse Accessibility | > 95 | ✅ |

---

## Infrastructure

- **Cloud:** Multi-region AWS deployment
- **CDN:** CloudFront with 400+ edge locations
- **Uptime SLA:** 99.99% with automatic failover
- **Scaling:** Auto-scaling inference with GPU clusters
- **Monitoring:** Datadog, PagerDuty, custom SLO dashboards
- **CI/CD:** GitHub Actions → staging → canary → production

See [[Deployment]] for hosting options.
