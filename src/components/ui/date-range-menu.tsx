'use client';

import * as Popover from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';

import { cn, formatDate } from '@/lib/utils';

import { Button } from './button';
import { fieldBox } from './input';

export interface DateRange {
  from: string;
  to: string;
}

/**
 * DateRangeMenu — "24/02/26 to 10/08/.." toolbar control. Opens two date inputs; values are
 * `yyyy-MM-dd` strings (empty = open-ended).
 */
export function DateRangeMenu({
  value,
  onChange,
  placeholder,
  labels,
  className,
}: {
  value: DateRange;
  onChange: (value: DateRange) => void;
  placeholder: string;
  labels: { from: string; to: string; clear: string; joiner: string };
  className?: string;
}) {
  const summary =
    value.from || value.to
      ? `${value.from ? formatDate(value.from) : '…'} ${labels.joiner} ${value.to ? formatDate(value.to) : '…'}`
      : placeholder;

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={placeholder}
        className={cn(
          'flex h-[43px] min-w-0 items-center justify-between gap-2 rounded-input border border-surface-card bg-surface-muted px-2.5 text-body-xs text-content-primary shadow-field outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 sm:w-[176px]',
          className,
        )}
      >
        <span className="truncate">{summary}</span>
        <ChevronDown aria-hidden className="size-5 shrink-0 text-content-secondary" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 flex w-[240px] flex-col gap-3 rounded-input border border-line bg-surface-card p-3 shadow-float"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <label className="flex flex-col gap-1 text-caption text-content-secondary">
            {labels.from}
            <input
              type="date"
              value={value.from}
              max={value.to || undefined}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
              className={cn(fieldBox, 'h-10')}
            />
          </label>
          <label className="flex flex-col gap-1 text-caption text-content-secondary">
            {labels.to}
            <input
              type="date"
              value={value.to}
              min={value.from || undefined}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
              className={cn(fieldBox, 'h-10')}
            />
          </label>
          <Button variant="muted" size="sm" onClick={() => onChange({ from: '', to: '' })}>
            {labels.clear}
          </Button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
