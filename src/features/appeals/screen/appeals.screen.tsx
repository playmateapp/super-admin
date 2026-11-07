'use client';

import { Check, Clock, ShieldX, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  Button,
  IdentityCell,
  ListTable,
  Pager,
  Panel,
  PanelTitle,
  PillTabs,
  StatStrip,
  StatusPill,
  EntityAvatar,
  type ListColumn,
  type PillTone,
} from '@/components/ui';
import { formatCount, formatDate, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { ApproveAppealDialog, RejectAppealDialog } from '../components/review-appeal-dialogs';
import { useAppealList } from '../hooks/queries';
import { appealsMessages } from '../i18n/appeals.messages';
import type { Appeal, AppealStatus } from '../types';

const PAGE_SIZE = 20;

const statusTone: Record<AppealStatus, PillTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

/**
 * AppealsScreen — `/appeals`: requests from blocked players. Open ones come first; approving
 * unblocks the player, rejecting sends them the admin's reason. No Figma frame; it follows
 * the Areas list (strip, panel, table).
 */
export function AppealsScreen() {
  const m = useMessages(appealsMessages);
  const [status, setStatus] = useState<AppealStatus | 'all'>('pending');
  const [page, setPage] = useState(1);
  const [approving, setApproving] = useState<Appeal | null>(null);
  const [rejecting, setRejecting] = useState<Appeal | null>(null);
  const { data, isLoading, isError, refetch } = useAppealList({
    status: status === 'all' ? '' : status,
    page,
    pageSize: PAGE_SIZE,
  });

  const columns = useMemo<ListColumn<Appeal>[]>(
    () => [
      {
        key: 'player',
        header: m.list.player,
        cell: (a) => (
          <IdentityCell
            avatar={<EntityAvatar src={a.avatar_url} name={a.full_name} size={40} />}
            name={a.full_name}
            sub={a.phone || a.player_code}
          />
        ),
      },
      {
        key: 'message',
        header: m.list.message,
        cell: (a) => (
          <div className="max-w-[360px] whitespace-pre-wrap text-start text-body-xs text-content-primary">
            {a.message}
            {a.admin_reason ? (
              <p className="mt-1 text-content-secondary">{a.admin_reason}</p>
            ) : null}
          </div>
        ),
      },
      {
        key: 'date',
        header: m.list.date,
        className: 'w-[130px] text-center',
        cell: (a) => <span className="text-body-xs">{formatDate(a.created_at)}</span>,
      },
      {
        key: 'status',
        header: m.list.status,
        className: 'w-[120px] text-center',
        cell: (a) => <StatusPill tone={statusTone[a.status]} label={m.status[a.status]} />,
      },
    ],
    [m],
  );

  const select = (next: AppealStatus | 'all') => {
    setStatus(next);
    setPage(1);
  };

  const stat = (key: AppealStatus) => (data ? formatCount(data.stats[key]) : '—');

  return (
    <div className="flex flex-col gap-5">
      <StatStrip
        items={[
          {
            key: 'pending',
            label: m.stats.pending,
            tone: 'green',
            icon: <Clock className="text-content-brand" strokeWidth={1.75} />,
            value: stat('pending'),
          },
          {
            key: 'approved',
            label: m.stats.approved,
            tone: 'blue',
            icon: <Check className="text-info" strokeWidth={1.75} />,
            value: stat('approved'),
          },
          {
            key: 'rejected',
            label: m.stats.rejected,
            tone: 'indigo',
            icon: <ShieldX className="text-violet" strokeWidth={1.75} />,
            value: stat('rejected'),
          },
        ]}
      />

      <Panel className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <PanelTitle>{m.list.title}</PanelTitle>
          <p className="text-body-xs text-content-secondary">{m.list.hint}</p>
        </div>
        <PillTabs
          label={m.list.tabsLabel}
          value={status}
          onChange={select}
          tabs={[
            { key: 'pending', label: m.tabs.pending },
            { key: 'approved', label: m.tabs.approved },
            { key: 'rejected', label: m.tabs.rejected },
            { key: 'all', label: m.tabs.all },
          ]}
        />
        <ListTable
          columns={columns}
          rows={data?.rows}
          getRowId={(a) => a.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          minWidth={820}
          actions={(a) =>
            a.status === 'pending' ? (
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  aria-label={interpolate(m.list.rowApprove, { name: a.full_name })}
                  onClick={() => setApproving(a)}
                >
                  <Check />
                  {m.actions.approve}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  aria-label={interpolate(m.list.rowReject, { name: a.full_name })}
                  onClick={() => setRejecting(a)}
                >
                  <X />
                  {m.actions.reject}
                </Button>
              </div>
            ) : null
          }
        />
        {data ? (
          <Pager page={page} pageSize={PAGE_SIZE} total={data.total} onChange={setPage} />
        ) : null}
      </Panel>

      <ApproveAppealDialog appeal={approving} onClose={() => setApproving(null)} />
      <RejectAppealDialog appeal={rejecting} onClose={() => setRejecting(null)} />
    </div>
  );
}
