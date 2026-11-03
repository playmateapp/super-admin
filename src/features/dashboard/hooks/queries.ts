'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getDashboard } from '../api/dashboard.api';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: getDashboard,
    refetchInterval: 120_000,
  });
}
