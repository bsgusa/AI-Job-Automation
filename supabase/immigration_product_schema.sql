-- =============================================================================
-- Lexora AI — Marriage Green Card Product Schema
-- =============================================================================
-- Apply after the base schema.sql (which creates the shared trigger functions).
--
-- TABLES:
--   marriage_cases   — One per paid intake; tracks status, intake data, packets
--   uscis_knowledge  — USCIS guidance chunks for RAG (pgvector-ready)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Uncomment when pgvector is enabled in your Supabase project:
-- CREATE EXTENSION IF NOT EXISTS vector;


-- =============================================================================
-- TABLE: marriage_cases
-- =============================================================================
-- Created when Stripe payment succeeds (via webhook). Stores the full intake
-- JSONB, generated packet path, and checklist / RFE risk data.
-- Keyed by stripe_session_id so the client can poll status without auth.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.marriage_cases (
  id                     UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Optional: populated after the user logs in or provides email at checkout
  user_id                UUID        REFERENCES auth.users (id) ON DELETE SET NULL,
  email                  TEXT        NOT NULL,
  stripe_session_id      TEXT        NOT NULL UNIQUE,
  stripe_payment_intent  TEXT,
  -- 'pending_payment' → 'paid' → 'intake_complete' → 'generating' → 'complete' / 'error'
  status                 TEXT        NOT NULL DEFAULT 'pending_payment',
  -- Full structured intake data (PetitionerInfo, BeneficiaryInfo, etc.)
  intake_data            JSONB,
  -- Supabase Storage path to the generated ZIP packet
  generated_packet_path  TEXT,
  -- Document checklist items: [{item, required, description, tip}]
  checklist              JSONB,
  -- RFE risk analysis: [{category, risk_level, reasoning, mitigation}]
  rfe_risks              JSONB,
  -- Claude-generated filing instructions (markdown)
  filing_instructions    TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.marriage_cases ENABLE ROW LEVEL SECURITY;

-- Public INSERT is blocked; rows are created only by service-role (webhook)
-- Authenticated users can read their own case by user_id
CREATE POLICY "marriage_cases: select own"
  ON public.marriage_cases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow unauthenticated read by stripe_session_id via RPC (see below)
-- Direct anonymous SELECT is blocked; use the get_case_by_session RPC.

DROP TRIGGER IF EXISTS set_marriage_cases_updated_at ON public.marriage_cases;
CREATE TRIGGER set_marriage_cases_updated_at
  BEFORE UPDATE ON public.marriage_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- =============================================================================
-- FUNCTION: get_case_by_session
-- =============================================================================
-- Security-definer RPC so the client can fetch case status using only the
-- stripe_session_id (no auth required). Returns limited fields — no PII.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.get_case_by_session(p_session_id TEXT)
RETURNS TABLE (
  id                    UUID,
  status                TEXT,
  generated_packet_path TEXT,
  checklist             JSONB,
  rfe_risks             JSONB,
  filing_instructions   TEXT,
  created_at            TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mc.id,
    mc.status,
    mc.generated_packet_path,
    mc.checklist,
    mc.rfe_risks,
    mc.filing_instructions,
    mc.created_at
  FROM public.marriage_cases mc
  WHERE mc.stripe_session_id = p_session_id;
END;
$$;


-- =============================================================================
-- TABLE: uscis_knowledge
-- =============================================================================
-- Curated USCIS guidance chunks. The `embedding` column requires pgvector.
-- Without pgvector the table still works; full-text search uses `content`.
-- Populate via seed script or admin dashboard.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.uscis_knowledge (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- e.g. 'I-130', 'I-485', 'general'
  form_type  TEXT        NOT NULL,
  -- e.g. 'petitioner', 'beneficiary', 'marriage', 'background', 'financial'
  step       TEXT        NOT NULL,
  -- Plain text content — the chunk sent to Claude
  content    TEXT        NOT NULL,
  -- Source URL or citation for provenance
  source_url TEXT,
  -- Uncomment when pgvector is enabled:
  -- embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.uscis_knowledge ENABLE ROW LEVEL SECURITY;

-- Read-only for authenticated users; no user-facing writes
CREATE POLICY "uscis_knowledge: select authenticated"
  ON public.uscis_knowledge
  FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert/update via dashboard or seed script
-- (No additional policy needed; service role bypasses RLS)

CREATE INDEX IF NOT EXISTS idx_uscis_knowledge_form_step
  ON public.uscis_knowledge (form_type, step);

-- Full-text search index for MVP (before pgvector is enabled)
CREATE INDEX IF NOT EXISTS idx_uscis_knowledge_content_fts
  ON public.uscis_knowledge
  USING gin(to_tsvector('english', content));
