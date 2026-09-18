// ---------------------------------------------------------------------------
// GENERATED FILE — DO NOT EDIT
//
// Vendored from bsgusa/balamonis_group_main:
//   packages/platform-contracts/src/index.ts
//
// Edit the source there and re-run `node scripts/sync-contracts.mjs` in that
// repository. The drift test in this repository fails if this copy is stale.
// ---------------------------------------------------------------------------

// Balamonis Platform Contracts — the typed boundary between Balamonis Core and
// every venture.
//
// This package is the source of truth. Ventures do not depend on it over npm
// (the repos deploy independently); they vendor a copy via
// `scripts/sync-contracts.mjs` and a drift test fails their CI if the copy
// falls behind. That keeps the contract single-sourced without coupling six
// deployments to one package registry.

export * from './ventures.js';
export * from './registry.js';
export * from './ai-gateway.js';
export * from './agent-runtime.js';
export * from './audit.js';

/**
 * Contract version. Bump the minor on an additive change, the major on a
 * breaking one. The vendored-copy drift test reports this, so a venture running
 * an old contract is visible rather than silently divergent.
 */
export const PLATFORM_CONTRACT_VERSION = '1.0.0';
