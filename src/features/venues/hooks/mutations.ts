'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { saveVenue, setVenueStatus, uploadVenuePhoto } from '../api/venues.api';
import type { Venue, VenueInput } from '../types';

export function useSaveVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string | null; input: VenueInput }) => saveVenue(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.venues.all() }),
  });
}

export function useSetVenueStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Venue['status'] }) =>
      setVenueStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.venues.all() }),
  });
}

export const useUploadVenuePhoto = () => useMutation({ mutationFn: uploadVenuePhoto });
