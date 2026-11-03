'use client';

import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/api/supabase';
import { queryKeys } from '@/lib/config/query-keys';

/**
 * Area names from `public.areas` (the same list the mobile app shows) for the "All Area" /
 * location filters. Reference data, not a feature: it changes only via migrations.
 */
export function useAreas() {
  return useQuery({
    queryKey: queryKeys.reference.areas(),
    queryFn: async () => {
      const { data, error } = await supabase.from('areas').select('name').order('sort');
      if (error) throw error;
      return (data ?? []).map((a: { name: string }) => a.name);
    },
    staleTime: 60 * 60_000,
  });
}
