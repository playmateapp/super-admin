'use client';

import * as Dialog from '@radix-ui/react-dialog';
import type { FormEvent, ReactNode } from 'react';

import { Button } from './button';

/**
 * FormDialog — small modal holding a few fields (amount + note, a reason …) with a submit
 * button. Controlled: the screen keeps `open` and the field values; `onSubmit` runs on the
 * button or Enter. Use ConfirmDialog for a plain yes / no.
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  cancelLabel,
  onSubmit,
  isPending = false,
  tone = 'primary',
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  submitLabel: string;
  cancelLabel: string;
  onSubmit: () => void;
  isPending?: boolean;
  tone?: 'primary' | 'danger';
  children: ReactNode;
}) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isPending) onSubmit();
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-card border border-line bg-surface-card p-6 shadow-float data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <form onSubmit={submit}>
            <Dialog.Title className="font-sans text-heading-md font-semibold text-content-primary">
              {title}
            </Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-2 text-body-xs text-content-secondary">
                {description}
              </Dialog.Description>
            ) : null}
            <div className="mt-5 space-y-4">{children}</div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="muted" size="sm" onClick={() => onOpenChange(false)}>
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                variant={tone === 'danger' ? 'danger' : 'primary'}
                size="sm"
                disabled={isPending}
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
