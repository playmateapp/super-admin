/**
 * Areas (`public.areas`) as `admin_areas(search)` returns them. The app's profile area picker,
 * the challenge venue fallback and the venue form all read this list.
 */
export interface Area {
  id: number;
  name: string;
  sort: number;
  /** Venues whose area is this name. */
  venues: number;
  /** Players whose profile area is this name. */
  players: number;
}

export interface AreasResponse {
  total: number;
  rows: Area[];
}

export interface AreaInput {
  name: string;
  /** `null` = put it at the end of the list. */
  sort: number | null;
}
