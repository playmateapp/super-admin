import { rpc, supabase } from '@/lib/api/supabase';
import { toE164 } from '@/lib/utils';

import { AuthFlowError, type AdminUser, type ChangePasswordInput, type LoginInput } from '../types';

/**
 * Admin auth on Supabase. Sign-in = `auth.signInWithPassword({ phone })` followed by
 * `rpc('admin_me')`, which fails (42501) for anyone who isn't in `public.admins`.
 * Password reset = SMS code (Twilio Verify, same as the app) → `auth.updateUser`.
 */

type AuthErr = { message: string; code?: string; status?: number } | null;

function mapAuthError(error: AuthErr): never {
  const code = error?.code ?? '';
  const msg = (error?.message ?? '').toLowerCase();
  if (code === 'invalid_credentials' || msg.includes('invalid login')) {
    throw new AuthFlowError('credentials');
  }
  if (code === 'user_banned' || msg.includes('banned')) throw new AuthFlowError('blocked');
  if (code === 'otp_expired' || msg.includes('expired')) throw new AuthFlowError('codeExpired');
  if (msg.includes('invalid') && msg.includes('token')) throw new AuthFlowError('codeIncorrect');
  if (code === 'over_sms_send_rate_limit' || error?.status === 429 || msg.includes('rate limit')) {
    throw new AuthFlowError('tooMany');
  }
  if (code === 'sms_send_failed' || msg.includes('sms')) throw new AuthFlowError('smsFailed');
  if (code === 'same_password') throw new AuthFlowError('samePassword');
  throw new AuthFlowError('unknown', error?.message);
}

/** POST auth/token (password) + rpc admin_me — signs out again when the user isn't an admin. */
export async function login({ phone, password }: LoginInput) {
  const { error } = await supabase.auth.signInWithPassword({ phone: toE164(phone), password });
  if (error) mapAuthError(error);
  try {
    return await getProfile();
  } catch (err) {
    await supabase.auth.signOut({ scope: 'local' });
    if (err instanceof Error && 'code' in err && err.code === '42501') {
      throw new AuthFlowError('notAdmin');
    }
    throw err;
  }
}

/** rpc admin_me — the signed-in admin. */
export const getProfile = () => rpc<AdminUser>('admin_me');

/** auth/logout — ends this browser's session. */
export async function logout() {
  await supabase.auth.signOut({ scope: 'local' });
}

/** rpc admin_phone_exists + auth/otp — sends the reset code to an admin's phone. */
export async function sendResetCode(phone: string) {
  const e164 = toE164(phone);
  const exists = await rpc<boolean>('admin_phone_exists', { p_phone: e164 });
  if (!exists) throw new AuthFlowError('notRegistered');
  const { error } = await supabase.auth.signInWithOtp({
    phone: e164,
    options: { shouldCreateUser: false },
  });
  if (error) mapAuthError(error);
}

/** auth/verify — the SMS code signs the admin in so the password can be changed. */
export async function verifyResetCode(phone: string, code: string) {
  const { error } = await supabase.auth.verifyOtp({
    phone: toE164(phone),
    token: code,
    type: 'sms',
  });
  if (error) mapAuthError(error);
}

/** auth/user — sets the new password, then signs out so the admin logs in with it. */
export async function resetPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) mapAuthError(error);
  await supabase.auth.signOut({ scope: 'local' });
}

/** Settings → change password: re-checks the old password, then updates it. */
export async function changePassword({ oldPassword, newPassword }: ChangePasswordInput) {
  const { data } = await supabase.auth.getUser();
  const phone = data.user?.phone;
  if (!phone) throw new AuthFlowError('unknown');
  const check = await supabase.auth.signInWithPassword({
    phone: `+${phone}`,
    password: oldPassword,
  });
  if (check.error) mapAuthError(check.error);
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) mapAuthError(error);
}
