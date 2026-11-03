import { rpc, supabase } from '@/lib/api/supabase';

import type { Venue, VenueInput, VenuesParams, VenuesResponse } from '../types';

/** Venues request functions (Supabase RPCs + the `venue-photos` storage bucket). */

/** rpc admin_venues — paged, filtered venue list + header totals. */
export const getVenues = (p: VenuesParams) =>
  rpc<VenuesResponse>('admin_venues', {
    p_search: p.search ?? '',
    p_area: p.area ?? '',
    p_status: p.status ?? '',
    p_page: p.page,
    p_page_size: p.pageSize,
  });

/** rpc admin_venue — one venue. */
export const getVenue = (id: string) => rpc<Venue>('admin_venue', { p_id: id });

/** rpc admin_save_venue — create (id = null) or update; returns the venue id. */
export const saveVenue = (id: string | null, input: VenueInput) =>
  rpc<string>('admin_save_venue', { p_id: id, p_venue: input });

/** rpc admin_set_venue_status — active (shown in the app) / inactive (hidden). */
export const setVenueStatus = (id: string, status: Venue['status']) =>
  rpc<void>('admin_set_venue_status', { p_venue: id, p_status: status });

/** storage venue-photos — uploads one image and returns its public URL. */
export async function uploadVenuePhoto(file: File) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from('venue-photos')
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return supabase.storage.from('venue-photos').getPublicUrl(path).data.publicUrl;
}
