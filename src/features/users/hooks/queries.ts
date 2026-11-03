'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getUser, getUsers } from '../api/users.api';
import type { UsersParams } from '../types';

export function useUsers(params: UsersParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useUser(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: () => getUser(id as string),
    enabled: !!id,
  });
}
