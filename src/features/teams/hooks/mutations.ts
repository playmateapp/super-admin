'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { setTeamBlocked } from '../api/teams.api';

/** Block / unblock a team. Refreshes teams, subscriptions and the dashboard. */
export function useSetTeamBlocked() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) => setTeamBlocked(id, blocked),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.teams.all() });
      qc.invalidateQueries({ queryKey: queryKeys.subscriptions.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
      // Unblocking also answers an open unblock request.
      qc.invalidateQueries({ queryKey: queryKeys.appeals.all() });
    },
  });
}
