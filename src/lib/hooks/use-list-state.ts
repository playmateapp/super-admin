'use client';

import { useCallback, useState } from 'react';

import { useDebouncedValue } from './use-debounced-value';

/**
 * List screen state: search box (debounced 300 ms), named filters, page and the selected row.
 * Changing the search or a filter goes back to page 1. Server data stays in TanStack Query;
 * this only holds what the admin typed / clicked.
 */
export function useListState<F extends Record<string, string>>(initialFilters: F) {
  const [search, setSearchRaw] = useState('');
  const [filters, setFilters] = useState<F>(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  const setSearch = useCallback((value: string) => {
    setSearchRaw(value);
    setPage(1);
  }, []);

  const setFilter = useCallback(<K extends keyof F>(key: K, value: F[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const isFiltered = !!debouncedSearch.trim() || Object.values(filters).some(Boolean);

  return {
    search,
    setSearch,
    debouncedSearch,
    filters,
    setFilter,
    page,
    setPage,
    selectedId,
    setSelectedId,
    isFiltered,
  };
}
