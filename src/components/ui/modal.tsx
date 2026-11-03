'use client';

import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Modal — centred dialog on a dim overlay (Add / Edit Venue). Controlled. The caller renders
 * the header; `title` is always given for screen readers.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/40 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[470px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card bg-surface-card p-5 shadow-float data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            className,
          )}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {description ? (
            <Dialog.Description className="sr-only">{description}</Dialog.Description>
          ) : null}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * AlertModal — the "Log Out?" card: round icon, red title, message and a two-button footer
 * split by a hairline (Cancel · Yes).
 */
export function AlertModal({
  open,
  onOpenChange,
  icon,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onConfirm,
  isPending = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: ReactNode;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/40 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-[335px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-surface-card p-3 text-center shadow-float data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex flex-col items-center gap-2 px-4 pb-3 pt-2">
            <span
              aria-hidden
              className="grid size-[44px] place-items-center rounded-full bg-danger text-content-on-brand [&_svg]:size-6"
            >
              {icon}
            </span>
            <Dialog.Title className="font-display text-heading-sm font-semibold text-danger">
              {title}
            </Dialog.Title>
            <Dialog.Description className="text-body-xs text-content-muted">
              {message}
            </Dialog.Description>
          </div>
          <div className="flex border-t border-line bg-surface-sunken">
            <Dialog.Close className="h-11 flex-1 text-body-xs text-content-muted hover:text-content-primary">
              {cancelLabel}
            </Dialog.Close>
            <span aria-hidden className="w-px bg-line" />
            <button
              type="button"
              disabled={isPending}
              onClick={onConfirm}
              className="h-11 flex-1 text-body-xs text-danger disabled:opacity-60"
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
