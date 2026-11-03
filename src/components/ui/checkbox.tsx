'use client';

import { Check, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Checkbox — 20px box with a 6px radius (table row selection, platter item picker).
 * Controlled; `indeterminate` shows a dash for "some rows selected".
 */
export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  className,
  disabled,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name (the box has no visible label). */
  label: string;
  className?: string;
  disabled?: boolean;
}) {
  const on = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'grid size-5 shrink-0 place-items-center rounded-input border text-content-on-brand transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/25 disabled:opacity-60',
        on ? 'border-content-link bg-content-link' : 'border-line-strong bg-surface-card',
        className,
      )}
    >
      {indeterminate ? (
        <Minus className="size-3.5" strokeWidth={3} />
      ) : checked ? (
        <Check className="size-3.5" strokeWidth={3} />
      ) : null}
    </button>
  );
}
