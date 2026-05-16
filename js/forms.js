/**
 * Lexora AI — Form Submission & Case Management Module
 * ====================================
 * Typed wrappers around Supabase table operations for:
 *   • Public demo / contact form submissions  (anonymous insert allowed)
 *   • Immigration intake forms                (authenticated users only)
 *   • Immigration case CRUD                  (authenticated users only)
 *
 * Every function returns a { data, error } object — callers can destructure
 * without wrapping calls in try/catch.  Errors are also logged to the console
 * with a [Lexora AI] prefix so they are easy to filter in DevTools.
 *
 * Usage:
 *   import { submitDemoRequest, getCasesByUser } from './forms.js';
 */

import { supabase } from './config.js';

// ---------------------------------------------------------------------------
// Private: normalised query runner
// ---------------------------------------------------------------------------

/**
 * Await a Supabase query promise and return a consistent { data, error } shape.
 * Any thrown exception is caught and converted into an error object.
 *
 * @template T
 * @param {Promise<{data: T, error: object|null}>} queryPromise
 * @param {string} context - Label used in error console messages.
 * @returns {Promise<{data: T|null, error: object|null}>}
 */
async function _run(queryPromise, context) {
  try {
    const { data, error } = await queryPromise;
    if (error) {
      console.error(`[Lexora AI] ${context} error:`, error.message);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    const message = err?.message ?? 'An unknown error occurred.';
    console.error(`[Lexora AI] ${context} unexpected error:`, message);
    return { data: null, error: { message } };
  }
}

// ---------------------------------------------------------------------------
// Public (anonymous) — demo / contact form
// ---------------------------------------------------------------------------

/**
 * Insert a website demo or contact request into the `form_submissions` table.
 *
 * This table has an RLS policy that permits anonymous inserts, so the user
 * does not need to be logged in.  See supabase/schema.sql for the policy.
 *
 * @param {{
 *   name:           string,
 *   email:          string,
 *   phone?:         string,
 *   organization?:  string,
 *   interest?:      string,
 *   contact_method?: string,
 *   message?:       string
 * }} data
 * @returns {Promise<{data: object|null, error: object|null}>}
 *
 * @example
 * const { data, error } = await submitDemoRequest({
 *   name: 'Jane Doe',
 *   email: 'jane@lawfirm.com',
 *   interest: 'immigration',
 *   message: 'We handle about 200 cases per year.',
 * });
 */
export async function submitDemoRequest(data) {
  if (!data?.name || !data?.email) {
    return {
      data: null,
      error: { message: 'name and email are required fields.' },
    };
  }

  const payload = {
    name:           data.name.trim(),
    email:          data.email.trim().toLowerCase(),
    phone:          data.phone?.trim()          ?? null,
    organization:   data.organization?.trim()   ?? null,
    interest:       data.interest?.trim()       ?? null,
    contact_method: data.contact_method?.trim() ?? null,
    message:        data.message?.trim()        ?? null,
    source:         'website',
  };

  return _run(
    supabase.from('form_submissions').insert(payload).select().single(),
    'submitDemoRequest'
  );
}

// ---------------------------------------------------------------------------
// Authenticated — immigration intake form
// ---------------------------------------------------------------------------

/**
 * Insert a new immigration intake record for an authenticated user.
 *
 * The `user_id` field is stored so that RLS policies can restrict reads
 * to the owning user and their assigned attorneys.
 *
 * @param {{
 *   user_id:               string,
 *   full_name:             string,
 *   email:                 string,
 *   phone?:                string,
 *   form_type:             string,
 *   priority_date?:        string,   // ISO 8601 date, e.g. '2024-01-15'
 *   current_status?:       string,
 *   country_of_birth?:     string,
 *   country_of_citizenship?: string,
 *   case_description?:     string,
 *   documents_ready?:      boolean
 * }} data
 * @returns {Promise<{data: object|null, error: object|null}>}
 *
 * @example
 * const { data, error } = await submitImmigrationIntake({
 *   user_id: session.user.id,
 *   full_name: 'Maria Garcia',
 *   email: 'maria@example.com',
 *   form_type: 'I-485',
 *   documents_ready: false,
 * });
 */
export async function submitImmigrationIntake(data) {
  if (!data?.user_id || !data?.full_name || !data?.email || !data?.form_type) {
    return {
      data: null,
      error: { message: 'user_id, full_name, email, and form_type are required.' },
    };
  }

  const payload = {
    user_id:                data.user_id,
    full_name:              data.full_name.trim(),
    email:                  data.email.trim().toLowerCase(),
    phone:                  data.phone?.trim()                  ?? null,
    form_type:              data.form_type.trim(),
    priority_date:          data.priority_date                  ?? null,
    current_status:         data.current_status?.trim()         ?? null,
    country_of_birth:       data.country_of_birth?.trim()       ?? null,
    country_of_citizenship: data.country_of_citizenship?.trim() ?? null,
    case_description:       data.case_description?.trim()       ?? null,
    documents_ready:        data.documents_ready                ?? false,
  };

  return _run(
    supabase.from('immigration_intakes').insert(payload).select().single(),
    'submitImmigrationIntake'
  );
}

// ---------------------------------------------------------------------------
// Authenticated — immigration cases: read
// ---------------------------------------------------------------------------

/**
 * Fetch all immigration cases belonging to a user, ordered newest-first.
 *
 * RLS ensures that users can only retrieve their own rows even if the userId
 * argument were tampered with on the client side.
 *
 * @param {string} userId - UUID of the authenticated user.
 * @returns {Promise<{data: object[]|null, error: object|null}>}
 *
 * @example
 * const { data: cases, error } = await getCasesByUser(session.user.id);
 * cases?.forEach(c => renderCaseCard(c));
 */
export async function getCasesByUser(userId) {
  if (!userId) {
    return { data: null, error: { message: 'userId is required.' } };
  }

  return _run(
    supabase
      .from('immigration_cases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    'getCasesByUser'
  );
}

// ---------------------------------------------------------------------------
// Authenticated — immigration cases: create
// ---------------------------------------------------------------------------

/**
 * Create a new immigration case record.
 *
 * New cases default to status 'draft'.  Change to 'active' once the case
 * has been reviewed and accepted by an attorney.
 *
 * @param {{
 *   user_id:          string,
 *   form_type:        string,
 *   petitioner_name?: string,
 *   beneficiary_name?: string,
 *   case_number?:     string,
 *   status?:          string,   // defaults to 'draft'
 *   priority_date?:   string,   // ISO 8601 date
 *   receipt_number?:  string,
 *   notes?:           string,
 *   next_steps?:      string
 * }} data
 * @returns {Promise<{data: object|null, error: object|null}>}
 *
 * @example
 * const { data: newCase, error } = await createCase({
 *   user_id:  session.user.id,
 *   form_type: 'I-130',
 *   petitioner_name: 'John Smith',
 *   beneficiary_name: 'Ana Smith',
 * });
 */
export async function createCase(data) {
  if (!data?.user_id || !data?.form_type) {
    return {
      data: null,
      error: { message: 'user_id and form_type are required.' },
    };
  }

  const payload = {
    user_id:          data.user_id,
    form_type:        data.form_type.trim(),
    petitioner_name:  data.petitioner_name?.trim()  ?? null,
    beneficiary_name: data.beneficiary_name?.trim() ?? null,
    case_number:      data.case_number?.trim()      ?? null,
    status:           data.status?.trim()           ?? 'draft',
    priority_date:    data.priority_date            ?? null,
    receipt_number:   data.receipt_number?.trim()   ?? null,
    notes:            data.notes?.trim()            ?? null,
    next_steps:       data.next_steps?.trim()       ?? null,
  };

  return _run(
    supabase.from('immigration_cases').insert(payload).select().single(),
    'createCase'
  );
}

// ---------------------------------------------------------------------------
// Authenticated — immigration cases: update
// ---------------------------------------------------------------------------

/**
 * Update an existing immigration case by its UUID.
 *
 * Only fields present in `data` are changed; all other columns are untouched.
 * `updated_at` is set automatically to the current UTC timestamp.
 *
 * @param {string} id - UUID of the case to update.
 * @param {Partial<{
 *   form_type:        string,
 *   petitioner_name:  string,
 *   beneficiary_name: string,
 *   case_number:      string,
 *   status:           string,
 *   priority_date:    string,
 *   receipt_number:   string,
 *   notes:            string,
 *   next_steps:       string
 * }>} data - Fields to patch.
 * @returns {Promise<{data: object|null, error: object|null}>}
 *
 * @example
 * const { error } = await updateCase(caseId, {
 *   status: 'active',
 *   receipt_number: 'MSC2490012345',
 *   next_steps: 'Await biometrics appointment notice.',
 * });
 */
export async function updateCase(id, data) {
  if (!id) {
    return { data: null, error: { message: 'Case id is required.' } };
  }
  if (!data || Object.keys(data).length === 0) {
    return { data: null, error: { message: 'No update fields were provided.' } };
  }

  // Remove undefined values to avoid accidentally nulling columns.
  const payload = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );

  // Stamp the updated_at timestamp in the application layer.
  // (A database trigger would be more robust — see schema.sql.)
  payload.updated_at = new Date().toISOString();

  return _run(
    supabase
      .from('immigration_cases')
      .update(payload)
      .eq('id', id)
      .select()
      .single(),
    'updateCase'
  );
}

// ---------------------------------------------------------------------------
// Authenticated — form submissions: read own records
// ---------------------------------------------------------------------------

/**
 * Retrieve all `form_submissions` rows associated with a specific user.
 *
 * Requires authentication; RLS prevents reading other users' submissions.
 *
 * @param {string} userId - UUID of the authenticated user.
 * @returns {Promise<{data: object[]|null, error: object|null}>}
 *
 * @example
 * const { data: submissions } = await getFormSubmissions(session.user.id);
 */
export async function getFormSubmissions(userId) {
  if (!userId) {
    return { data: null, error: { message: 'userId is required.' } };
  }

  return _run(
    supabase
      .from('form_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    'getFormSubmissions'
  );
}
