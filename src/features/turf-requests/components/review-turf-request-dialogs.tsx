'use client';

import { BadgeCheck, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AlertModal, FormDialog, Textarea } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import {
  useApproveTurfRequest,
  useDeleteTurfRequest,
  useRejectTurfRequest,
} from '../hooks/mutations';
import { turfRequestsMessages } from '../i18n/turf-requests.messages';
import type { TurfRequest } from '../types';

type Props = { request: TurfRequest | null; onClose: () => void };

export function ApproveTurfRequestDialog({ request, onClose }: Props) {
  const m = useMessages(turfRequestsMessages).actions;
  const c = useMessages(commonMessages);
  const approve = useApproveTurfRequest();
  return (
    <AlertModal
      open={!!request}
      onOpenChange={(open) => !open && onClose()}
      icon={<BadgeCheck />}
      title={m.approveTitle}
      message={interpolate(m.approveMessage, { name: request?.turf_name ?? '' })}
      cancelLabel={m.cancel}
      confirmLabel={m.approve}
      isPending={approve.isPending}
      onConfirm={() => {
        if (!request) return;
        approve.mutate(request.id, {
          onSuccess: () => toast.success(interpolate(m.approved, { name: request.turf_name })),
          onError: (err) => toast.error(getErrorMessage(err, c.actionFailed)),
          onSettled: onClose,
        });
      }}
    />
  );
}

/** Rejecting needs a reason: the owner reads it in the app and can appeal once. */
export function RejectTurfRequestDialog({ request, onClose }: Props) {
  const m = useMessages(turfRequestsMessages).actions;
  const c = useMessages(commonMessages);
  const reject = useRejectTurfRequest();
  const [reason, setReason] = useState('');
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (request) {
      setReason('');
      setMissing(false);
    }
  }, [request]);

  const submit = () => {
    if (!request) return;
    if (!reason.trim()) {
      setMissing(true);
      return;
    }
    reject.mutate(
      { id: request.id, reason: reason.trim() },
      {
        onSuccess: () => {
          toast.success(interpolate(m.rejected, { name: request.turf_name }));
          onClose();
        },
        onError: (err) => toast.error(getErrorMessage(err, c.actionFailed)),
      },
    );
  };

  return (
    <FormDialog
      open={!!request}
      onOpenChange={(open) => !open && onClose()}
      title={m.rejectTitle}
      description={interpolate(m.rejectMessage, { name: request?.turf_name ?? '' })}
      submitLabel={m.reject}
      cancelLabel={m.cancel}
      tone="danger"
      isPending={reject.isPending}
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

export function DeleteTurfRequestDialog({
  request,
  onClose,
  onDeleted,
}: Props & { onDeleted?: () => void }) {
  const m = useMessages(turfRequestsMessages).actions;
  const c = useMessages(commonMessages);
  const remove = useDeleteTurfRequest();
  return (
    <AlertModal
      open={!!request}
      onOpenChange={(open) => !open && onClose()}
      icon={<Trash2 />}
      title={m.deleteTitle}
      message={interpolate(m.deleteMessage, { name: request?.turf_name ?? '' })}
      cancelLabel={m.cancel}
      confirmLabel={m.delete}
      isPending={remove.isPending}
      onConfirm={() => {
        if (!request) return;
        remove.mutate(request.id, {
          onSuccess: () => {
            toast.success(m.deleted);
            onDeleted?.();
          },
          onError: (err) => toast.error(getErrorMessage(err, c.actionFailed)),
          onSettled: onClose,
        });
      }}
    />
  );
}
