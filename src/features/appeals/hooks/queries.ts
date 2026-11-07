'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getAppeals } from '../api/appeals.api';
import type { AppealsParams } from '../types';

export function useAppealList(params: AppealsParams) {
  return useQuery({
    queryKey: queryKeys.appeals.list(params),
    queryFn: () => getAppeals(params),
    placeholderData: keepPreviousData,
  });
}
