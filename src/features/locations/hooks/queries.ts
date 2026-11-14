'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getLocations } from '../api/locations.api';
import type { LocationLevel } from '../types';

export function useLocationList(level: LocationLevel, parent: number | null, search = '') {
  return useQuery({
    queryKey: queryKeys.locations.list({ level, parent, search }),
    queryFn: () => getLocations(level, parent, search),
    placeholderData: keepPreviousData,
  });
}

/** Parent picker options (all divisions, or the districts of one division). */
export function useLocationOptions(level: 'division' | 'district', parent: number | null) {
  return useQuery({
    queryKey: queryKeys.locations.list({ level, parent, search: '', options: true }),
    queryFn: () => getLocations(level, parent, ''),
    enabled: level === 'division' || parent != null,
    select: (data) => data.rows.map((r) => ({ value: String(r.id), label: r.name })),
  });
}
