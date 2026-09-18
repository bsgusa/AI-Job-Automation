// ---------------------------------------------------------------------------
// GENERATED FILE — DO NOT EDIT
//
// Vendored from bsgusa/balamonis_group_main:
//   packages/platform-contracts/src/agent-runtime.ts
//
// Edit the source there and re-run `node scripts/sync-contracts.mjs` in that
// repository. The drift test in this repository fails if this copy is stale.
// ---------------------------------------------------------------------------

// Balamonis Agent Runtime — the contract every AI agent in the group conforms to.
//
// An agent is a declaration, not a script: identity, instructions, the tools it
// may use, the permissions it holds, and the policies that bound it. The runtime
// executes that declaration and records what happened. A new agent should be a
// new declaration, not new orchestration code.
//
// SOURCE OF TRUTH. Ventures vendor a copy — do not redefine these shapes.

import type { VentureId } from './ventures.js';
import type { ModelClass, CallerContext, ToolDefinition } from './ai-gateway.js';

/**
 * Permissions an agent can hold. Deliberately coarse and explicit: an agent
 * declares every capability it needs up front, and the runtime denies anything
 * not declared. Append-only — these are stored values.
 */
export const AGENT_PERMISSIONS = [
  'read_profile',
  'write_profile',
  'read_documents',
  'write_documents',
  'read_jobs',
  'read_github',
  'read_knowledge',
  'write_knowledge',
  'draft_content',
  'read_financials',
  /** Any action with an effect outside Balamonis systems. Always needs approval. */
  'external_side_effect',
] as const;

export type AgentPermission = (typeof AGENT_PERMISSIONS)[number];

/**
 * When a human must approve before the runtime proceeds.
 *
 * `never` is only legitimate for agents whose every tool is read-only. An agent
 * holding `external_side_effect` may not use it — the runtime rejects that
 * combination at registration time, not at run time.
 */
export type ApprovalPolicy =
  | 'never'
  /** Approve each action that writes or leaves our systems. */
  | 'before_side_effects'
  /** Approve the whole plan before any step executes. */
  | 'before_run'
  /** Approve each individual step. */
  | 'every_step';

export interface ModelPolicy {
  modelClass: ModelClass;
  maxOutputTokens: number;
  /** Ceiling in USD for one complete run, across every call it makes. */
  maxRunCostUsd: number;
}

export interface MemoryPolicy {
  /**
   * Named memory scope, e.g. 'career_profile'. Memory is always tenant-scoped:
   * the runtime keys it by (scope, userId, organizationId) so one tenant's
   * memory can never be read into another's run.
   */
  scope: string | null;
  /** Days to retain memory. null means retain until the user deletes it. */
  retentionDays: number | null;
}

export interface EvaluationPolicy {
  /**
   * Require every factual claim in output to cite a retrieved source. Set for
   * any agent whose output a user may act on.
   */
  requireGroundedCitations: boolean;
  /** Fraction of runs sampled for offline quality review. 0–1. */
  sampleRate: number;
}

export interface AgentDefinition {
  /** Stable slug, unique across the group, e.g. 'lexora.career'. */
  id: string;
  /** Semver. Bump on any change to instructions, tools, or permissions. */
  version: string;
  name: string;
  /** Which venture owns this agent. */
  ventureId: VentureId;
  /** System prompt. */
  instructions: string;
  tools: readonly ToolDefinition[];
  permissions: readonly AgentPermission[];
  modelPolicy: ModelPolicy;
  memoryPolicy: MemoryPolicy;
  approvalPolicy: ApprovalPolicy;
  evaluationPolicy: EvaluationPolicy;
}

export type AgentRunStatus =
  | 'pending'
  | 'running'
  | 'awaiting_approval'
  | 'succeeded'
  | 'failed'
  /** Stopped because a policy ceiling was hit (cost, steps, time). */
  | 'halted'
  | 'rejected';

