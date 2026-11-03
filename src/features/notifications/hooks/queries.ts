'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getActivity } from '../api/notifications.api';

/** The feed; refreshed every minute so the bell stays current. */
export function useActivity() {
  return useQuery({
    queryKey: queryKeys.activity.feed(),
    queryFn: () => getActivity(),
    refetchInterval: 60_000,
  });
}
