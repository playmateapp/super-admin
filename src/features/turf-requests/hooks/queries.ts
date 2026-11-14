'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getTurfRequest, getTurfRequests } from '../api/turf-requests.api';
import type { TurfRequestsParams } from '../types';

export function useTurfRequests(params: TurfRequestsParams) {
  return useQuery({
    queryKey: queryKeys.turfRequests.list(params),
    queryFn: () => getTurfRequests(params),
    placeholderData: keepPreviousData,
  });
}

/**
 * One request. `version` (the list row's `updated_at`) is part of the key, so a change made in
 * the app (an owner's appeal) that the list already shows also refreshes the detail panel.
 */
export function useTurfRequest(id: string | null | undefined, version = '') {
  return useQuery({
    queryKey: [...queryKeys.turfRequests.detail(id ?? ''), version],
    queryFn: () => getTurfRequest(id as string),
    enabled: !!id,
  });
}
