'use client';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/api/supabase';
import { queryKeys } from '@/lib/config/query-keys';

/**
 * The Division → District → Thana / Upazila tree (`public.divisions / districts / thanas`, the
 * same lists the mobile app shows) for location selects and filters. Reference data: managed on
 * the Locations screen, so a short stale time is enough.
 */
export interface LocationOption {
  id: number;
  name: string;
}

async function load(
  table: 'divisions' | 'districts' | 'thanas',
  parent?: { column: string; id: number },
) {
  let q = supabase.from(table).select('id, name').order('sort').order('name');
  if (parent) q = q.eq(parent.column, parent.id);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as LocationOption[];
}

export function useDivisions() {
  return useQuery({
    queryKey: queryKeys.reference.divisions(),
    queryFn: () => load('divisions'),
    staleTime: 5 * 60_000,
  });
}

export function useDistricts(divisionId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.reference.districts(divisionId ?? 0),
    queryFn: () => load('districts', { column: 'division_id', id: divisionId as number }),
    enabled: !!divisionId,
    staleTime: 5 * 60_000,
  });
}

export function useThanas(districtId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.reference.thanas(districtId ?? 0),
    queryFn: () => load('thanas', { column: 'district_id', id: districtId as number }),
    enabled: !!districtId,
    staleTime: 5 * 60_000,
  });
}