/**
 * The audit record of one agent execution. Mirrors the `agent_runs` table.
 * Every run writes one of these, including runs that fail before the first
 * model call — a run with no record is a bug.
 */
export interface AgentRun {
  id: string;
  agentId: string;
  agentVersion: string;
  ventureId: VentureId;
  /** Who the run was for. */
  userId: string;
  organizationId: string | null;
  status: AgentRunStatus;
  startedAt: string;
  completedAt: string | null;
  latencyMs: number | null;
  /** Concrete model that served the run's calls, when known. */
  model: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  estimatedCostUsd: number | null;
  /** Number of model round-trips. Bounded by the runtime. */
  steps: number;
  /** Safe-to-display failure reason. Never contains credentials or raw provider errors. */
  error: string | null;
}

/** A pending human decision blocking a run. Mirrors `agent_approval_requests`. */
export interface ApprovalRequest {
  id: string;
  agentRunId: string;
  /** Tool the agent wants to invoke. */
  toolName: string;
  /** Arguments, redacted of anything sensitive before storage. */
  toolInput: Record<string, unknown>;
  /** Plain-language description of the effect, written for the approver. */
  summary: string;
  requestedAt: string;
  decidedAt: string | null;
  decision: 'approved' | 'rejected' | null;
  decidedBy: string | null;
}

export interface AgentRunRequest {
  agentId: string;
  caller: CallerContext;
  /** The task. Free text or a structured payload the agent's instructions define. */
  input: Record<string, unknown>;
  /** Hard ceiling on model round-trips for this run. */
  maxSteps?: number;
}

export interface AgentRunResult {
  run: AgentRun;
  /** The agent's output. Shape is agent-specific. */
  output: Record<string, unknown> | null;
  /** Approvals the caller must resolve before the run can continue. */
  pendingApprovals: readonly ApprovalRequest[];
}

/**
 * Registration-time validation. This is the guardrail that makes the permission
 * model real: an agent that claims it never needs approval while holding the
 * permission to act outside our systems is rejected before it can ever run.
 *
 * Returns a list of problems; an empty list means the definition is valid.
 */
export function validateAgentDefinition(def: AgentDefinition): string[] {
  const problems: string[] = [];

  if (def.permissions.includes('external_side_effect') && def.approvalPolicy === 'never') {
    problems.push(
      `Agent '${def.id}' holds 'external_side_effect' but its approvalPolicy is 'never'. ` +
        `An agent that can act outside Balamonis systems must require human approval.`,
    );
  }

  if (def.modelPolicy.maxRunCostUsd <= 0) {
    problems.push(`Agent '${def.id}' must declare a positive maxRunCostUsd.`);
  }

  const declared = new Set<string>(def.permissions);
  for (const p of def.permissions) {
    if (!(AGENT_PERMISSIONS as readonly string[]).includes(p)) {
      problems.push(`Agent '${def.id}' declares unknown permission '${p}'.`);
    }
  }

  // A write tool with no corresponding write permission is a mis-declaration.
  for (const tool of def.tools) {
    if (/^(write|create|update|delete|send|submit|post|publish)_/.test(tool.name)) {
      const hasWrite = [...declared].some((p) => p.startsWith('write_')) ||
        declared.has('external_side_effect') ||
        declared.has('draft_content');
      if (!hasWrite) {
        problems.push(
          `Agent '${def.id}' exposes mutating tool '${tool.name}' but declares no write permission.`,
        );
      }
    }
  }

  if (def.evaluationPolicy.sampleRate < 0 || def.evaluationPolicy.sampleRate > 1) {
    problems.push(`Agent '${def.id}' sampleRate must be between 0 and 1.`);
  }

  if (!/^\d+\.\d+\.\d+$/.test(def.version)) {
    problems.push(`Agent '${def.id}' version '${def.version}' is not semver.`);
  }

  return problems;
}
