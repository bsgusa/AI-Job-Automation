-- =============================================================================
-- Lexora AI — Supabase Database Schema
-- =============================================================================
-- HOW TO APPLY:
--   Option A (Supabase Dashboard):
--     1. Open your project → SQL Editor → New query.
--     2. Paste this entire file and click "Run".
--   Option B (Supabase CLI):
--     supabase db push  (if using supabase/migrations workflow)
--
-- TABLES:
--   profiles            — One row per auth.users entry; public user info.
--   form_submissions    — Demo requests and contact forms (anonymous OK).
--   immigration_intakes — Detailed intake questionnaire (authenticated only).
--   immigration_cases   — Active case records managed by attorneys.
--   case_documents      — Files attached to a case (stored in Supabase Storage).
--
-- SECURITY:
--   Row Level Security (RLS) is enabled on every table.
--   Users can only read and write their own rows.
--   Admins / attorneys require a separate role or service-role key.
-- =============================================================================


-- =============================================================================
-- EXTENSIONS
-- =============================================================================

-- uuid_generate_v4() is used for default primary keys.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =============================================================================
-- TABLE: profiles
-- =============================================================================
-- One row per user in auth.users.  Created automatically via trigger when a
-- new user signs up.  Users can read and update their own row; no one else can.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email        TEXT        NOT NULL,
  full_name    TEXT,
  phone        TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own profile
CREATE POLICY "profiles: select own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: users can update their own profile
CREATE POLICY "profiles: update own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- -------------------------------------------------------------------------
-- Trigger: auto-create a profile row when a new user is registered
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER                 -- runs as the function owner, not the caller
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    -- Pull display_name from metadata if provided (e.g. Google OAuth)
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;   -- idempotent: safe to re-run
  RETURN NEW;
END;
$$;

-- Drop before recreating so this file can be re-run safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- Trigger: keep updated_at current on every UPDATE
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- =============================================================================
-- TABLE: form_submissions
-- =============================================================================
-- Stores demo requests, contact forms, and any other public-facing submissions.
-- Anyone on the internet can INSERT (anonymous leads from the marketing site).
-- Only authenticated users can SELECT their own submissions.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- user_id is nullable: anonymous visitors don't have an account yet.
  user_id        UUID        REFERENCES auth.users (id) ON DELETE SET NULL,
  name           TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT,
  organization   TEXT,
  interest       TEXT,
  contact_method TEXT,
  message        TEXT,
  source         TEXT        NOT NULL DEFAULT 'website',
  -- Workflow status: 'new' → 'reviewed' → 'contacted' → 'converted' / 'closed'
  status         TEXT        NOT NULL DEFAULT 'new',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: anyone (including anonymous visitors) can submit a form
CREATE POLICY "form_submissions: insert public"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (true);

-- Policy: authenticated users can read their own submissions
CREATE POLICY "form_submissions: select own"
  ON public.form_submissions
  FOR SELECT
  USING (auth.uid() = user_id);


