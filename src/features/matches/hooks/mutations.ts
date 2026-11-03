'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { cancelMatch } from '../api/matches.api';

export function useCancelMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelMatch(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.matches.all() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}
