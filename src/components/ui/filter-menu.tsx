'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface FilterMenuOption {
  value: string;
  label: string;
}

/**
 * FilterMenu — the toolbar dropdown of the design ("All User ⌄", "Status ⌄", "All Area ⌄"):
 * grey 43px box with a soft shadow; the open list shows the options. `value = ''` means
 * "no filter" and shows `placeholder`.
 */
export function FilterMenu({
  value,
  onChange,
  options,
  placeholder,
  allLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: FilterMenuOption[];
  /** Shown when nothing is selected (also the accessible name). */
  placeholder: string;
  /** Label of the "clear" entry at the top of the list. */
  allLabel: string;
  className?: string;
}) {
  const current = options.find((o) => o.value === value);
  const items: FilterMenuOption[] = [{ value: '', label: allLabel }, ...options];

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger
        aria-label={placeholder}
        className={cn(
          'flex h-[43px] min-w-0 items-center justify-between gap-2 rounded-input border border-surface-card bg-surface-muted px-2.5 text-body-xs text-content-primary shadow-field outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20 sm:w-[148px]',
          className,
        )}
      >
        <span className="truncate">{current?.label ?? placeholder}</span>
        <ChevronDown aria-hidden className="size-5 shrink-0 text-content-secondary" />
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="start"
          sideOffset={4}
          className="z-50 max-h-[300px] min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-input border border-line bg-surface-card py-1 shadow-float data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <DropdownMenuPrimitive.RadioGroup value={value} onValueChange={onChange}>
            {items.map((o) => (
              <DropdownMenuPrimitive.RadioItem
                key={o.value || '__all'}
                value={o.value}
                className="flex cursor-pointer select-none items-center justify-between gap-3 border-b border-line px-2.5 py-2.5 text-body-xs text-content-muted outline-none last:border-b-0 data-[highlighted]:bg-surface-muted data-[state=checked]:text-content-primary"
              >
                {o.label}
                <DropdownMenuPrimitive.ItemIndicator>
                  <Check aria-hidden className="size-4 text-content-brand" />
                </DropdownMenuPrimitive.ItemIndicator>
              </DropdownMenuPrimitive.RadioItem>
            ))}
          </DropdownMenuPrimitive.RadioGroup>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
