/**
 * Auth types. Admins sign in with phone + password through Supabase Auth (same project as
 * the mobile app); `admin_me()` returns the row from `public.admins`. A phone user who is
 * not in `public.admins` is signed out immediately.
 */

export interface AdminUser {
  id: string;
  full_name: string;
  role: 'super_admin' | 'admin';
  /** E.164 digits without "+" (`61420423143`). */
  phone: string;
  activity_seen_at: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

/** Why sign-in failed — each maps to a Figma error popup. */
export type AuthFailure = 'credentials' | 'notAdmin' | 'blocked' | 'unknown';

export class AuthFlowError extends Error {
  constructor(
    public reason:
      | AuthFailure
      | 'notRegistered'
      | 'codeIncorrect'
      | 'codeExpired'
      | 'tooMany'
      | 'smsFailed'
      | 'samePassword',
    message: string = reason,
  ) {
    super(message);
    this.name = 'AuthFlowError';
  }
}
