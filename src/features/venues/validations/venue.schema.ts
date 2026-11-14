import { z } from 'zod';

import type { VenuesMessages } from '../i18n/venues.messages';
import type { Venue, VenueInput } from '../types';

/**
 * Add / Edit Venue form — the same fields as the app's "Turf Listing Interest Form" (turf name,
 * owner name, role, contact number, Division / District / Thana, post code, full address,
 * website, Facebook page, match format) so admin venues and approved requests match.
 * Location ids are kept as strings for the native selects; `toVenueInput` converts them.
 */
export const venueSchema = (e: VenuesMessages['errors']) =>
  z.object({
    name: z.string().trim().min(1, e.required),
    owner_name: z.string().trim().min(1, e.required),
    owner_role: z.string(),
    phone: z
      .string()
      .trim()
      .refine((v) => /^\+?[\d\s-]{6,16}$/.test(v), e.phone),
    division_id: z.string().min(1, e.required),
    district_id: z.string().min(1, e.required),
    thana_id: z.string().min(1, e.required),
    post_code: z.string().trim().min(1, e.required).max(20),
    address: z.string().trim().min(1, e.required),
    website: z.string().trim(),
    facebook: z.string().trim(),
    format: z.string().min(1, e.required),
  });
export type VenueFormValues = z.infer<ReturnType<typeof venueSchema>>;

export const emptyVenueForm: VenueFormValues = {
  name: '',
  owner_name: '',
  owner_role: '',
  phone: '',
  division_id: '',
  district_id: '',
  thana_id: '',
  post_code: '',
  address: '',
  website: '',
  facebook: '',
  format: '7-a-side',
};

const idText = (v: number | null) => (v == null ? '' : String(v));

export const venueToForm = (v: Venue): VenueFormValues => ({
  name: v.name,
  owner_name: v.owner_name,
  owner_role: v.owner_role,
  phone: v.phone,
  division_id: idText(v.division_id),
  district_id: idText(v.district_id),
  thana_id: idText(v.thana_id),
  post_code: v.post_code,
  address: v.address,
  website: v.website,
  facebook: v.facebook,
  format: v.format || '7-a-side',
});

export const toVenueInput = (
  values: VenueFormValues,
  photoUrl: string,
  photos: string[],
): VenueInput => ({
  ...values,
  phone: values.phone.replace(/[\s-]/g, ''),
  division_id: Number(values.division_id),
  district_id: Number(values.district_id),
  thana_id: Number(values.thana_id),
  photo_url: photoUrl,
  photos,
});
