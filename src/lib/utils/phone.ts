/**
 * Phone numbers for Supabase phone auth (E.164). Admins type local Bangladeshi numbers
 * (`017…`) or international ones with the country code (`61420423143`, `+61 420 …`).
 */
export function toE164(input: string) {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('880')) return `+${digits}`;
  if (digits.startsWith('01') && digits.length === 11) return `+88${digits}`;
  return `+${digits}`;
}

/** `+8801712345678` → `+88017****5678` (OTP screen). */
export function maskPhone(e164: string) {
  if (e164.length < 8) return e164;
  return `${e164.slice(0, 6)}${'*'.repeat(Math.max(e164.length - 10, 2))}${e164.slice(-4)}`;
}

/** Loose check before calling the API: 8–15 digits. */
export const isPhoneLike = (input: string) => /^\d{8,15}$/.test(input.replace(/\D/g, ''));
