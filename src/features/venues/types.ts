/**
 * Venues as `admin_venues(...)` / `admin_venue(id)` return them. Venues saved from the panel
 * are published (`is_public`) and appear in the app's challenge venue picker while active;
 * venues a player added in the app (`added_by_player`) show here too.
 */

export type VenueStatus = 'active' | 'inactive';

export interface Venue {
  id: string;
  name: string;
  area: string;
  address: string;
  format: string;
  surface: string;
  facilities: string;
  phone: string;
  opening_hours: string;
  description: string;
  photo_url: string;
  photos: string[];
  status: VenueStatus;
  is_public: boolean;
  owner_name: string;
  added_by_player: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenuesParams {
  search?: string;
  area?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export interface VenuesResponse {
  total: number;
  stats: { total: number; active: number; inactive: number };
  rows: Venue[];
}

/** Body of `admin_save_venue(p_id, p_venue)`. */
export type VenueInput = Pick<
  Venue,
  | 'name'
  | 'area'
  | 'address'
  | 'format'
  | 'surface'
  | 'facilities'
  | 'phone'
  | 'opening_hours'
  | 'description'
  | 'photo_url'
  | 'photos'
  | 'owner_name'
>;
