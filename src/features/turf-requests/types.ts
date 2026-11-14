/**
 * Turf owners' "Turf Listing Interest Form" requests from the app (`public.turf_requests`, as
 * `admin_turf_requests(...)` / `admin_turf_request(id)` return them). Approving one copies it
 * into `venues` (published); rejecting sends the reason to the owner, who may appeal once;
 * deleting lets the owner send a new request.
 */

export type TurfRequestStatus = 'pending' | 'appealed' | 'approved' | 'rejected';

export interface TurfRequest {
  id: string;
  user_id: string;
  turf_name: string;
  owner_name: string;
  owner_role: string;
  phone: string;
  division_id: number | null;
  division: string;
  district_id: number | null;
  district: string;
  thana_id: number | null;
  thana: string;
  post_code: string;
  address: string;
  website: string;
  facebook: string;
  format: string;
  photos: string[];
  status: TurfRequestStatus;
  reject_reason: string;
  appeal_message: string;
  venue_id: string | null;
  reviewed_at: string | null;
  appealed_at: string | null;
  created_at: string;
  updated_at: string;
  /** The app user who applied. */
  user: {
    id: string;
    full_name: string;
    player_code: string;
    avatar_url: string;
    phone: string;
  } | null;
}

export interface TurfRequestsParams {
  search?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export interface TurfRequestsResponse {
  total: number;
  stats: Record<TurfRequestStatus | 'total', number>;
  rows: TurfRequest[];
}
