'use client';

import { useCallback, useMemo, useState } from 'react';

/**
 * Checkbox selection for a table page. Holds ids only (client state); pass the ids currently
 * on screen so "select all" and the header checkbox reflect what the user can see.
 */
export function useRowSelection(visibleIds: string[]) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectedVisible = useMemo(
    () => visibleIds.filter((id) => selected.has(id)),
    [visibleIds, selected],
  );
  const allSelected = visibleIds.length > 0 && selectedVisible.length === visibleIds.length;

  const toggleAll = useCallback(() => {
    setSelected(allSelected ? new Set() : new Set(visibleIds));
  }, [allSelected, visibleIds]);

  const clear = useCallback(() => setSelected(new Set()), []);

  return {
    selectedIds: selectedVisible,
    isSelected: (id: string) => selected.has(id),
    allSelected,
    someSelected: selectedVisible.length > 0 && !allSelected,
    toggle,
    toggleAll,
    clear,
  };
}
