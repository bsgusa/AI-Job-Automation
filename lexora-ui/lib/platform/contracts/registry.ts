// ---------------------------------------------------------------------------
// GENERATED FILE — DO NOT EDIT
//
// Vendored from bsgusa/balamonis_group_main:
//   packages/platform-contracts/src/registry.ts
//
// Edit the source there and re-run `node scripts/sync-contracts.mjs` in that
// repository. The drift test in this repository fails if this copy is stale.
// ---------------------------------------------------------------------------

// The venture registry itself — the single declaration of what exists in the
// Balamonis Group ecosystem, what it is, and how it connects.
//
// Command Center renders this. The venture router routes from it. The migration
// `..._platform_core.sql` seeds the `ventures` table from it. Keep them in sync:
// the drift test in this package fails when a VENTURE_IDS entry has no registry
// entry.
//
// Descriptions here are deliberately plain. No metric, certification, or
// customer claim belongs in this file.

import { VENTURE_IDS, type Venture, type VentureId } from './ventures';

const PROPRIETARY = { spdx: 'proprietary', copyleft: false, noticeRequired: false } as const;

export const VENTURE_REGISTRY: Readonly<Record<VentureId, Venture>> = {
  'balamonis-group': {
    id: 'balamonis-group',
    name: 'Balamonis Group',
    description:
      'The parent platform: identity, organizations, roles, billing, audit, the AI Gateway, and the agent runtime that the other ventures build on.',
    status: 'active',
    integration: 'core',
    repository: 'bsgusa/balamonis_group_main',
    url: null,
    license: PROPRIETARY,
    features: ['identity', 'organizations', 'rbac', 'billing', 'audit', 'ai-gateway', 'agent-runtime', 'venture-registry'],
    healthPath: null,
  },
  'command-center': {
    id: 'command-center',
    name: 'Command Center',
    description:
      'Internal administrative control plane. Aggregates state from the other ventures; owns no venture business logic of its own.',
    status: 'internal',
    integration: 'federated',
    repository: 'bsgusa/command-center-bala',
    url: null,
    license: PROPRIETARY,
    features: ['venture-registry-ui', 'ceo-briefing', 'engineering-metrics', 'ai-cost-reporting'],
    healthPath: '/api/health',
  },
  'lexora-ai': {
    id: 'lexora-ai',
    name: 'Lexora AI — Career OS',
    description:
      'Career platform for professionals: resume review, interview coaching, cover letters, job matching, profile optimization, and a job board.',
    status: 'active',
    integration: 'federated',
    repository: 'bsgusa/lexoraai-admin',
    url: null,
    license: PROPRIETARY,
    features: ['career-profile', 'resume-review', 'interview-coach', 'cover-letter', 'job-match', 'profile-optimizer', 'job-board', 'certifications', 'learning-paths'],
    healthPath: '/api/health',
  },
  'ai-job-automation': {
    id: 'ai-job-automation',
    name: 'Career & Document Automation Engine',
    description:
      'Document intake, AI-assisted drafting, and case tracking for immigration and legal paperwork. Every outbound action requires recorded user approval.',
    status: 'beta',
    integration: 'federated',
    repository: 'bsgusa/AI-Job-Automation',
    url: null,
    license: { spdx: 'MIT', copyleft: false, noticeRequired: true },
    features: ['document-intake', 'case-tracking', 'document-generation', 'uscis-retrieval', 'approval-gated-automation'],
    healthPath: null,
  },
  'balamonis-mobility': {
    id: 'balamonis-mobility',
    name: 'Balamonis Mobility',
    description:
      'Global mobility pathway assessment, eligibility scoring, document packages, and routing to licensed partners where regulated advice is required.',
    status: 'active',
    integration: 'core',
    repository: 'bsgusa/balamonis_group_main',
    url: null,
    license: PROPRIETARY,
    features: ['eligibility-engine', 'pathway-reports', 'documentation-packages', 'partner-routing', 'cases'],
    healthPath: null,
  },
  'balamonis-studio': {
    id: 'balamonis-studio',
    name: 'Balamonis Studio',
    description:
      'AI media production: research, script, scene planning, asset generation, voice, music, and rendering. Creative approval stays human-controlled.',
    status: 'beta',
    // AGPL-3.0. Reached only through an HTTP adapter so its code is never linked
    // into proprietary Core. See docs/LICENSE_AUDIT.md before changing this.
    integration: 'adapter',
    repository: 'bsgusa/b-strudio',
    url: null,
    license: { spdx: 'AGPL-3.0', copyleft: true, noticeRequired: true },
    features: ['media-pipelines', 'script-generation', 'asset-generation', 'voice', 'music', 'rendering', 'storyboard-approval'],
    healthPath: '/health',
  },
  'balamonis-intelligence': {
    id: 'balamonis-intelligence',
    name: 'Balamonis Intelligence',
    description:
      'Multi-agent financial and market research. Produces research, analysis, and reports. Does not execute trades.',
    status: 'internal',
    integration: 'adapter',
    repository: 'bsgusa/TradingAgents',
    url: null,
    license: { spdx: 'Apache-2.0', copyleft: false, noticeRequired: true },
    features: ['market-research', 'multi-agent-analysis', 'research-reports', 'watchlists', 'decision-logs'],
    healthPath: '/health',
  },
  globalvarahai: {
    id: 'globalvarahai',
    name: 'GlobalVarahi AI',
    description: 'Vertical AI agents and research, reached through a gateway in Balamonis Core.',
    status: 'beta',
    integration: 'core',
    repository: 'bsgusa/balamonis_group_main',
    url: null,
    license: PROPRIETARY,
    features: ['api-gateway', 'lead-capture', 'request-logging'],
    healthPath: null,
  },
  'shiv-wabot': {
    id: 'shiv-wabot',
    name: 'Wabot',
    description: 'Messaging automation across WhatsApp and Telegram, with conversation routing rules.',
    status: 'beta',
    integration: 'core',
    repository: 'bsgusa/balamonis_group_main',
    url: null,
    license: PROPRIETARY,
    features: ['whatsapp', 'telegram', 'conversation-routing', 'contacts'],
    healthPath: null,
  },
};

/** All ventures, in registry order. */
export function listVentures(): readonly Venture[] {
  return VENTURE_IDS.map((id) => VENTURE_REGISTRY[id]);
}

export function getVenture(id: VentureId): Venture {
  return VENTURE_REGISTRY[id];
}

/**
 * Ventures whose code carries copyleft obligations. Anything in this list must
 * be integrated by adapter only — never imported into proprietary Core code.
 */
export function copyleftVentures(): readonly Venture[] {
  return listVentures().filter((v) => v.license.copyleft);
}
