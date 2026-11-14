'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getActivity } from '../api/notifications.api';
import type { ActivityFilters } from '../types';

/** The feed; refreshed every minute so the bell stays current. */
export function useActivity(filters: ActivityFilters = {}) {
  return useQuery({
    queryKey: queryKeys.activity.feed(filters),
    queryFn: () => getActivity(filters),
    refetchInterval: 60_000,
    placeholderData: keepPreviousData,
  });
}
