'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getVenue, getVenues } from '../api/venues.api';
import type { VenuesParams } from '../types';

export function useVenues(params: VenuesParams) {
  return useQuery({
    queryKey: queryKeys.venues.list(params),
    queryFn: () => getVenues(params),
    placeholderData: keepPreviousData,
  });
}

export function useVenue(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.venues.detail(id ?? ''),
    queryFn: () => getVenue(id as string),
    enabled: !!id,
  });
}
