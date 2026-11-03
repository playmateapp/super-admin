'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Eye, Lock, MoreVertical, Pencil, Trash2, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { commonMessages } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

/**
 * ActionMenu — the "⋮" row/panel menu of the design: a floating card titled "Action" with a
 * close button and big buttons (View · Edit · Block toggle). Built on Radix DropdownMenu so it
 * has focus management and keyboard support.
 */
export function ActionMenu({
  label,
  children,
  align = 'end',
  triggerClassName,
}: {
  /** Accessible name of the "⋮" trigger. */
  label: string;
  children: ReactNode;
  align?: 'start' | 'end';
  triggerClassName?: string;
}) {
  const m = useMessages(commonMessages);
  return (
    <DropdownMenuPrimitive.Root modal={false}>
      <DropdownMenuPrimitive.Trigger
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'grid size-8 place-items-center rounded-input text-content-primary outline-none hover:bg-surface-muted focus-visible:ring-4 focus-visible:ring-brand-500/20',
          triggerClassName,
        )}
      >
        <MoreVertical aria-hidden className="size-6" />
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={6}
          onClick={(e) => e.stopPropagation()}
          className="z-50 flex w-[241px] flex-col gap-4 rounded-card bg-surface-card p-5 shadow-float data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-heading-sm text-content-muted">{m.action}</span>
            <DropdownMenuPrimitive.Item
              aria-label={m.close}
              className="grid size-6 cursor-pointer place-items-center rounded-input text-content-primary outline-none data-[highlighted]:bg-surface-muted"
            >
              <X aria-hidden className="size-5" />
            </DropdownMenuPrimitive.Item>
          </div>
          <div className="flex flex-col gap-2">{children}</div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

const itemBase =
  'flex h-[47px] cursor-pointer select-none items-center justify-center gap-2 rounded-[10px] px-4 font-display text-heading-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

/** "View 👁" (outlined green) or "View" filled (`filled`) — both appear in the design. */
export function ActionView({
  label,
  onSelect,
  filled = false,
}: {
  label: string;
  onSelect: () => void;
  filled?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Item
      onSelect={onSelect}
      className={cn(
        itemBase,
        filled
          ? 'bg-brand-500 text-content-on-brand data-[highlighted]:bg-brand-400'
          : 'border border-brand-500 text-content-brand data-[highlighted]:bg-surface-tint dark:border-content-brand',
      )}
    >
      {label}
      <Eye aria-hidden className="size-5" />
    </DropdownMenuPrimitive.Item>
  );
}

/** "✎ Edit" outlined green. */
export function ActionEdit({ label, onSelect }: { label: string; onSelect: () => void }) {
  return (
    <DropdownMenuPrimitive.Item
      onSelect={onSelect}
      className={cn(
        itemBase,
        'border border-brand-500 text-content-brand data-[highlighted]:bg-surface-tint dark:border-content-brand',
      )}
    >
      <Pencil aria-hidden className="size-5" />
      {label}
    </DropdownMenuPrimitive.Item>
  );
}

/**
 * "🔒 Block User ○" — grey row with a lock and a radio-style switch on the end. `checked`
 * shows the filled state (already blocked / inactive).
 */
export function ActionToggle({
  label,
  checked,
  onSelect,
  disabled,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        itemBase,
        'justify-between bg-surface-muted text-content-primary data-[highlighted]:bg-line',
      )}
    >
      <span className="flex items-center gap-2">
        <Lock aria-hidden className="size-5" />
        {label}
      </span>
      <span
        aria-hidden
        className={cn(
          'grid size-5 place-items-center rounded-full border-2',
          checked ? 'border-danger' : 'border-content-muted',
        )}
      >
        {checked ? <span className="size-2.5 rounded-full bg-danger" /> : null}
      </span>
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/** "🗑 Delete" outlined red (destructive — the caller confirms first). */
export function ActionDelete({ label, onSelect }: { label: string; onSelect: () => void }) {
  return (
    <DropdownMenuPrimitive.Item
      onSelect={onSelect}
      className={cn(itemBase, 'border border-danger text-danger data-[highlighted]:bg-danger-soft')}
    >
      <Trash2 aria-hidden className="size-5" />
      {label}
    </DropdownMenuPrimitive.Item>
  );
}