-- =============================================================================
-- TABLE: immigration_intakes
-- =============================================================================
-- Detailed questionnaire completed by a client before their first attorney
-- consultation.  Only authenticated users; each user sees only their own rows.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.immigration_intakes (
  id                     UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name              TEXT        NOT NULL,
  email                  TEXT        NOT NULL,
  phone                  TEXT,
  -- e.g. 'I-130', 'I-485', 'I-539', 'N-400', 'DS-260'
  form_type              TEXT        NOT NULL,
  -- Visa bulletin priority date relevant to the case (if applicable)
  priority_date          DATE,
  -- e.g. 'Pending I-140 approval', 'In removal proceedings'
  current_status         TEXT,
  country_of_birth       TEXT,
  country_of_citizenship TEXT,
  case_description       TEXT,
  -- Has the client already gathered the supporting documents?
  documents_ready        BOOLEAN     NOT NULL DEFAULT FALSE,
  -- Attorney assigned after intake review (populated by staff, not the client)
  assigned_attorney      TEXT,
  -- 'pending' → 'under_review' → 'accepted' / 'rejected'
  intake_status          TEXT        NOT NULL DEFAULT 'pending',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.immigration_intakes ENABLE ROW LEVEL SECURITY;

-- Policy: users can insert their own intake record
CREATE POLICY "immigration_intakes: insert own"
  ON public.immigration_intakes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can read their own intake records
CREATE POLICY "immigration_intakes: select own"
  ON public.immigration_intakes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can update their own intake records (before attorney review)
CREATE POLICY "immigration_intakes: update own"
  ON public.immigration_intakes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger: keep updated_at current
DROP TRIGGER IF EXISTS set_immigration_intakes_updated_at ON public.immigration_intakes;

CREATE TRIGGER set_immigration_intakes_updated_at
  BEFORE UPDATE ON public.immigration_intakes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- =============================================================================
-- TABLE: immigration_cases
-- =============================================================================
-- Active case records created after an intake is accepted by an attorney.
-- Contains USCIS receipt numbers, milestone tracking, and attorney notes.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.immigration_cases (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  -- Internal or USCIS-assigned case identifier
  case_number      TEXT,
  -- e.g. 'I-130', 'I-485', 'I-765', 'I-131'
  form_type        TEXT        NOT NULL,
  petitioner_name  TEXT,
  beneficiary_name TEXT,
  -- 'draft' → 'active' → 'rfe_issued' → 'approved' / 'denied' / 'withdrawn'
  status           TEXT        NOT NULL DEFAULT 'draft',
  priority_date    DATE,
  -- USCIS receipt number assigned after the petition is filed
  receipt_number   TEXT,
  -- Internal attorney notes (not shown to client by default)
  notes            TEXT,
  -- Plain-language description of what happens next and when
  next_steps       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.immigration_cases ENABLE ROW LEVEL SECURITY;

-- Policy: users can insert their own cases
CREATE POLICY "immigration_cases: insert own"
  ON public.immigration_cases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can read their own cases
CREATE POLICY "immigration_cases: select own"
  ON public.immigration_cases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can update their own cases
CREATE POLICY "immigration_cases: update own"
  ON public.immigration_cases
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger: keep updated_at current
DROP TRIGGER IF EXISTS set_immigration_cases_updated_at ON public.immigration_cases;

CREATE TRIGGER set_immigration_cases_updated_at
  BEFORE UPDATE ON public.immigration_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- =============================================================================
-- TABLE: case_documents
-- =============================================================================
-- Metadata for files uploaded to Supabase Storage and linked to a case.
-- The actual binary is stored in a Storage bucket; only the path is here.
--
-- Recommended Storage bucket name: 'case-documents'
-- Recommended bucket path:         {user_id}/{case_id}/{file_name}
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.case_documents (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id     UUID        NOT NULL REFERENCES public.immigration_cases (id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  -- Original filename as shown to the user
  file_name   TEXT        NOT NULL,
  -- Full path inside the Storage bucket, e.g. '{user_id}/{case_id}/passport.pdf'
  file_path   TEXT        NOT NULL,
  -- File size in bytes; used to display human-readable sizes in the UI
  file_size   BIGINT,
  -- MIME type, e.g. 'application/pdf', 'image/jpeg'
  file_type   TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.case_documents ENABLE ROW LEVEL SECURITY;

-- Policy: users can upload documents to their own cases
CREATE POLICY "case_documents: insert own"
  ON public.case_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can read documents belonging to their own cases
CREATE POLICY "case_documents: select own"
  ON public.case_documents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can delete their own documents
CREATE POLICY "case_documents: delete own"
  ON public.case_documents
  FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================================================
-- USEFUL INDEXES
-- (Add only as needed; over-indexing slows writes on high-volume tables.)
-- =============================================================================

-- Speed up per-user case lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_immigration_cases_user_id
  ON public.immigration_cases (user_id);

CREATE INDEX IF NOT EXISTS idx_immigration_intakes_user_id
  ON public.immigration_intakes (user_id);

CREATE INDEX IF NOT EXISTS idx_form_submissions_user_id
  ON public.form_submissions (user_id);

CREATE INDEX IF NOT EXISTS idx_case_documents_case_id
  ON public.case_documents (case_id);

CREATE INDEX IF NOT EXISTS idx_case_documents_user_id
  ON public.case_documents (user_id);
