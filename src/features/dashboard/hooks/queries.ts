'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getDashboard } from '../api/dashboard.api';
import type { DashboardRange } from '../types';

export function useDashboard(months: DashboardRange) {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(months),
    queryFn: () => getDashboard(months),
    placeholderData: keepPreviousData,
    refetchInterval: 120_000,
  });
}
