'use client';

import { toast } from 'sonner';

import { commonMessages } from '@/lib/i18n';
import { getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { ConfirmDialog } from './confirm-dialog';

/**
 * DeleteDialog — the whole "delete this row" flow: confirm, run the mutation, toast the
 * result. The screen keeps the pending row in state and passes it as `target`.
 */
export function DeleteDialog({
  target,
  onClose,
  mutation,
}: {
  target: { id: string; name: string } | null;
  onClose: () => void;
  mutation: {
    mutate: (
      id: string,
      options: { onSuccess: () => void; onError: (error: unknown) => void },
    ) => void;
    isPending: boolean;
  };
}) {
  const m = useMessages(commonMessages);
  return (
    <ConfirmDialog
      open={!!target}
      onOpenChange={(open) => !open && onClose()}
      title={interpolate(m.deleteTitle, { name: target?.name ?? '' })}
      description={m.deleteHint}
      confirmLabel={m.delete}
      cancelLabel={m.cancel}
      isPending={mutation.isPending}
      onConfirm={() => {
        if (!target) return;
        mutation.mutate(target.id, {
          onSuccess: () => {
            toast.success(m.deleted);
            onClose();
          },
          onError: (error) => toast.error(getErrorMessage(error, m.deleteFailed)),
        });
      }}
    />
  );
}
