// ---------------------------------------------------------------------------
// GENERATED FILE — DO NOT EDIT
//
// Vendored from bsgusa/balamonis_group_main:
//   packages/platform-contracts/src/ventures.ts
//
// Edit the source there and re-run `node scripts/sync-contracts.mjs` in that
// repository. The drift test in this repository fails if this copy is stale.
// ---------------------------------------------------------------------------

// Venture registry — the canonical list of Balamonis Group ventures and the
// access model over them.
//
// This file is the SOURCE OF TRUTH. Ventures vendor a copy (see
// `scripts/sync-contracts.mjs` and the drift test in each venture) rather than
// redefining these shapes locally. Adding a venture means editing this file and
// the matching `ventures` migration seed, then re-syncing.

/**
 * Stable venture identifiers. These are database values and URL path segments,
 * so they are append-only — never rename one without a migration.
 *
 * Note: `globalvarahai` preserves the (misspelled) identifier already stored by
 * migration 20260602_venture_access.sql. Renaming it would orphan existing
 * venture_access rows, so the typo is load-bearing. Do not "fix" it.
 */
export const VENTURE_IDS = [
  'balamonis-group',
  'command-center',
  'lexora-ai',
  'ai-job-automation',
  'balamonis-mobility',
  'balamonis-studio',
  'balamonis-intelligence',
  'globalvarahai',
  'shiv-wabot',
] as const;

export type VentureId = (typeof VENTURE_IDS)[number];

export function isVentureId(value: unknown): value is VentureId {
  return typeof value === 'string' && (VENTURE_IDS as readonly string[]).includes(value);
}

/** Access levels on a venture, ordered from least to most privileged. */
export const VENTURE_ROLES = ['viewer', 'editor', 'admin', 'owner'] as const;
export type VentureRole = (typeof VENTURE_ROLES)[number];

const ROLE_RANK: Record<VentureRole, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
  owner: 3,
};

/** True when `held` satisfies `required`. Use this instead of string equality. */
export function roleSatisfies(held: VentureRole, required: VentureRole): boolean {
  return ROLE_RANK[held] >= ROLE_RANK[required];
}

/** Operational state of a venture. Drives Command Center display, not access. */
export type VentureStatus = 'active' | 'beta' | 'internal' | 'paused' | 'archived';

/** How a venture is wired into the platform. */
export type VentureIntegration =
  /** Runs inside Balamonis Core itself. */
  | 'core'
  /** A separate app that authenticates against Core and calls its APIs. */
  | 'federated'
  /** Reached only through an adapter, because of licensing or runtime isolation. */
  | 'adapter';

export interface VentureLicense {
  /** SPDX identifier, or 'proprietary'. */
  spdx: string;
  /**
   * True when this venture's code must NOT be copied into proprietary Core code.
   * Set for copyleft licenses. Enforced by review, documented per venture.
   */
  copyleft: boolean;
  /** Attribution or notice obligations that survive distribution. */
  noticeRequired: boolean;
}

export interface Venture {
  id: VentureId;
  /** Display name. */
  name: string;
  /** One sentence, plain language, no marketing claims. */
  description: string;
  status: VentureStatus;
  integration: VentureIntegration;
  /** GitHub repository in `owner/repo` form, when the venture has its own repo. */
  repository: string | null;
  /** Public URL, when the venture has one. */
  url: string | null;
  license: VentureLicense;
  /**
   * Capability slugs this venture exposes. Free-form but stable; Command Center
   * and the venture router key off these.
   */
  features: readonly string[];
  /**
   * Health endpoint path relative to the venture's own origin, or null when the
   * venture exposes no health check. Command Center degrades gracefully on null.
   */
  healthPath: string | null;
}

/** A user's access grant on one venture. Mirrors the `venture_access` table. */
export interface VentureAccess {
  userId: string;
  ventureId: VentureId;
  role: VentureRole;
  grantedAt: string;
  grantedBy: string | null;
}
