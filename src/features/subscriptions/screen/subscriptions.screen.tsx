'use client';

import { useMemo, useState } from 'react';

import {
  ActionMenu,
  ActionView,
  DateRangeMenu,
  DesignIcon,
  EntityAvatar,
  FilterMenu,
  IdentityCell,
  ListTable,
  Pager,
  Panel,
  PanelTitle,
  SearchBox,
  SplitLayout,
  StatStrip,
  StatusTag,
  type DateRange,
  type ListColumn,
} from '@/components/ui';
import { useListState } from '@/lib/hooks/use-list-state';
import { commonMessages } from '@/lib/i18n';
import { formatCount, formatDateMedium, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { SubscriptionDetailPanel } from '../components/subscription-detail-panel';
import { useSubscriptions } from '../hooks/queries';
import { subscriptionsMessages } from '../i18n/subscriptions.messages';
import type { SubscriptionRow } from '../types';

const PAGE_SIZE = 10;

/**
 * SubscriptionsScreen — `/subscriptions` (Figma "Subscriptions"): totals, the subscription list
 * with search + date range + status filters and the detail panel. Read-only: payments are
 * made in the app.
 */
export function SubscriptionsScreen() {
  const m = useMessages(subscriptionsMessages);
  const c = useMessages(commonMessages);
  const list = useListState({ status: '' });
  const [range, setRange] = useState<DateRange>({ from: '', to: '' });

  const params = useMemo(
    () => ({
      search: list.debouncedSearch,
      status: list.filters.status,
      from: range.from,
      to: range.to,
      page: list.page,
      pageSize: PAGE_SIZE,
    }),
    [list.debouncedSearch, list.filters, list.page, range],
  );
  const { data, isLoading, isError, refetch } = useSubscriptions(params);
  const rows = data?.rows;
  const selectedId = list.selectedId ?? rows?.[0]?.id ?? null;

  const columns = useMemo<ListColumn<SubscriptionRow>[]>(
    () => [
      {
        key: 'name',
        header: m.list.name,
        className: 'w-[200px]',
        cell: (s) =>
          s.team ? (
            <IdentityCell
              avatar={<EntityAvatar src={s.team.logo_url} name={s.team.name} />}
              name={s.team.name}
              sub={interpolate(c.id, { id: s.team.team_code })}
            />
          ) : (
            <span className="text-body-xs text-content-muted">{m.list.noTeam}</span>
          ),
      },
      {
        key: 'owner',
        header: m.list.owner,
        cell: (s) => (
          <span className="flex items-center gap-1">
            <EntityAvatar src={s.owner.avatar_url} name={s.owner.name} size={32} />
            <span className="line-clamp-2 font-display text-body-xs">{s.owner.name}</span>
          </span>
        ),
      },
      {
        key: 'start',
        header: m.list.start,
        className: 'w-[130px] text-center',
        cell: (s) => (
          <span className="font-display text-body-md">{formatDateMedium(s.starts_at)}</span>
        ),
      },
      {
        key: 'status',
        header: m.list.status,
        className: 'w-[110px] text-center',
        cell: (s) => <StatusTag status={s.status} className="w-full" />,
      },
    ],
    [m, c],
  );

  const crown = <DesignIcon name="crown" size={24} />;

  return (
    <div className="flex flex-col gap-5">
      <StatStrip
        items={[
          {
            key: 'total',
            label: m.stats.total,
            tone: 'green',
            icon: crown,
            value: data ? formatCount(data.stats.total) : '—',
          },
          {
            key: 'active',
            label: m.stats.active,
            tone: 'blue',
            icon: crown,
            value: data ? formatCount(data.stats.active) : '—',
          },
          {
            key: 'expiring',
            label: m.stats.expiring,
            tone: 'gold',
            icon: crown,
            value: data ? formatCount(data.stats.expiring) : '—',
          },
          {
            key: 'inactive',
            label: m.stats.inactive,
            tone: 'red',
            icon: crown,
            value: data ? formatCount(data.stats.inactive) : '—',
          },
        ]}
      />

      <SplitLayout
        list={
          <Panel className="flex flex-col gap-4 p-4">
            <PanelTitle>{m.list.title}</PanelTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <SearchBox
                value={list.search}
                onChange={list.setSearch}
                placeholder={m.list.search}
              />
              <div className="flex gap-3 sm:gap-4">
                <DateRangeMenu
                  className="flex-1"
                  value={range}
                  onChange={(v) => {
                    setRange(v);
                    list.setPage(1);
                  }}
                  placeholder={m.list.dateFilter}
                  labels={{
                    from: m.list.from,
                    to: m.list.to,
                    clear: m.list.clear,
                    joiner: m.list.joiner,
                  }}
                />
                <FilterMenu
                  className="flex-1"
                  value={list.filters.status}
                  onChange={(v) => list.setFilter('status', v)}
                  placeholder={m.list.statusFilter}
                  allLabel={m.list.allStatuses}
                  options={(['active', 'expired', 'blocked'] as const).map((s) => ({
                    value: s,
                    label: c.status[s],
                  }))}
                />
              </div>
            </div>
            <ListTable
              columns={columns}
              rows={rows}
              getRowId={(s) => s.id}
              selectedId={selectedId}
              onSelect={(s) => list.setSelectedId(s.id)}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              isFiltered={list.isFiltered || !!range.from || !!range.to}
              actions={(s) => (
                <ActionMenu
                  label={interpolate(m.list.rowMenu, { name: s.team?.name ?? s.owner.name })}
                >
                  <ActionView
                    filled
                    label={m.list.view}
                    onSelect={() => list.setSelectedId(s.id)}
                  />
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
        detail={<SubscriptionDetailPanel subscriptionId={selectedId} />}
      />
    </div>
  );
}
