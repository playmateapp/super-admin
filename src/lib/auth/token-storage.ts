/**
 * The ONLY place the admin session is read or written. Supabase Auth keeps its session
 * (access + refresh token) through `supabaseStorage`; everything else asks `tokenStorage`.
 * Browser-only: every function is a no-op on the server.
 */

/** Storage key Supabase Auth writes under (`<key>` and `<key>-code-verifier`). */
export const SESSION_KEY = 'playmate.admin.session';

const isBrowser = () => typeof window !== 'undefined';

/** `storage` adapter handed to the Supabase client. */
export const supabaseStorage = {
  getItem: (key: string) => (isBrowser() ? window.localStorage.getItem(key) : null),
  setItem: (key: string, value: string) => {
    if (isBrowser()) window.localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (isBrowser()) window.localStorage.removeItem(key);
  },
};

export const tokenStorage = {
  /** True when a stored session exists (it may still be refreshed / rejected by the API). */
  hasSession: () => !!supabaseStorage.getItem(SESSION_KEY),
  clear: () => {
    supabaseStorage.removeItem(SESSION_KEY);
    supabaseStorage.removeItem(`${SESSION_KEY}-code-verifier`);
  },
};
