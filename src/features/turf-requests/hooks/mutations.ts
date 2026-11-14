'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { approveTurfRequest, deleteTurfRequest, rejectTurfRequest } from '../api/turf-requests.api';

/** Every review changes the request list; approving also adds a venue. */
function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.turfRequests.all() });
    qc.invalidateQueries({ queryKey: queryKeys.venues.all() });
    qc.invalidateQueries({ queryKey: queryKeys.reference.venueNames() });
  };
}

export function useApproveTurfRequest() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: approveTurfRequest, onSuccess: invalidate });
}

export function useRejectTurfRequest() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectTurfRequest(id, reason),
    onSuccess: invalidate,
  });
}

export function useDeleteTurfRequest() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: deleteTurfRequest, onSuccess: invalidate });
}
