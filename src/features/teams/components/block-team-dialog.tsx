'use client';

import { Lock } from 'lucide-react';
import { toast } from 'sonner';

import { AlertModal } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useSetTeamBlocked } from '../hooks/mutations';
import { teamsMessages } from '../i18n/teams.messages';

export interface BlockTarget {
  id: string;
  name: string;
  blocked: boolean;
}

/** Runs Block Team / unblock with a toast. Blocking is confirmed first (it hides the team). */
export function useBlockTeam() {
  const m = useMessages(teamsMessages).actions;
  const c = useMessages(commonMessages);
  const mutation = useSetTeamBlocked();
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

export function BlockTeamDialog({
  target,
  onClose,
}: {
  target: BlockTarget | null;
  onClose: () => void;
}) {
  const m = useMessages(teamsMessages).actions;
  const { run, isPending } = useBlockTeam();
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
