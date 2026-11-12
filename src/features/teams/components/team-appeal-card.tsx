'use client';

import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ApproveAppealDialog, RejectAppealDialog, type Appeal } from '@/features/appeals';
import { Button, StatusPill, type PillTone } from '@/components/ui';
import { formatDate, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { teamsMessages } from '../i18n/teams.messages';
import type { TeamDetail } from '../types';

const tone: Record<NonNullable<TeamDetail['appeal']>['status'], PillTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

/**
 * Teams detail panel: the owner's request to unblock this team (latest one for the current
 * block). Pending requests can be approved / rejected here with the Appeals dialogs.
 */
export function TeamAppealCard({ team }: { team: TeamDetail }) {
  const m = useMessages(teamsMessages).detail.appeal;
  const [approving, setApproving] = useState<Appeal | null>(null);
  const [rejecting, setRejecting] = useState<Appeal | null>(null);
  const a = team.appeal;
  if (!a) return null;

  const asAppeal: Appeal = {
    id: a.id,
    kind: 'team',
    ref_id: team.id,
    message: a.message,
    status: a.status,
    admin_reason: a.admin_reason,
    created_at: a.created_at,
    name: team.name,
    sub: `#${team.team_code}`,
    avatar_url: team.logo_url,
    owner_name: a.sender?.name ?? '',
    owner_phone: '',
  };

  return (
    <section
      aria-label={m.title}
      className="flex flex-col gap-3 rounded-[10px] border border-warning/40 bg-warning-soft p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-body-xs font-semibold text-content-primary">{m.title}</h3>
        <StatusPill tone={tone[a.status]} label={m.status[a.status]} />
      </div>
      <p className="text-caption text-content-secondary">
        {interpolate(m.from, { name: a.sender?.name ?? '—', date: formatDate(a.created_at) })}
      </p>
      <p className="whitespace-pre-wrap rounded-[8px] bg-surface-card p-2.5 text-body-xs text-content-primary">
        {a.message}
      </p>
      {a.admin_reason ? (
        <p className="text-caption text-content-secondary">
          <span className="font-medium text-content-primary">{m.reason}: </span>
          {a.admin_reason}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        {a.status === 'pending' ? (
          <>
            <Button size="sm" onClick={() => setApproving(asAppeal)}>
              <Check />
              {m.approve}
            </Button>
            <Button size="sm" variant="danger" onClick={() => setRejecting(asAppeal)}>
              <X />
              {m.reject}
            </Button>
          </>
        ) : null}
        <Button size="sm" variant="ghost" asChild className="ms-auto">
          <Link href="/appeals?kind=team">{m.all}</Link>
        </Button>
      </div>

      <ApproveAppealDialog appeal={approving} onClose={() => setApproving(null)} />
      <RejectAppealDialog appeal={rejecting} onClose={() => setRejecting(null)} />
    </section>
  );
}
