// ---------------------------------------------------------------------------
// GENERATED FILE — DO NOT EDIT
//
// Vendored from bsgusa/balamonis_group_main:
//   packages/platform-contracts/src/adapters.ts
//
// Edit the source there and re-run `node scripts/sync-contracts.mjs` in that
// repository. The drift test in this repository fails if this copy is stale.
// ---------------------------------------------------------------------------

// Adapter contracts for ventures that run as separate services.
//
// Two ventures are reached only over a process boundary:
//
//   Balamonis Studio      b-strudio       AGPL-3.0     LEGAL requirement
//   Balamonis Intelligence TradingAgents  Apache-2.0   engineering choice
//
// The Studio boundary is not a preference. AGPL-3.0 is strong copyleft with a
// network clause: combining it with proprietary Core code, or deploying them as
// one application, would extend AGPL obligations to Core — including providing
// source to anyone using it over a network. See docs/LICENSE_AUDIT.md §2.
//
// What Core stores about an adapter venture is a REFERENCE and LIFECYCLE STATE.
// Never the engine's internals, never its intermediate artifacts, never its code.
//
// SOURCE OF TRUTH. Ventures vendor a copy — do not redefine these shapes.

import type { VentureId } from './ventures';

/** Lifecycle of work handed to an adapter venture. */
export type AdapterJobStatus =
  | 'queued'
  | 'running'
  /** Blocked on a human decision inside the venture (e.g. storyboard approval). */
  | 'awaiting_approval'
  | 'succeeded'
  | 'failed'
  /** Cancelled by the requester or by a policy ceiling. */
  | 'cancelled';

/**
 * Core's record of one unit of work in an adapter venture. This is the whole of
 * what Core knows — deliberately shallow.
 */
export interface AdapterJob {
  /** Core's id for the job. */
  id: string;
  ventureId: VentureId;
  /** The venture's own id for the work, so the two can be reconciled. */
  externalId: string | null;
  userId: string;
  organizationId: string | null;
  status: AdapterJobStatus;
  /** Venture-specific job kind, e.g. 'production' or 'research_run'. */
  kind: string;
  /**
   * URL of the finished artifact, when the venture produces one. Core stores the
   * URL, not the artifact — an AGPL engine's outputs stay on its own side.
   */
  outputUrl: string | null;
  /** The venture's own cost estimate in USD, when it reports one. */
  estimatedCostUsd: number | null;
  /** Safe-to-display failure reason. Never a raw stack trace. */
  error: string | null;
  requestedAt: string;
  completedAt: string | null;
}

/**
 * Health of an adapter venture.
 *
 * `unknown` exists because most ventures have no health endpoint yet. An unknown
 * state must display as unknown — showing it as healthy is a lie, and showing it
 * as down triggers false alarms.
 */
export type AdapterHealthState = 'healthy' | 'degraded' | 'down' | 'unknown';

export interface AdapterHealth {
  ventureId: VentureId;
  state: AdapterHealthState;
  /** Round-trip time of the health probe, or null when not probed. */
  latencyMs: number | null;
  /** Venture-reported version, when it reports one. */
  version: string | null;
  checkedAt: string;
  /** Why the state is not healthy. Safe to display. */
  detail: string | null;
}

/**
 * The HTTP surface every adapter venture exposes. Deliberately minimal: four
 * operations, no streaming, no venture-specific verbs. A venture needing more
 * should extend its own API and keep this as the Core-facing contract.
 */
export interface AdapterEndpoints {
  /** `GET  /health`              → AdapterHealth */
  health: '/health';
  /** `POST /jobs`                → AdapterJobAccepted */
  createJob: '/jobs';
  /** `GET  /jobs/:externalId`    → AdapterJobState */
  getJob: '/jobs/:externalId';
  /** `POST /jobs/:externalId/cancel` → AdapterJobState */
  cancelJob: '/jobs/:externalId/cancel';
}

export interface AdapterJobRequest {
  /** Venture-specific job kind. */
  kind: string;
  /** Job parameters. Shape is defined by the venture, validated by the venture. */
  input: Record<string, unknown>;
  /**
   * Core's identity for the requester. The venture uses this for attribution and
   * tenant scoping; it does not re-authenticate the end user.
   */
  requestedBy: { userId: string; organizationId: string | null };
  /**
   * Ceiling in USD. The venture must refuse work it estimates above this rather
   * than starting it and overrunning.
   */
  maxCostUsd: number;
  /** Core callback for status changes. The venture posts AdapterJobState here. */
  callbackUrl: string | null;
}

export interface AdapterJobAccepted {
  externalId: string;
  status: AdapterJobStatus;
  /** The venture's estimate before starting, when it can produce one. */
  estimatedCostUsd: number | null;
}

export interface AdapterJobState {
  externalId: string;
  status: AdapterJobStatus;
  /** 0–1 where the venture can report it. */
  progress: number | null;
  outputUrl: string | null;
  estimatedCostUsd: number | null;
  error: string | null;
  /**
   * Set when status is 'awaiting_approval'. The approval itself happens inside
   * the venture, which owns the creative or analytical judgement; Core only
   * surfaces that someone needs to look.
   */
  approvalUrl: string | null;
}

/**
 * Guardrails a venture declares and Core enforces at the boundary.
 *
 * These encode product commitments that must not be quietly dropped:
 * Intelligence produces research and must never place a trade; Studio must never
 * publish externally without human sign-off.
 */
export interface AdapterPolicy {
  ventureId: VentureId;
  /**
   * True when a human inside the venture must approve before any externally
   * visible output. Studio: creative publication. Never set false for a venture
   * that can publish.
   */
  requiresHumanApprovalBeforeExternalOutput: boolean;
  /**
   * True when the venture is permitted to take a financial action with real
   * money. **This is false for Balamonis Intelligence and must stay false.**
   * Intelligence produces research, simulation, and recommendation — never
   * execution.
   */
  permitsFinancialExecution: boolean;
  /** Ceiling per job in USD, enforced by both sides. */
  maxJobCostUsd: number;
}

/**
 * Declared policy per adapter venture. Asserted by a test, so loosening one of
 * these fails the build rather than slipping through review.
 */
export const ADAPTER_POLICIES: Readonly<Record<string, AdapterPolicy>> = {
  'balamonis-studio': {
    ventureId: 'balamonis-studio',
    // Creative output carries brand and rights risk; a human signs off.
    requiresHumanApprovalBeforeExternalOutput: true,
    permitsFinancialExecution: false,
    maxJobCostUsd: 25,
  },
  'balamonis-intelligence': {
    ventureId: 'balamonis-intelligence',
    requiresHumanApprovalBeforeExternalOutput: true,
    // Research product. Not a trading system. Do not change this.
    permitsFinancialExecution: false,
    maxJobCostUsd: 10,
  },
};
