'use client';

import { Ban } from 'lucide-react';
import { toast } from 'sonner';

import { AlertModal } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useCancelMatch } from '../hooks/mutations';
import { matchesMessages } from '../i18n/matches.messages';

export interface CancelTarget {
  id: string;
  home: string;
  away: string;
}

/** Confirms the admin "Cancel Match" override. */
export function CancelMatchDialog({
  target,
  onClose,
}: {
  target: CancelTarget | null;
  onClose: () => void;
}) {
  const m = useMessages(matchesMessages).actions;
  const c = useMessages(commonMessages);
  const cancel = useCancelMatch();
  return (
    <AlertModal
      open={!!target}
      onOpenChange={(open) => !open && onClose()}
      icon={<Ban />}
      title={m.confirmTitle}
      message={interpolate(m.confirmMessage, {
        home: target?.home ?? '',
        away: target?.away ?? '',
      })}
      cancelLabel={m.keep}
      confirmLabel={m.confirm}
      isPending={cancel.isPending}
      onConfirm={() =>
        target &&
        cancel.mutate(target.id, {
          onSuccess: () => toast.success(m.cancelled),
          onError: (err) => toast.error(getErrorMessage(err, c.actionFailed)),
          onSettled: onClose,
        })
      }
    />
  );
}
