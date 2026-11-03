'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { CircleCheck, Frown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { authMessages, type AuthAlertKey } from '../i18n/auth.messages';

/**
 * The error / info popup of the auth screens (Figma "Incorrect Login Credentials" etc.):
 * a white card over the dimmed form with an emoji, a red title and the message. Closes on
 * click-outside / Esc. `key = null` hides it.
 */
export function AuthAlert({ alert, onClose }: { alert: AuthAlertKey | null; onClose: () => void }) {
  const m = useMessages(authMessages).alerts;
  const content = alert ? m[alert] : null;
  const positive = alert === 'codeResent';

  return (
    <Dialog.Root open={!!alert} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/25 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-[calc(100vw-32px)] max-w-[338px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 rounded-[12px] bg-surface-card px-6 py-6 text-center shadow-float data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <span
            aria-hidden
            className={cn(
              'grid size-10 place-items-center rounded-full',
              positive ? 'bg-success-soft text-success' : 'bg-gold text-navy',
            )}
          >
            {positive ? <CircleCheck className="size-6" /> : <Frown className="size-6" />}
          </span>
          <Dialog.Title
            className={cn(
              'font-display text-heading-md font-semibold',
              positive ? 'text-content-brand' : 'text-danger',
            )}
          >
            {content?.title}
          </Dialog.Title>
          <Dialog.Description className="text-body-xs text-content-secondary">
            {content?.message}
          </Dialog.Description>
          <Dialog.Close className="sr-only">{m.close}</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
