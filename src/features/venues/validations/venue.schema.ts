import { z } from 'zod';

import type { VenuesMessages } from '../i18n/venues.messages';
import type { Venue, VenueInput } from '../types';

/** Add / Edit Venue form. Values are strings; `toVenueInput` builds the RPC body. */
export const venueSchema = (e: VenuesMessages['errors']) =>
  z.object({
    name: z.string().trim().min(1, e.required),
    area: z.string(),
    address: z.string().trim(),
    surface: z.string().trim(),
    opening_hours: z.string().trim(),
    phone: z
      .string()
      .trim()
      .refine((v) => !v || /^\+?[\d\s-]{8,16}$/.test(v), e.phone),
    owner_name: z.string().trim(),
    facilities: z.string().trim(),
    description: z.string().trim(),
    format: z.string(),
  });
export type VenueFormValues = z.infer<ReturnType<typeof venueSchema>>;

export const emptyVenueForm: VenueFormValues = {
  name: '',
  area: '',
  address: '',
  surface: '',
  opening_hours: '',
  phone: '',
  owner_name: '',
  facilities: '',
  description: '',
  format: '7-a-side',
};

export const venueToForm = (v: Venue): VenueFormValues => ({
  name: v.name,
  area: v.area,
  address: v.address,
  surface: v.surface,
  opening_hours: v.opening_hours,
  phone: v.phone,
  owner_name: v.owner_name,
  facilities: v.facilities,
  description: v.description,
  format: v.format || '7-a-side',
});

export const toVenueInput = (
  values: VenueFormValues,
  photoUrl: string,
  photos: string[],
): VenueInput => ({ ...values, photo_url: photoUrl, photos });
