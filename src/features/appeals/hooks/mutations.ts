'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { reviewAppeal } from '../api/appeals.api';
import type { AppealKind } from '../types';

/** Approve / reject a request. Approving also unblocks, so users / teams and the dashboard refresh. */
export function useReviewAppeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      kind,
      id,
      approve,
      reason,
    }: {
      kind: AppealKind;
      id: string;
      approve: boolean;
      reason?: string;
    }) => reviewAppeal(kind, id, approve, reason),
    onSuccess: (_, { kind }) => {
      qc.invalidateQueries({ queryKey: queryKeys.appeals.all() });
      qc.invalidateQueries({
        queryKey: kind === 'team' ? queryKeys.teams.all() : queryKeys.users.all(),
      });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}
