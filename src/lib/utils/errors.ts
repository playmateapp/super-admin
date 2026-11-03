/**
 * The only place API errors are turned into user-facing text. Components call
 * `getErrorMessage(err, fallback)` / `parseAPIError(err)` — never read error internals.
 * Supabase errors (`rpc()` → `APIError`, Auth → `AuthError`) are `Error`s with an optional
 * numeric `status` and string `code`.
 */

export interface ParsedAPIError {
  status?: number;
  code?: string;
  message: string;
}

export function parseAPIError(err: unknown, fallback = 'Something went wrong'): ParsedAPIError {
  if (err instanceof Error) {
    const status = 'status' in err && typeof err.status === 'number' ? err.status : undefined;
    const code = 'code' in err && typeof err.code === 'string' ? err.code : undefined;
    return { status, code, message: err.message || fallback };
  }
  return { message: fallback };
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong') {
  return parseAPIError(err, fallback).message;
}
