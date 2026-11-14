'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { markAllActivity, setActivityRead } from '../api/notifications.api';

/** Toggle one item's read state; every feed query (page + bell) refetches. */
export function useSetActivityRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: setActivityRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.activity.all() }),
  });
}

/** Mark all items read (`true`) or unread (`false`). */
export function useMarkAllActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllActivity,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.activity.all() }),
  });
}
