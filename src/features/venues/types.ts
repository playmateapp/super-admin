/**
 * Venues (= turfs) as `admin_venues(...)` / `admin_venue(id)` return them. Venues saved from the
 * panel are published (`is_public`) and appear in the app's Venues / Find Turf lists and the
 * challenge venue picker while active. Approved turf requests become venues too
 * (`request_id`, `added_by_player`). Players can't create venues any more (migration 027).
 */

export type VenueStatus = 'active' | 'inactive';

export interface Venue {
  id: string;
  name: string;
  owner_name: string;
  owner_role: string;
  phone: string;
  website: string;
  facebook: string;
  division_id: number | null;
  division: string;
  district_id: number | null;
  district: string;
  thana_id: number | null;
  thana: string;
  post_code: string;
  address: string;
  format: string;
  photo_url: string;
  photos: string[];
  status: VenueStatus;
  is_public: boolean;
  added_by_player: boolean;
  request_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface VenuesParams {
  search?: string;
  status?: string;
  divisionId?: number | null;
  districtId?: number | null;
  thanaId?: number | null;
  page: number;
  pageSize: number;
}

export interface VenuesResponse {
  total: number;
  stats: { total: number; active: number; inactive: number };
  rows: Venue[];
}

/** Body of `admin_save_venue(p_id, p_venue)` — the same fields as the app's turf request form. */
export type VenueInput = Pick<
  Venue,
  | 'name'
  | 'owner_name'
  | 'owner_role'
  | 'phone'
  | 'website'
  | 'facebook'
  | 'division_id'
  | 'district_id'
  | 'thana_id'
  | 'post_code'
  | 'address'
  | 'format'
  | 'photo_url'
  | 'photos'
>;
