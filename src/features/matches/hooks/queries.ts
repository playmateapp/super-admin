'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getMatch, getMatches } from '../api/matches.api';
import type { MatchesParams } from '../types';

export function useMatches(params: MatchesParams) {
  return useQuery({
    queryKey: queryKeys.matches.list(params),
    queryFn: () => getMatches(params),
    placeholderData: keepPreviousData,
  });
}

/** Live matches change every minute (score, status), so the detail refreshes itself. */
export function useMatch(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.matches.detail(id ?? ''),
    queryFn: () => getMatch(id as string),
    enabled: !!id,
    refetchInterval: 60_000,
  });
}
