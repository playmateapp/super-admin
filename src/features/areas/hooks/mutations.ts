'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { deleteArea, saveArea } from '../api/areas.api';
import type { AreaInput } from '../types';

/**
 * Area changes also refresh the shared area list (venue form, filters) and venues
 * (a rename rewrites their area).
 */
function useInvalidateAreas() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.areas.all() });
    qc.invalidateQueries({ queryKey: queryKeys.reference.areas() });
    qc.invalidateQueries({ queryKey: queryKeys.venues.all() });
  };
}

export function useSaveArea() {
  const invalidate = useInvalidateAreas();
  return useMutation({
    mutationFn: ({ id, input }: { id: number | null; input: AreaInput }) => saveArea(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteArea() {
  const invalidate = useInvalidateAreas();
  return useMutation({ mutationFn: (id: number) => deleteArea(id), onSuccess: invalidate });
}
