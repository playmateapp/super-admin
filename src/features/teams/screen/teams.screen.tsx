'use client';

import { MailQuestionMark, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  ActionMenu,
  ActionToggle,
  ActionView,
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
  StatusPill,
  StatusTag,
  type ListColumn,
} from '@/components/ui';
import { MATCH_FORMATS } from '@/lib/constants/match-formats';
import { useListState } from '@/lib/hooks/use-list-state';
import { commonMessages } from '@/lib/i18n';
import { formatCount, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { BlockTeamDialog, useBlockTeam, type BlockTarget } from '../components/block-team-dialog';
import { TeamDetailPanel } from '../components/team-detail-panel';
import { useTeams } from '../hooks/queries';
import { teamsMessages } from '../i18n/teams.messages';
import type { TeamRow } from '../types';

const PAGE_SIZE = 10;

/**
 * TeamsScreen — `/teams` (Figma "Teams"): totals, the team list with search + format + status
 * filters, and the selected team's detail panel.
 */
export function TeamsScreen() {
  const m = useMessages(teamsMessages);
  const c = useMessages(commonMessages);
  const list = useListState({ format: '', status: '' });
  const [confirmBlock, setConfirmBlock] = useState<BlockTarget | null>(null);
  const unblock = useBlockTeam();
  const { setSelectedId } = list;

  // `/teams?team=<id>` (View team on an unblock request) opens that team's panel.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('team');
    if (id) setSelectedId(id);
  }, [setSelectedId]);

  const params = useMemo(
    () => ({
      search: list.debouncedSearch,
      format: list.filters.format,
      status: list.filters.status,
      page: list.page,
      pageSize: PAGE_SIZE,
    }),
    [list.debouncedSearch, list.filters, list.page],
  );
  const { data, isLoading, isError, refetch } = useTeams(params);
  const rows = data?.rows;
  const selectedId = list.selectedId ?? rows?.[0]?.id ?? null;

  const toggleBlock = (target: BlockTarget) =>
    target.blocked ? unblock.run(target) : setConfirmBlock(target);

  const columns = useMemo<ListColumn<TeamRow>[]>(
    () => [
      {
        key: 'name',
        header: m.list.name,
        className: 'w-[210px]',
        cell: (t) => (
          <IdentityCell
            avatar={<EntityAvatar src={t.logo_url} name={t.name} />}
            name={t.name}
            sub={interpolate(c.id, { id: t.team_code })}
          />
        ),
      },
      {
        key: 'format',
        header: m.list.format,
        className: 'w-[100px] text-center',
        cell: (t) => <span className="text-body-md">{t.format}</span>,
      },
      {
        key: 'owner',
        header: m.list.owner,
        cell: (t) => (
          <span className="flex items-center gap-1">
            <EntityAvatar src={t.owner?.avatar_url} name={t.owner?.name ?? ''} size={32} />
            <span className="line-clamp-2 font-display text-body-xs">{t.owner?.name}</span>
          </span>
        ),
      },
      {
        key: 'status',
        header: m.list.status,
        className: 'w-[130px] text-center',
        cell: (t) => (
          <div className="flex flex-col items-center gap-1">
            <StatusTag status={t.status} className="w-full" />
            {t.appeal_pending ? (
              <StatusPill tone="warning" label={m.list.appealBadge} className="w-full" />
            ) : null}
          </div>
        ),
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
            key: 'active',
            label: m.stats.active,
            tone: 'indigo',
            icon: <DesignIcon name="jersey" size={23} />,
            value: data ? formatCount(data.stats.active) : '—',
          },
          {
            key: 'blocked',
            label: m.stats.blocked,
            tone: 'red',
            icon: <Users className="text-danger" strokeWidth={1.75} />,
            value: data ? formatCount(data.stats.blocked) : '—',
          },
          {
            key: 'appeals',
            label: m.stats.appeals,
            tone: 'gold',
            icon: <MailQuestionMark className="text-warning" strokeWidth={1.75} />,
            value: data ? formatCount(data.stats.appeals ?? 0) : '—',
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
                <FilterMenu
                  className="flex-1"
                  value={list.filters.format}
                  onChange={(v) => list.setFilter('format', v)}
                  placeholder={m.list.formatFilter}
                  allLabel={m.list.allFormats}
                  options={MATCH_FORMATS.map((f) => ({ value: f, label: f }))}
                />
                <FilterMenu
                  className="flex-1"
                  value={list.filters.status}
                  onChange={(v) => list.setFilter('status', v)}
                  placeholder={m.list.statusFilter}
                  allLabel={m.list.allStatuses}
                  options={[
                    ...(['active', 'inactive', 'blocked'] as const).map((s) => ({
                      value: s,
                      label: c.status[s],
                    })),
                    { value: 'appeal', label: m.list.appealFilter },
                  ]}
                />
              </div>
            </div>
            <ListTable
              columns={columns}
              rows={rows}
              getRowId={(t) => t.id}
              selectedId={selectedId}
              onSelect={(t) => list.setSelectedId(t.id)}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              isFiltered={list.isFiltered}
              actions={(t) => (
                <ActionMenu label={interpolate(m.list.rowMenu, { name: t.name })}>
                  <ActionView
                    filled
                    label={m.actions.view}
                    onSelect={() => list.setSelectedId(t.id)}
                  />
                  <ActionToggle
                    label={m.actions.block}
                    checked={t.status === 'blocked'}
                    onSelect={() =>
                      toggleBlock({ id: t.id, name: t.name, blocked: t.status === 'blocked' })
                    }
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
        detail={<TeamDetailPanel teamId={selectedId} onToggleBlock={toggleBlock} />}
      />

      <BlockTeamDialog target={confirmBlock} onClose={() => setConfirmBlock(null)} />
    </div>
  );
}
