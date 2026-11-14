'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { deleteLocation, importLocations, saveLocation } from '../api/locations.api';
import type { LocationImportRow, LocationInput, LocationLevel } from '../types';

function useInvalidateLocations() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.locations.all() });
}

export function useSaveLocation() {
  const invalidate = useInvalidateLocations();
  return useMutation({
    mutationFn: ({
      level,
      id,
      input,
    }: {
      level: LocationLevel;
      id: number | null;
      input: LocationInput;
    }) => saveLocation(level, id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteLocation() {
  const invalidate = useInvalidateLocations();
  return useMutation({
    mutationFn: ({ level, id }: { level: LocationLevel; id: number }) => deleteLocation(level, id),
    onSuccess: invalidate,
  });
}

export function useImportLocations() {
  const invalidate = useInvalidateLocations();
  return useMutation({
    mutationFn: (rows: LocationImportRow[]) => importLocations(rows),
    onSuccess: invalidate,
  });
}
