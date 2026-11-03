'use client';

import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Compact toolbar search box (40px, icon at the end). Controlled. */
export function SearchInput({
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
    <div className={cn('relative w-full sm:w-[160px]', className)}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-input border border-line bg-surface-card pe-10 ps-3.5 text-body-xs text-content-primary outline-none transition-[border-color,box-shadow] placeholder:text-content-muted focus:border-line-brand focus:ring-[3px] focus:ring-brand-500/15 [&::-webkit-search-cancel-button]:hidden"
      />
      <Search
        aria-hidden
        className="pointer-events-none absolute end-2.5 top-1/2 size-5 -translate-y-1/2 text-content-muted"
      />
    </div>
  );
}
