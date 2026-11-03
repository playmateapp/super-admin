'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getAreas } from '../api/areas.api';

export function useAreaList(search: string) {
  return useQuery({
    queryKey: queryKeys.areas.list({ search }),
    queryFn: () => getAreas(search),
    placeholderData: keepPreviousData,
  });
}
