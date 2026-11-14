'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getTeam, getTeamContact, getTeams } from '../api/teams.api';
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

/** Owner / captain name + phone. Shares the users-detail cache, so opening the user is instant. */
export function useTeamContact(userId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId ?? ''),
    queryFn: () => getTeamContact(userId as string),
    enabled: !!userId,
    staleTime: 60_000,
  });
}
