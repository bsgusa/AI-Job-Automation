/**
 * Lexora AI — Authentication Module
 * ====================================
 * Magic Link (passwordless OTP) authentication via Supabase Auth.
 *
 * Exported API:
 *   signInWithMagicLink(email)  — send a one-time login link to the user's inbox
 *   signOut()                   — end the current session and go to index.html
 *   getSession()                — return the active Session object or null
 *   getUser()                   — return the active User object or null
 *   requireAuth()               — redirect to auth.html if not logged in
 *   onAuthStateChange(callback) — subscribe to SIGNED_IN / SIGNED_OUT events
 *
 * This module also auto-detects when the user has clicked a magic link and
 * been redirected back to auth.html, and immediately forwards them to
 * dashboard.html once Supabase confirms the session.
 *
 * Usage:
 *   import { signInWithMagicLink, requireAuth, getUser } from './auth.js';
 */

import { supabase } from './config.js';

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Build the full URL that Supabase will embed in the magic-link email.
 * Users are sent here after clicking the link; _handleMagicLinkReturn()
 * then detects the token hash and forwards them to the dashboard.
 *
 * @returns {string}
 */
function _dashboardRedirectUrl() {
  const origin = (typeof window !== 'undefined' && window.location?.origin) || '';
  return `${origin}/dashboard.html`;
}

/**
 * Perform a client-side navigation to the given path.
 *
 * @param {string} path - Absolute path, e.g. '/auth.html'
 */
function _navigate(path) {
  window.location.href = path;
}

// ---------------------------------------------------------------------------
// Magic Link sign-in
// ---------------------------------------------------------------------------

/**
 * Send a magic-link (passwordless OTP) email to `email`.
 * The link will redirect the user to /dashboard.html after authentication.
 *
 * @param {string} email - The recipient's email address.
 * @returns {Promise<{data: object|null, error: object|null}>}
 *
 * @example
 * const { error } = await signInWithMagicLink('user@example.com');
 * if (error) showErrorBanner(error.message);
 * else showSuccessBanner('Check your inbox for a login link!');
 */
export async function signInWithMagicLink(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return {
      data: null,
      error: { message: 'A valid email address is required.' },
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: _dashboardRedirectUrl(),
      },
    });

    if (error) {
      console.error('[Lexora AI] signInWithMagicLink error:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('[Lexora AI] signInWithMagicLink unexpected error:', err);
    return {
      data: null,
      error: { message: err?.message ?? 'An unexpected error occurred sending the magic link.' },
    };
  }
}

// ---------------------------------------------------------------------------
// Sign out
// ---------------------------------------------------------------------------

/**
 * Sign the current user out of Supabase, clear the local session, and
 * redirect the browser to the landing page (index.html).
 *
 * This function always navigates away — even if the Supabase request fails —
 * so the UI never gets stuck in a partially-logged-out state.
 *
 * @returns {Promise<void>}
 *
 * @example
 * document.getElementById('logout-btn').addEventListener('click', signOut);
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[Lexora AI] signOut error:', error.message);
    }
  } catch (err) {
    console.error('[Lexora AI] signOut unexpected error:', err);
  } finally {
    // Always redirect, regardless of whether the API call succeeded.
    _navigate('/index.html');
  }
}

// ---------------------------------------------------------------------------
// Session & user accessors
// ---------------------------------------------------------------------------

/**
 * Return the currently active Supabase Session, or null if the user is not
 * authenticated.  Reads from the local cache first; no network call needed
 * when a valid, non-expired token is already stored.
 *
 * @returns {Promise<object|null>} A Supabase Session object or null.
 *
 * @example
 * const session = await getSession();
 * if (session) console.log('Access token:', session.access_token);
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[Lexora AI] getSession error:', error.message);
      return null;
    }
    return data?.session ?? null;
  } catch (err) {
    console.error('[Lexora AI] getSession unexpected error:', err);
    return null;
  }
}

/**
 * Return the currently authenticated User object, or null.
 * Unlike getSession(), this always validates the token with the server.
 *
 * @returns {Promise<object|null>} A Supabase User object or null.
 *
 * @example
 * const user = await getUser();
 * if (user) greetUser(user.email);
 */
export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('[Lexora AI] getUser error:', error.message);
      return null;
    }
    return data?.user ?? null;
  } catch (err) {
    console.error('[Lexora AI] getUser unexpected error:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Route guard
// ---------------------------------------------------------------------------

/**
 * Redirect unauthenticated visitors to auth.html.
 * Call this near the top of any page that requires login.
 *
 * @returns {Promise<object|null>} The active Session if authenticated, or null
 *   (in which case the browser is already navigating to auth.html).
 *
 * @example
 * // dashboard.html — <script type="module">
 * import { requireAuth } from './js/auth.js';
 * const session = await requireAuth();
 * // Execution only reaches here when the user is logged in.
 * initDashboard(session.user);
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    _navigate('/auth.html');
    return null;
  }
  return session;
}

// ---------------------------------------------------------------------------
// Auth state subscription
// ---------------------------------------------------------------------------

/**
 * Subscribe to Supabase auth state changes.
 *
 * The callback receives two arguments:
 *   - event   {string}      — 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED'
 *   - session {object|null} — the new Session (null on SIGNED_OUT)
 *
 * @param {function(event: string, session: object|null): void} callback
 * @returns {{ data: { subscription: { unsubscribe: function } } }}
 *   Call `subscription.unsubscribe()` in cleanup code (e.g. SPA teardown).
 *
 * @example
 * const { data: { subscription } } = onAuthStateChange((event, session) => {
 *   if (event === 'SIGNED_IN')  renderUserNav(session.user);
 *   if (event === 'SIGNED_OUT') renderGuestNav();
 * });
 *
 * // When the component unmounts:
 * subscription.unsubscribe();
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    try {
      callback(event, session);
    } catch (err) {
      console.error('[Lexora AI] onAuthStateChange callback threw an error:', err);
    }
  });
}

// ---------------------------------------------------------------------------
// Magic-link return handler
// ---------------------------------------------------------------------------

/**
 * Detect when the browser has been redirected back from a magic-link email.
 *
 * Supabase embeds the access_token and refresh_token in the URL hash.  The
 * client library (configured with `detectSessionInUrl: true` in config.js)
 * automatically exchanges those tokens for a session and fires a SIGNED_IN
 * event.  This function listens for that event and, once the session is
 * confirmed, forwards the user to the dashboard.
 *
 * The check is intentionally narrow: it only activates when:
 *   1. The current page is auth.html (or /auth), AND
 *   2. The URL hash contains 'access_token', 'type=magiclink', or 'type=recovery'.
 *
 * This keeps the listener from running on every page.
 */
function _handleMagicLinkReturn() {
  if (typeof window === 'undefined') return;

  const { pathname, hash } = window.location;
  const isAuthPage  = pathname.endsWith('auth.html') || pathname === '/auth';
  const hasTokenHash =
    hash.includes('access_token') ||
    hash.includes('type=magiclink') ||
    hash.includes('type=recovery');

  if (!isAuthPage || !hasTokenHash) return;

  // Supabase will fire SIGNED_IN once it finishes the token exchange.
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      subscription.unsubscribe(); // stop listening — we only need this once
      _navigate('/dashboard.html');
    }
  });
}

// Run automatically whenever this module is first imported.
_handleMagicLinkReturn();
