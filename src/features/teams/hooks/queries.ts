'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getTeam, getTeams } from '../api/teams.api';
import type { TeamsParams } from '../types';

export function useTeams(params: TeamsParams) {
  return useQuery({
    queryKey: queryKeys.teams.list(params),
    queryFn: () => getTeams(params),
    placeholderData: keepPreviousData,
  });
}

export function useTeam(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.teams.detail(id ?? ''),
    queryFn: () => getTeam(id as string),
    enabled: !!id,
  });
}
