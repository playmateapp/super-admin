'use client';

import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AlertModal, FormDialog, Textarea } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useReviewAppeal } from '../hooks/mutations';
import { appealsMessages } from '../i18n/appeals.messages';
import type { Appeal } from '../types';

export function ApproveAppealDialog({
  appeal,
  onClose,
}: {
  appeal: Appeal | null;
  onClose: () => void;
}) {
  const m = useMessages(appealsMessages).actions;
  const c = useMessages(commonMessages);
  const review = useReviewAppeal();
  const confirm = () => {
    if (!appeal) return;
    review.mutate(
      { kind: appeal.kind, id: appeal.id, approve: true },
      {
        onSuccess: () => toast.success(interpolate(m.approved, { name: appeal.name })),
        onError: (err) => toast.error(getErrorMessage(err, c.actionFailed)),
        onSettled: onClose,
      },
    );
  };
  return (
    <AlertModal
      open={!!appeal}
      onOpenChange={(open) => !open && onClose()}
      icon={<ShieldCheck />}
      title={appeal?.kind === 'team' ? m.approveTeamTitle : m.approveTitle}
      message={interpolate(appeal?.kind === 'team' ? m.approveTeamMessage : m.approveMessage, {
        name: appeal?.name ?? '',
      })}
      cancelLabel={m.cancel}
      confirmLabel={m.approve}
      isPending={review.isPending}
      onConfirm={confirm}
    />
  );
}

/** Rejecting needs a reason: it is what the player / team owner reads in the app. */
export function RejectAppealDialog({
  appeal,
  onClose,
}: {
  appeal: Appeal | null;
  onClose: () => void;
}) {
  const m = useMessages(appealsMessages).actions;
  const c = useMessages(commonMessages);
  const review = useReviewAppeal();
  const [reason, setReason] = useState('');
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (appeal) {
      setReason('');
      setMissing(false);
    }
  }, [appeal]);

  const submit = () => {
    if (!appeal) return;
    if (!reason.trim()) {
      setMissing(true);
      return;
    }
    review.mutate(
      { kind: appeal.kind, id: appeal.id, approve: false, reason: reason.trim() },
      {
        onSuccess: () => {
          toast.success(interpolate(m.rejected, { name: appeal.name }));
          onClose();
        },
        onError: (err) => toast.error(getErrorMessage(err, c.actionFailed)),
      },
    );
  };

  return (
    <FormDialog
      open={!!appeal}
      onOpenChange={(open) => !open && onClose()}
      title={m.rejectTitle}
      description={interpolate(appeal?.kind === 'team' ? m.rejectTeamMessage : m.rejectMessage, {
        name: appeal?.name ?? '',
      })}
      submitLabel={m.reject}
      cancelLabel={m.cancel}
      tone="danger"
      isPending={review.isPending}
      onSubmit={submit}
    >
      <label className="flex flex-col gap-2 text-body-xs font-medium text-content-primary">
        {m.reasonLabel}
        <Textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setMissing(false);
          }}
          placeholder={m.reasonPlaceholder}
          rows={4}
          maxLength={500}
          autoFocus
        />
      </label>
      {missing ? (
        <p role="alert" className="text-body-xs text-danger">
          {m.reasonRequired}
        </p>
      ) : null}
    </FormDialog>
  );
}
