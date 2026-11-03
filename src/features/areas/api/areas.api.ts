import { rpc } from '@/lib/api/supabase';

import type { AreaInput, AreasResponse } from '../types';

/** Areas request functions (Supabase RPCs, admin-only). */

/** rpc admin_areas — every area with how many venues / players use it. */
export const getAreas = (search: string) => rpc<AreasResponse>('admin_areas', { p_search: search });

/** rpc admin_save_area — create (id = null) or rename / reorder; renames carry to venues + players. */
export const saveArea = (id: number | null, input: AreaInput) =>
  rpc<number>('admin_save_area', { p_id: id, p_name: input.name, p_sort: input.sort });

/** rpc admin_delete_area — fails with `area_in_use:<n>` while venues use it. */
export const deleteArea = (id: number) => rpc<void>('admin_delete_area', { p_id: id });
