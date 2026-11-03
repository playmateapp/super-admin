import { createClient } from '@supabase/supabase-js';

import { SESSION_KEY, supabaseStorage } from '@/lib/auth/token-storage';
import { env } from '@/lib/config/env';

/**
 * The one Supabase client of the panel (replaces the old axios `http`). Features call
 * `rpc()` / `supabase.storage` from their `api/*.api.ts` files — never `createClient` again.
 * Auth refreshes the session itself; it is persisted only through `token-storage`.
 */
export const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_KEY, {
  auth: {
    storageKey: SESSION_KEY,
    storage: supabaseStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

/** Error thrown by `rpc()`; `code` is the Postgres / PostgREST code (`42501` = not an admin). */
export class APIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Call a Postgres function (`public.<fn>`) and return its JSON result, throwing `APIError`
 * on failure so TanStack Query hooks only deal with `onError` / `error`.
 */
export async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error, status } = await supabase.rpc(fn, args);
  if (error) throw new APIError(error.message, error.code, status);
  return data as T;
}
