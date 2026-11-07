'use client';

import { Lock } from 'lucide-react';
import { toast } from 'sonner';

import { AlertModal } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useSetUserBlocked } from '../hooks/mutations';
import { usersMessages } from '../i18n/users.messages';

export interface BlockTarget {
  id: string;
  name: string;
  blocked: boolean;
}

/**
 * Runs the Block User toggle. Blocking asks first (the player can then only view the app);
 * unblocking happens straight away. Both end with a toast.
 */
export function useBlockUser() {
  const m = useMessages(usersMessages).actions;
  const c = useMessages(commonMessages);
  const mutation = useSetUserBlocked();
  const run = (target: BlockTarget, onDone?: () => void) =>
    mutation.mutate(
      { id: target.id, blocked: !target.blocked },
      {
        onSuccess: () =>
          toast.success(
            interpolate(target.blocked ? m.unblocked : m.blocked, { name: target.name }),
          ),
        onError: (err) => toast.error(getErrorMessage(err, c.actionFailed)),
        onSettled: onDone,
      },
    );
  return { run, isPending: mutation.isPending };
}

export function BlockUserDialog({
  target,
  onClose,
}: {
  target: BlockTarget | null;
  onClose: () => void;
}) {
  const m = useMessages(usersMessages).actions;
  const { run, isPending } = useBlockUser();
  return (
    <AlertModal
      open={!!target}
      onOpenChange={(open) => !open && onClose()}
      icon={<Lock />}
      title={m.confirmTitle}
      message={interpolate(m.confirmMessage, { name: target?.name ?? '' })}
      cancelLabel={m.cancel}
      confirmLabel={m.confirm}
      isPending={isPending}
      onConfirm={() => target && run(target, onClose)}
    />
  );
}
