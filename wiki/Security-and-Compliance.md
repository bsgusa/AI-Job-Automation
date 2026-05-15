# Security & Compliance

Lexora AI was built with security as a foundational principle, not an afterthought. Legal data is among the most sensitive information in the world.

---

## Certifications

| Certification | Status | Scope |
|---|---|---|
| **SOC 2 Type II** | ✅ Certified | Security, Availability, Confidentiality, Privacy |
| **ISO 27001** | ✅ Certified | Information Security Management System |
| **GDPR** | ✅ Compliant | EU data processing & residency |
| **HIPAA** | ✅ Compliant | Healthcare data handling |
| **CCPA / CPRA** | ✅ Compliant | California consumer data rights |
| **FedRAMP** | ✅ Authorized | US Government cloud services |

---

## Data Protection Principles

### 1. Your Data Never Trains Our Models
Client data is **completely isolated** from our model training pipeline. Every piece of data you upload is used exclusively to serve your requests and is never incorporated into LexLLM™ updates.

### 2. Encryption Everywhere
- **At rest:** AES-256-GCM encryption for all stored data
- **In transit:** TLS 1.3 for all connections, enforced HSTS
- **Key management:** HSM-backed key storage with automatic 90-day rotation
- **Database:** Column-level encryption for sensitive fields

### 3. Data Residency
Choose where your data lives:
- 🇺🇸 United States: `us-east-1` (Virginia), `us-west-2` (Oregon)
- 🇪🇺 European Union: `eu-west-1` (Ireland), `eu-central-1` (Frankfurt)
- 🇬🇧 United Kingdom: `eu-west-2` (London)
- 🌏 Asia Pacific: `ap-southeast-1` (Singapore), `ap-northeast-1` (Tokyo)

### 4. Complete Tenant Isolation
- Dedicated compute resources for Enterprise tier
- No data co-mingling across tenants
- Separate encryption keys per organization
- Attorney-client privilege preserved by architectural design

---

## Access Control

- **Multi-factor authentication** enforced on all accounts
- **Role-based access control (RBAC)** with principle of least privilege
- **Single Sign-On (SSO)** via SAML 2.0 and OIDC
- **Session management** with configurable timeout (15 min – 8 hours)
- **IP allowlisting** for enterprise deployments
- **Audit logs** for every action — immutable, tamper-evident

---

## Infrastructure Security

| Layer | Protection |
|---|---|
| Network | DDoS protection, WAF, VPC isolation |
| Application | OWASP Top 10 mitigations, CSP headers |
| Data | Encryption at rest and in transit |
| Identity | MFA, SSO, PAM for privileged access |
| Monitoring | 24/7 SOC, SIEM, anomaly detection |
| Testing | Quarterly penetration tests, continuous DAST |

---

## Incident Response

| Stage | SLA |
|---|---|
| Detection | < 15 minutes |
| Containment | < 1 hour |
| Customer notification | < 4 hours for critical incidents |
| Remediation | Per severity (Critical: 24h, High: 72h) |
| Post-mortem | Within 5 business days |

---

## Reporting a Vulnerability

Please **do not** create a public GitHub issue for security vulnerabilities.

**Contact:** security@lexora.ai

We respond within 24 hours and offer a private bug bounty program for qualifying disclosures.

Full details: [SECURITY.md](../SECURITY.md)

---

## Legal & Privacy

- **Privacy Policy:** [lexora.ai/privacy](#)
- **Terms of Service:** [lexora.ai/terms](#)
- **Data Processing Agreement (DPA):** Available on request
- **Sub-processor List:** [lexora.ai/subprocessors](#)
