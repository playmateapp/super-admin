'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getProfile } from '../api/auth.api';
import { useIsAuthenticated } from '../store/auth.store';

/** rpc admin_me — the signed-in admin (only fetched once a session exists). */
export function useProfile() {
  const isAuthenticated = useIsAuthenticated();
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: getProfile,
    enabled: isAuthenticated,
  });
}
