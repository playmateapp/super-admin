'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { markActivitySeen } from '../api/notifications.api';

export function useMarkActivitySeen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markActivitySeen,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.activity.all() }),
  });
}
