'use client';

import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

import { Button } from './button';

/**
 * ConfirmDialog — small modal asking to confirm a destructive action (row delete).
 * Controlled: the screen keeps which row is pending and passes `open`.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  isPending = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-card border border-line bg-surface-card p-6 shadow-float data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <Dialog.Title className="font-sans text-heading-md font-semibold text-content-primary">
            {title}
          </Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-2 text-body-xs text-content-secondary">
              {description}
            </Dialog.Description>
          ) : null}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="muted" size="sm" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button variant="danger" size="sm" onClick={onConfirm} disabled={isPending}>
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
