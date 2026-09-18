// ---------------------------------------------------------------------------
// GENERATED FILE — DO NOT EDIT
//
// Vendored from bsgusa/balamonis_group_main:
//   packages/platform-contracts/src/ai-gateway.ts
//
// Edit the source there and re-run `node scripts/sync-contracts.mjs` in that
// repository. The drift test in this repository fails if this copy is stale.
// ---------------------------------------------------------------------------

// Balamonis AI Gateway — the provider-agnostic contract every venture uses to
// reach a language model.
//
// The point of this file is that no venture should contain a provider SDK call,
// a provider API key, or a hard-coded model name. A venture states what it
// needs; the gateway decides which provider and model serves it, records the
// cost, and enforces the caller's quota.
//
// SOURCE OF TRUTH. Ventures vendor a copy — do not redefine these shapes.

import type { VentureId } from './ventures.js';

/**
 * Capability classes a venture can ask for, instead of naming a model. The
 * gateway maps these to concrete models via configuration, so upgrading a model
 * is a config change in Core, not a code change in six repos.
 */
export type ModelClass =
  /** Cheapest path. Classification, extraction, short rewrites. */
  | 'fast'
  /** Default. Most drafting, review, and summarisation work. */
  | 'balanced'
  /** Hardest reasoning. Architecture review, multi-step analysis. */
  | 'deep';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
}

/**
 * Identifies who and what a request is on behalf of. Every gateway call carries
 * one. The gateway refuses a request without it — that is what makes usage
 * attributable and tenant isolation enforceable.
 */
export interface CallerContext {
  /** Supabase auth user id the work is being done for. */
  userId: string;
  /** Organization/tenant the work belongs to, when the venture is multi-tenant. */
  organizationId: string | null;
  /** Which venture is calling. */
  ventureId: VentureId;
  /**
   * Feature slug within the venture, e.g. 'resume-review'. Quotas and cost
   * reporting are per (user, venture, feature), so this must be stable.
   */
  feature: string;
  /** Agent run this call belongs to, when issued from an agent. */
  agentRunId?: string;
}

export interface ChatRequest {
  caller: CallerContext;
  modelClass: ModelClass;
  /** System prompt. Kept separate so the gateway can cache it per provider. */
  system?: string;
  messages: readonly Message[];
  maxOutputTokens: number;
  /** 0–1. Omit to use the gateway default for the model class. */
  temperature?: number;
  /**
   * When set, the gateway requests structured output matching this JSON Schema
   * and validates the response against it before returning. A response that
   * does not validate is an error, not a partial success.
   */
  jsonSchema?: Record<string, unknown>;
  /** Tools the model may call. The gateway does not execute them — see AgentRuntime. */
  tools?: readonly ToolDefinition[];
  /**
   * Hard ceiling in USD for this single call. The gateway refuses the call when
   * its own estimate exceeds this. Protects against a prompt-size bug turning
   * into a billing incident.
   */
  maxCostUsd?: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  /** JSON Schema for the tool's arguments. */
  inputSchema: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  /** Tokens served from provider prompt cache, when the provider reports it. */
  cachedInputTokens?: number;
}

export interface UsageReport {
  usage: TokenUsage;
  /**
   * Gateway's cost estimate in USD. An estimate, not an invoice — providers bill
   * on their own accounting. Never present this to a customer as a charge.
   */
  estimatedCostUsd: number;
  /** Provider that actually served the request, e.g. 'anthropic'. */
  provider: string;
  /** Concrete model id that served the request. */
  model: string;
  /** True when the request fell back off the preferred model for its class. */
  fellBack: boolean;
  latencyMs: number;
}

export interface ChatResponse {
  /** Assistant text. Empty string when the model returned only tool calls. */
  text: string;
  /** Parsed and schema-validated object, present only when jsonSchema was set. */
  structured?: Record<string, unknown>;
  toolCalls: readonly ToolCall[];
  stopReason: 'end_turn' | 'max_tokens' | 'tool_use' | 'refusal';
  report: UsageReport;
}

export interface EmbedRequest {
  caller: CallerContext;
  /** Texts to embed. The gateway batches these. */
  inputs: readonly string[];
  /**
   * Dimension the caller's vector column expects. The gateway refuses a model
   * whose output dimension differs, rather than silently truncating.
   */
  dimensions: number;
}

export interface EmbedResponse {
  embeddings: readonly (readonly number[])[];
  report: UsageReport;
}

/**
 * Errors the gateway returns as a typed failure rather than throwing an opaque
 * error. Callers are expected to handle `quota_exceeded` and `not_configured`
 * with a clear user-facing message — neither is a bug.
 */
export type GatewayErrorCode =
  /** No provider credential is configured for the requested model class. */
  | 'not_configured'
  /** Caller is over its per-user/venture/feature daily quota. */
  | 'quota_exceeded'
  /** Request would exceed maxCostUsd, or the venture's budget cap. */
  | 'cost_limit_exceeded'
  /** Input exceeded the gateway's field-length cap. */
  | 'input_too_large'
  /** Caller lacks access to the venture it claims to be calling for. */
  | 'forbidden'
  /** Structured output failed schema validation after retries. */
  | 'invalid_structured_output'
  /** Every candidate provider failed. */
  | 'provider_unavailable';

export interface GatewayError {
  code: GatewayErrorCode;
  /** Safe to show a user. Contains no provider details or internal identifiers. */
  message: string;
  /** Seconds until the caller may retry, when the code is retryable. */
  retryAfterSeconds?: number;
}

/** Gateway calls return this instead of throwing, so failures are type-checked. */
export type GatewayResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: GatewayError };

/**
 * The interface a venture programs against. Core provides the implementation;
 * a venture that needs a different transport (HTTP, edge function, direct)
 * supplies its own adapter satisfying this interface.
 */
export interface AiGateway {
  chat(request: ChatRequest): Promise<GatewayResult<ChatResponse>>;
  embed(request: EmbedRequest): Promise<GatewayResult<EmbedResponse>>;
}
