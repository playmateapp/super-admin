'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { setUserBlocked } from '../api/users.api';

/** Block / unblock a player. Refreshes users, the dashboard and the activity feed. */
export function useSetUserBlocked() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => setUserBlocked(id, blocked),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
      // Unblocking also answers an open unblock request.
      qc.invalidateQueries({ queryKey: queryKeys.appeals.all() });
    },
  });
}
