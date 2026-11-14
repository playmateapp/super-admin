import { rpc } from '@/lib/api/supabase';

import type {
  LocationImportResult,
  LocationImportRow,
  LocationInput,
  LocationLevel,
  LocationsResponse,
} from '../types';

/** Locations request functions (Supabase RPCs, admin-only). */

/** rpc admin_locations — one level, optionally under one parent, with usage counts. */
export const getLocations = (level: LocationLevel, parent: number | null, search: string) =>
  rpc<LocationsResponse>('admin_locations', {
    p_level: level,
    p_parent: parent,
    p_search: search,
  });

/** rpc admin_save_location — create (id = null) or rename / move / reorder. */
export const saveLocation = (level: LocationLevel, id: number | null, input: LocationInput) =>
  rpc<number>('admin_save_location', {
    p_level: level,
    p_id: id,
    p_parent: input.parent,
    p_name: input.name,
    p_sort: input.sort,
  });

/** rpc admin_delete_location — also removes what is under it; fails `location_in_use:<n>`. */
export const deleteLocation = (level: LocationLevel, id: number) =>
  rpc<void>('admin_delete_location', { p_level: level, p_id: id });

/** The RPC takes at most this many rows per call. */
export const IMPORT_BATCH = 5000;

/** rpc admin_import_locations — adds missing rows (case-insensitive match), in batches. */
export async function importLocations(rows: LocationImportRow[]): Promise<LocationImportResult> {
  const total: LocationImportResult = { divisions: 0, districts: 0, thanas: 0, skipped: 0 };
  for (let i = 0; i < rows.length; i += IMPORT_BATCH) {
    const part = await rpc<LocationImportResult>('admin_import_locations', {
      p_rows: rows.slice(i, i + IMPORT_BATCH),
    });
    total.divisions += part.divisions;
    total.districts += part.districts;
    total.thanas += part.thanas;
    total.skipped += part.skipped;
  }
  return total;
}
