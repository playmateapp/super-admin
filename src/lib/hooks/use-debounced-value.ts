'use client';

import { useEffect, useState } from 'react';

/** `value`, but only after it stopped changing for `ms` (search boxes, price checks). */
export function useDebouncedValue<T>(value: T, ms = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return debounced;
}
