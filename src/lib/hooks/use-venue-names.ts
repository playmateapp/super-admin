'use client';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/api/supabase';
import { queryKeys } from '@/lib/config/query-keys';

/**
 * Names of the published turfs / venues (`public.venue_cards`, what the app's challenge venue
 * picker offers) for the Matches "Venue" filter.
 */
export function useVenueNames() {
  return useQuery({
    queryKey: queryKeys.reference.venueNames(),
    queryFn: async () => {
      const { data, error } = await supabase.from('venue_cards').select('name').order('name');
      if (error) throw error;
      return [...new Set((data ?? []).map((v: { name: string }) => v.name))];
    },
    staleTime: 5 * 60_000,
  });
}
