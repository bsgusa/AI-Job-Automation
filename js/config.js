/**
 * Lexora AI — Supabase Configuration
 * ====================================
 * HOW TO FILL IN YOUR CREDENTIALS:
 *
 *   1. Go to https://app.supabase.com and open your project.
 *   2. In the left sidebar navigate to: Project Settings → API
 *   3. Copy the "Project URL" value → paste it as SUPABASE_URL below.
 *   4. Copy the "anon / public" key → paste it as SUPABASE_ANON_KEY below.
 *   5. Save this file. Never commit real keys to a public repository.
 *
 * NOTE: The anon key is intentionally safe to ship in client-side code, BUT
 * only when Row Level Security (RLS) is enabled on every table. The SQL in
 * supabase/schema.sql sets up those policies — run it before going live.
 */

// ---------------------------------------------------------------------------
// Supabase project credentials — replace placeholder strings before deploying
// ---------------------------------------------------------------------------

export const SUPABASE_URL     = 'https://rziahcelwdirrjiadahc.supabase.co';
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// ---------------------------------------------------------------------------
// Supabase client (uses the UMD global exposed by the CDN bundle)
//
// Required <script> tag in your HTML — place it before any module scripts:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
// ---------------------------------------------------------------------------

if (
  typeof window === 'undefined' ||
  typeof window.supabase === 'undefined' ||
  typeof window.supabase.createClient !== 'function'
) {
  throw new Error(
    '[Lexora AI] Supabase CDN script not found. ' +
    'Add the Supabase UMD bundle via <script> before loading config.js.'
  );
}

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Keep the session alive in localStorage across page loads and tabs.
    persistSession: true,
    // Silently refresh the JWT before it expires so users stay logged in.
    autoRefreshToken: true,
    // Parse access_token / refresh_token from the URL hash on page load
    // (required for magic-link and OAuth redirects).
    detectSessionInUrl: true,
  },
});

// ---------------------------------------------------------------------------
// Application-wide constants
// ---------------------------------------------------------------------------

export const APP_CONFIG = {
  /** Display name used in email templates, page titles, etc. */
  appName: 'Lexora AI',

  /** E.164-formatted support phone number displayed to users. */
  supportPhone: '+17272601783',

  /** Primary support email address. */
  supportEmail: 'support@lexoraai.org',

  /**
   * WhatsApp number (digits only, no leading +).
   * Use as: `https://wa.me/${APP_CONFIG.whatsappNumber}`
   */
  whatsappNumber: '17272601783',
};
