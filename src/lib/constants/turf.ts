/**
 * Turf owner roles (the app's request form stores these English values; show them through the
 * feature messages). Shared by the Venues form and the Turf Requests screen.
 */
export const TURF_ROLES = ['Owner', 'Manager', 'Partner', 'Staff'] as const;
export type TurfRole = (typeof TURF_ROLES)[number];

/** Error codes the turf / venue RPCs raise (`raise exception 'turf_phone_invalid'`). */
export const TURF_ERROR_CODES = [
  'turf_owner_required',
  'turf_phone_invalid',
  'turf_location_required',
  'turf_location_invalid',
  'turf_post_code_required',
  'turf_address_required',
  'turf_format_required',
  'turf_photo_required',
] as const;
export type TurfErrorCode = (typeof TURF_ERROR_CODES)[number];

/** The readable message for a turf RPC error, or `fallback`. */
export function turfErrorMessage(
  message: string,
  messages: Record<TurfErrorCode, string>,
  fallback: string,
) {
  const code = TURF_ERROR_CODES.find((c) => message.includes(c));
  return code ? messages[code] : message || fallback;
}
