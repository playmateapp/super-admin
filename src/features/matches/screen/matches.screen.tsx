'use client';

import { CircleCheck, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  ActionMenu,
  ActionToggle,
  ActionView,
  DateRangeMenu,
  DesignIcon,
  EntityAvatar,
  FilterMenu,
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
import { MATCH_FORMATS } from '@/lib/constants/match-formats';
import { useAreas } from '@/lib/hooks/use-areas';
import { useListState } from '@/lib/hooks/use-list-state';
import { commonMessages } from '@/lib/i18n';
import { formatClock, formatCount, formatDay, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { CancelMatchDialog, type CancelTarget } from '../components/cancel-match-dialog';
import { MatchDetailPanel } from '../components/match-detail-panel';
import { useMatches } from '../hooks/queries';
import { matchesMessages } from '../i18n/matches.messages';
import type { MatchRow, MatchStatus } from '../types';

const PAGE_SIZE = 6;
const STATUSES: MatchStatus[] = ['upcoming', 'ready_to_start', 'ongoing', 'complete', 'cancelled'];

function TeamMini({ name, logo }: { name: string; logo: string }) {
  return (
    <span className="flex min-w-0 items-center gap-1">
      <EntityAvatar src={logo} name={name} size={24} />
      <span className="line-clamp-2 max-w-[80px] font-display text-caption text-content-primary">
        {name}
      </span>
    </span>
  );
}

/**
 * MatchesScreen — `/matches` (Figma "Matches"): totals, the match list with search, format,
 * status, date-range and location filters, and the selected match's detail panel.
 */
export function MatchesScreen() {
  const m = useMessages(matchesMessages);
  const c = useMessages(commonMessages);
  const list = useListState({ format: '', status: '', area: '' });
  const [range, setRange] = useState<DateRange>({ from: '', to: '' });
  const [cancelTarget, setCancelTarget] = useState<CancelTarget | null>(null);
  const { data: areas } = useAreas();

  const params = useMemo(
    () => ({
      search: list.debouncedSearch,
      format: list.filters.format,
      status: list.filters.status,
      area: list.filters.area,
      from: range.from,
      to: range.to,
      page: list.page,
      pageSize: PAGE_SIZE,
    }),
    [list.debouncedSearch, list.filters, list.page, range],
  );
  const { data, isLoading, isError, refetch } = useMatches(params);
  const rows = data?.rows;
  const selectedId = list.selectedId ?? rows?.[0]?.id ?? null;

  const columns = useMemo<ListColumn<MatchRow>[]>(
    () => [
      {
        key: 'date',
        header: m.list.date,
        className: 'w-[120px]',
        cell: (r) => (
          <span className="flex flex-col gap-1 ps-1 text-start">
            <span className="text-body-xs">{formatDay(r.kick_off)}</span>
            <span className="text-caption text-content-secondary">{formatClock(r.kick_off)}</span>
          </span>
        ),
      },
      {
        key: 'teams',
        header: m.list.teams,
        cell: (r) => (
          <span className="flex items-center gap-2">
            <TeamMini name={r.home.name} logo={r.home.logo_url} />
            <span className="text-body-xs text-content-secondary">{c.vs}</span>
            <TeamMini name={r.away.name} logo={r.away.logo_url} />
          </span>
        ),
      },
      {
        key: 'format',
        header: m.list.format,
        className: 'w-[90px] text-center',
        cell: (r) => r.format,
      },
      {
        key: 'location',
        header: m.list.location,
        className: 'w-[120px]',
        cell: (r) => <span className="line-clamp-2">{r.venue || c.none}</span>,
      },
      {
        key: 'status',
        header: m.list.status,
        className: 'w-[120px] text-center',
        cell: (r) => <StatusTag status={r.status} className="min-w-0" />,
      },
    ],
    [m, c],
  );

  return (
    <div className="flex flex-col gap-5">
      <StatStrip
        items={[
          {
            key: 'total',
            label: m.stats.total,
            tone: 'blue',
            icon: <DesignIcon name="jersey" size={23} />,
            value: data ? formatCount(data.stats.total) : '—',
          },
          {
            key: 'upcoming',
            label: m.stats.upcoming,
            tone: 'indigo',
            icon: <DesignIcon name="jersey" size={23} />,
            value: data ? formatCount(data.stats.upcoming) : '—',
          },
          {
            key: 'complete',
            label: m.stats.complete,
            tone: 'green',
            icon: <CircleCheck className="text-content-brand" strokeWidth={1.75} />,
            value: data ? formatCount(data.stats.complete) : '—',
          },
          {
            key: 'cancelled',
            label: m.stats.cancelled,
            tone: 'red',
            icon: <Users className="text-danger" strokeWidth={1.75} />,
            value: data ? formatCount(data.stats.cancelled) : '—',
          },
        ]}
      />

      <SplitLayout
        list={
          <Panel className="flex flex-col gap-4 p-4">
            <PanelTitle>{m.list.title}</PanelTitle>
            <SearchBox value={list.search} onChange={list.setSearch} placeholder={m.list.search} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <FilterMenu
                className="sm:w-auto"
                value={list.filters.format}
                onChange={(v) => list.setFilter('format', v)}
                placeholder={m.list.formatFilter}
                allLabel={m.list.allFormats}
                options={MATCH_FORMATS.map((f) => ({ value: f, label: f }))}
              />
              <FilterMenu
                className="sm:w-auto"
                value={list.filters.status}
                onChange={(v) => list.setFilter('status', v)}
                placeholder={m.list.statusFilter}
                allLabel={m.list.allStatuses}
                options={STATUSES.map((s) => ({ value: s, label: c.status[s] }))}
              />
              <DateRangeMenu
                className="sm:w-auto"
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
                className="sm:w-auto"
                value={list.filters.area}
                onChange={(v) => list.setFilter('area', v)}
                placeholder={m.list.areaFilter}
                allLabel={m.list.allAreas}
                options={(areas ?? []).map((a) => ({ value: a, label: a }))}
              />
            </div>
            <ListTable
              columns={columns}
              rows={rows}
              getRowId={(r) => r.id}
              selectedId={selectedId}
              onSelect={(r) => list.setSelectedId(r.id)}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              isFiltered={list.isFiltered || !!range.from || !!range.to}
              actions={(r) => {
                const canCancel = r.status !== 'complete' && r.status !== 'cancelled';
                return (
                  <ActionMenu
                    label={interpolate(m.list.rowMenu, { home: r.home.name, away: r.away.name })}
                  >
                    <ActionView
                      filled
                      label={m.actions.view}
                      onSelect={() => list.setSelectedId(r.id)}
                    />
                    <ActionToggle
                      label={m.actions.cancel}
                      checked={r.status === 'cancelled'}
                      disabled={!canCancel}
                      onSelect={() =>
                        setCancelTarget({ id: r.id, home: r.home.name, away: r.away.name })
                      }
                    />
                  </ActionMenu>
                );
              }}
            />
            <Pager
              page={list.page}
              pageSize={PAGE_SIZE}
              total={data?.total ?? 0}
              onChange={list.setPage}
            />
          </Panel>
        }
        detail={<MatchDetailPanel matchId={selectedId} onCancel={setCancelTarget} />}
      />

      <CancelMatchDialog target={cancelTarget} onClose={() => setCancelTarget(null)} />
    </div>
  );
}
