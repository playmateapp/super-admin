'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { reviewAppeal } from '../api/appeals.api';

/** Approve / reject a request. Approving also unblocks, so users and the dashboard refresh. */
export function useReviewAppeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approve, reason }: { id: string; approve: boolean; reason?: string }) =>
      reviewAppeal(id, approve, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.appeals.all() });
      qc.invalidateQueries({ queryKey: queryKeys.users.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}
