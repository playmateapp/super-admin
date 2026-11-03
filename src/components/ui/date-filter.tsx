'use client';

import { cn } from '@/lib/utils';

/** Packed toolbar date filter ("Select Date") — a native date (or month) input, empty = no filter. */
export function DateFilter({
  value,
  onChange,
  label,
  type = 'date',
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  type?: 'date' | 'month';
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      title={label}
      className={cn(
        'h-10 rounded-input border border-line bg-surface-card px-3 text-body-xs text-content-muted outline-none transition-[border-color,box-shadow] focus:border-line-brand focus:ring-[3px] focus:ring-brand-500/15',
        className,
      )}
    />
  );
}
