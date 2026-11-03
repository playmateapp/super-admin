'use client';

import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Toolbar search field ("Search Players by name and Id"). Controlled; screens debounce. */
export function SearchBox({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        'flex h-[43px] min-w-0 flex-auto items-center gap-2 rounded-[8px] border border-line bg-surface-muted px-2.5 shadow-field focus-within:ring-4 focus-within:ring-brand-500/20',
        className,
      )}
    >
      <Search aria-hidden className="size-5 shrink-0 text-content-primary" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-full min-w-0 flex-1 bg-transparent text-body-xs text-content-primary outline-none placeholder:text-content-muted"
      />
    </label>
  );
}
