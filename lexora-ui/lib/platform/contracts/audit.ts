// ---------------------------------------------------------------------------
// GENERATED FILE — DO NOT EDIT
//
// Vendored from bsgusa/balamonis_group_main:
//   packages/platform-contracts/src/audit.ts
//
// Edit the source there and re-run `node scripts/sync-contracts.mjs` in that
// repository. The drift test in this repository fails if this copy is stale.
// ---------------------------------------------------------------------------

// Audit and event contracts. Every consequential action in the group writes an
// audit entry; every cross-venture notification is an event.
//
// SOURCE OF TRUTH. Ventures vendor a copy — do not redefine these shapes.

import type { VentureId } from './ventures.js';

/**
 * Audit actions. Append-only: these are stored values that reports key off.
 * Read actions are audited only for sensitive resources, so the log stays
 * signal rather than traffic.
 */
export type AuditAction =
  | 'auth.signin'
  | 'auth.signout'
  | 'access.granted'
  | 'access.revoked'
  | 'record.created'
  | 'record.updated'
  | 'record.deleted'
  | 'document.uploaded'
  | 'document.downloaded'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'agent.run.started'
  | 'agent.run.completed'
  | 'agent.approval.requested'
  | 'agent.approval.decided'
  | 'ai.call'
  | 'external.action';

export interface AuditEntry {
  id: string;
  /** Actor. null for system-initiated actions. */
  actorUserId: string | null;
  organizationId: string | null;
  ventureId: VentureId;
  action: AuditAction;
  /** Table or logical resource type acted on. */
  resourceType: string;
  resourceId: string | null;
  /**
   * Additional context. Must never contain credentials, full document bodies,
   * or personal data beyond what the action already identifies.
   */
  metadata: Record<string, unknown>;
  occurredAt: string;
}

/** A cross-venture event. Ventures publish; Core fans out to subscribers. */
export interface PlatformEvent<T = Record<string, unknown>> {
  id: string;
  /** Dotted name, e.g. 'lexora.application.submitted'. Venture-prefixed. */
  type: string;
  ventureId: VentureId;
  organizationId: string | null;
  userId: string | null;
  payload: T;
  occurredAt: string;
  /** Delivery state, for the outbox that drives fan-out. */
  status: 'pending' | 'delivered' | 'failed';
}
