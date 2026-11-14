/**
 * Location tree the app's profile + search filters use: Division → District → Thana / Upazila
 * (`public.divisions / districts / thanas`), as `admin_locations(level, parent, search)` returns
 * one level. Post codes are typed by players, so they are not managed here.
 */
export type LocationLevel = 'division' | 'district' | 'thana';

export interface LocationRow {
  id: number;
  name: string;
  sort: number;
  /** Division of a district, district of a thana; `null` for divisions. */
  parent_id: number | null;
  /** Name of `parent_id` ('' for divisions). */
  parent_name: string;
  /** Division the row sits under ('' for divisions). */
  division_name: string;
  /** Districts in a division / thanas in a district; 0 for thanas. */
  children: number;
  /** Players whose profile uses this location. */
  players: number;
}

export interface LocationsResponse {
  total: number;
  rows: LocationRow[];
}

export interface LocationInput {
  name: string;
  /** Required for districts (division id) and thanas (district id). */
  parent: number | null;
  /** `null` = put it at the end of its list. */
  sort: number | null;
}

/** One CSV row of the bulk upload; district / thana may be empty. */
export interface LocationImportRow {
  division: string;
  district: string;
  thana: string;
}

/** What `admin_import_locations` added. */
export interface LocationImportResult {
  divisions: number;
  districts: number;
  thanas: number;
  skipped: number;
}
