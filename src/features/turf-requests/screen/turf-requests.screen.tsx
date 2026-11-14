'use client';

import { BadgeCheck, Clock, MapPin, MessageSquareWarning, ShieldX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  ActionDelete,
  ActionMenu,
  ActionView,
  IdentityCell,
  ListTable,
  Pager,
  Panel,
  PanelTitle,
  PillTabs,
  SearchBox,
  SplitLayout,
  StatStrip,
  StatusPill,
  type ListColumn,
} from '@/components/ui';
import { useListState } from '@/lib/hooks/use-list-state';
import { formatCount, formatDate, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import {
  ApproveTurfRequestDialog,
  DeleteTurfRequestDialog,
  RejectTurfRequestDialog,
} from '../components/review-turf-request-dialogs';
import { TurfRequestDetailPanel, turfStatusTone } from '../components/turf-request-detail-panel';
import { useTurfRequests } from '../hooks/queries';
import { turfRequestsMessages } from '../i18n/turf-requests.messages';
import type { TurfRequest, TurfRequestStatus } from '../types';

const PAGE_SIZE = 10;
type Tab = TurfRequestStatus | 'all';

/**
 * TurfRequestsScreen — `/turf-requests`: turf owners' "Turf Listing Interest Form" requests from
 * the app. Status tabs (pending first), search, the request list and a detail panel with
 * Approve (→ published venue) / Reject (reason, owner can appeal) / Delete (owner can re-apply).
 */
export function TurfRequestsScreen() {
  const m = useMessages(turfRequestsMessages);
  const list = useListState({ status: 'pending' as string });
  const [approving, setApproving] = useState<TurfRequest | null>(null);
  const [rejecting, setRejecting] = useState<TurfRequest | null>(null);
  const [deleting, setDeleting] = useState<TurfRequest | null>(null);

  // `/turf-requests?request=<id>` (link from a venue) opens that request.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('request');
    if (id) {
      list.setFilter('status', 'all');
      list.setSelectedId(id);
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tab = list.filters.status as Tab;
  const params = useMemo(
    () => ({
      search: list.debouncedSearch,
      status: tab === 'all' ? '' : tab,
      page: list.page,
      pageSize: PAGE_SIZE,
    }),
    [list.debouncedSearch, tab, list.page],
  );
  const { data, isLoading, isError, refetch } = useTurfRequests(params);
  const rows = data?.rows;
  const selectedId = list.selectedId ?? rows?.[0]?.id ?? null;

  const columns = useMemo<ListColumn<TurfRequest>[]>(
    () => [
      {
        key: 'turf',
        header: m.list.turf,
        cell: (r) => (
          <IdentityCell
            avatar={
              r.photos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL
                <img
                  src={r.photos[0]}
                  alt=""
                  className="h-10 w-[54px] shrink-0 rounded-[4px] object-cover"
                />
              ) : (
                <span className="grid h-10 w-[54px] shrink-0 place-items-center rounded-[4px] bg-surface-muted">
                  <MapPin aria-hidden className="size-5 text-content-muted" />
                </span>
              )
            }
            name={r.turf_name}
            sub={r.format}
          />
        ),
      },
      {
        key: 'owner',
        header: m.list.owner,
        cell: (r) => (
          <div className="flex flex-col text-start text-body-xs">
            <span className="text-content-primary">{r.owner_name}</span>
            <span className="text-content-secondary" dir="ltr">
              {r.phone}
            </span>
          </div>
        ),
      },
      {
        key: 'location',
        header: m.list.location,
        cell: (r) => (
          <span className="line-clamp-2 text-start text-body-xs">
            {[r.thana, r.district].filter(Boolean).join(', ')}
          </span>
        ),
      },
      {
        key: 'date',
        header: m.list.date,
        className: 'w-[110px] text-center',
        cell: (r) => <span className="text-body-xs">{formatDate(r.created_at)}</span>,
      },
      {
        key: 'status',
        header: m.list.status,
        className: 'w-[110px] text-center',
        cell: (r) => <StatusPill tone={turfStatusTone[r.status]} label={m.status[r.status]} />,
      },
    ],
    [m],
  );

  const stat = (key: TurfRequestStatus) => (data ? formatCount(data.stats[key]) : '—');

  return (
    <div className="flex flex-col gap-5">
      <StatStrip
        items={[
          {
            key: 'pending',
            label: m.stats.pending,
            tone: 'gold',
            icon: <Clock className="text-warning" strokeWidth={1.75} />,
            value: stat('pending'),
          },
          {
            key: 'appealed',
            label: m.stats.appealed,
            tone: 'blue',
            icon: <MessageSquareWarning className="text-info" strokeWidth={1.75} />,
            value: stat('appealed'),
          },
          {
            key: 'approved',
            label: m.stats.approved,
            tone: 'green',
            icon: <BadgeCheck className="text-content-brand" strokeWidth={1.75} />,
            value: stat('approved'),
          },
          {
            key: 'rejected',
            label: m.stats.rejected,
            tone: 'red',
            icon: <ShieldX className="text-danger" strokeWidth={1.75} />,
            value: stat('rejected'),
          },
        ]}
      />

      <SplitLayout
        list={
          <Panel className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-1">
              <PanelTitle>{m.list.title}</PanelTitle>
              <p className="text-body-xs text-content-secondary">{m.list.hint}</p>
            </div>
            <PillTabs
              label={m.list.tabsLabel}
              value={tab}
              onChange={(v) => {
                list.setFilter('status', v);
                list.setSelectedId(null);
              }}
              tabs={[
                { key: 'pending', label: m.tabs.pending },
                { key: 'appealed', label: m.tabs.appealed },
                { key: 'approved', label: m.tabs.approved },
                { key: 'rejected', label: m.tabs.rejected },
                { key: 'all', label: m.tabs.all },
              ]}
            />
            <SearchBox value={list.search} onChange={list.setSearch} placeholder={m.list.search} />
            <ListTable
              columns={columns}
              rows={rows}
              getRowId={(r) => r.id}
              selectedId={selectedId}
              onSelect={(r) => list.setSelectedId(r.id)}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              isFiltered={list.isFiltered}
              actions={(r) => (
                <ActionMenu label={interpolate(m.list.rowMenu, { name: r.turf_name })}>
                  <ActionView
                    filled
                    label={m.actions.view}
                    onSelect={() => list.setSelectedId(r.id)}
                  />
                  <ActionDelete label={m.actions.delete} onSelect={() => setDeleting(r)} />
                </ActionMenu>
              )}
            />
            <Pager
              page={list.page}
              pageSize={PAGE_SIZE}
              total={data?.total ?? 0}
              onChange={list.setPage}
            />
          </Panel>
        }
        detail={
          <TurfRequestDetailPanel
            requestId={selectedId}
            version={rows?.find((r) => r.id === selectedId)?.updated_at}
            onApprove={setApproving}
            onReject={setRejecting}
            onDelete={setDeleting}
          />
        }
      />

      <ApproveTurfRequestDialog request={approving} onClose={() => setApproving(null)} />
      <RejectTurfRequestDialog request={rejecting} onClose={() => setRejecting(null)} />
      <DeleteTurfRequestDialog
        request={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={() => list.setSelectedId(null)}
      />
    </div>
  );
}
