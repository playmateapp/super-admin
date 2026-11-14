'use client';

import { User } from 'lucide-react';
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
  StatusTag,
  type ListColumn,
} from '@/components/ui';
import { useListState } from '@/lib/hooks/use-list-state';
import { commonMessages } from '@/lib/i18n';
import { cn, formatCount, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { BlockUserDialog, useBlockUser, type BlockTarget } from '../components/block-user-dialog';
import { UserDetailPanel } from '../components/user-detail-panel';
import { useUsers } from '../hooks/queries';
import { usersMessages } from '../i18n/users.messages';
import type { UserRow } from '../types';

const PAGE_SIZE = 10;

/**
 * UsersScreen — `/users` (Figma "All Users"): totals strip, the player list with search +
 * type + status filters, and the selected player's detail panel.
 */
export function UsersScreen() {
  const m = useMessages(usersMessages);
  const c = useMessages(commonMessages);
  const list = useListState({ type: '', status: '', gender: '', profileType: '', division: '' });
  const [confirmBlock, setConfirmBlock] = useState<BlockTarget | null>(null);
  const unblock = useBlockUser();
  const { setSelectedId } = list;

  // `/users?user=<id>` (owner / captain on a team panel) opens that player's panel.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('user');
    if (id) setSelectedId(id);
  }, [setSelectedId]);

  const params = useMemo(
    () => ({
      search: list.debouncedSearch,
      type: list.filters.type,
      status: list.filters.status,
      gender: list.filters.gender,
      profileType: list.filters.profileType,
      division: list.filters.division,
      page: list.page,
      pageSize: PAGE_SIZE,
    }),
    [list.debouncedSearch, list.filters, list.page],
  );
  const { data, isLoading, isError, refetch } = useUsers(params);
  const rows = data?.rows;
  const selectedId = list.selectedId ?? rows?.[0]?.id ?? null;

  // Blocking asks first; unblocking runs straight away.
  const toggleBlock = (target: BlockTarget) =>
    target.blocked ? unblock.run(target) : setConfirmBlock(target);

  const columns = useMemo<ListColumn<UserRow>[]>(
    () => [
      {
        key: 'name',
        header: m.list.name,
        className: 'w-[210px]',
        cell: (u) => (
          <IdentityCell
            avatar={<EntityAvatar src={u.avatar_url} name={u.full_name} />}
            name={u.full_name || c.none}
            sub={[
              interpolate(c.id, { id: u.player_code }),
              u.profile_type ? (m.profileTypes[u.profile_type] ?? u.profile_type) : '',
            ]
              .filter(Boolean)
              .join(' · ')}
          />
        ),
      },
      {
        key: 'type',
        header: m.list.type,
        className: 'w-[110px] text-center',
        cell: (u) => (
          <span
            className={cn(
              'whitespace-nowrap text-body-md',
              u.type === 'team_owner' ? 'text-violet' : 'text-content-link',
            )}
          >
            {c.userType[u.type]}
          </span>
        ),
      },
      {
        key: 'team',
        header: m.list.team,
        cell: (u) =>
          u.team ? (
            <span className="flex items-center gap-1">
              <EntityAvatar src={u.team.logo_url} name={u.team.name} size={32} />
              <span className="line-clamp-2 font-display text-body-xs">{u.team.name}</span>
            </span>
          ) : (
            <span className="ps-2.5">-</span>
          ),
      },
      {
        key: 'location',
        header: m.list.location,
        className: 'w-[140px]',
        cell: (u) =>
          u.thana || u.district || u.division ? (
            <span className="flex min-w-0 flex-col gap-0.5 text-start">
              <span className="line-clamp-1 text-body-xs text-content-primary">
                {[u.thana, u.district].filter(Boolean).join(', ') || u.division}
              </span>
              <span className="line-clamp-1 text-caption text-content-secondary">
                {[u.thana || u.district ? u.division : '', u.post_code].filter(Boolean).join(' · ')}
              </span>
            </span>
          ) : (
            <span className="ps-2.5">-</span>
          ),
      },
      {
        key: 'status',
        header: m.list.status,
        className: 'w-[110px] text-center',
        cell: (u) => <StatusTag status={u.status} className="w-full" />,
      },
    ],
    [m, c],
  );

  return (
    <div className="flex flex-col gap-5">
      <StatStrip
        items={[
          {
            key: 'users',
            label: m.stats.users,
            tone: 'green',
            icon: <User className="text-content-brand" strokeWidth={1.75} />,
            value: data ? formatCount(data.stats.users) : '—',
          },
          {
            key: 'teams',
            label: m.stats.teams,
            tone: 'blue',
            icon: <DesignIcon name="jersey" size={23} />,
            value: data ? formatCount(data.stats.teams) : '—',
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
                  value={list.filters.type}
                  onChange={(v) => list.setFilter('type', v)}
                  placeholder={m.list.typeFilter}
                  allLabel={m.list.allTypes}
                  options={[
                    { value: 'player', label: c.userType.player },
                    { value: 'team_owner', label: c.userType.team_owner },
                  ]}
                />
                <FilterMenu
                  className="flex-1"
                  value={list.filters.status}
                  onChange={(v) => list.setFilter('status', v)}
                  placeholder={m.list.statusFilter}
                  allLabel={m.list.allStatuses}
                  options={(['active', 'new', 'pending', 'blocked'] as const).map((s) => ({
                    value: s,
                    label: c.status[s],
                  }))}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <FilterMenu
                className="flex-1"
                value={list.filters.gender}
                onChange={(v) => list.setFilter('gender', v)}
                placeholder={m.list.genderFilter}
                allLabel={m.list.allGenders}
                options={['Male', 'Female'].map((g) => ({ value: g, label: m.genders[g] ?? g }))}
              />
              <FilterMenu
                className="flex-1"
                value={list.filters.profileType}
                onChange={(v) => list.setFilter('profileType', v)}
                placeholder={m.list.profileTypeFilter}
                allLabel={m.list.allProfileTypes}
                options={(data?.options.profile_types ?? []).map((t) => ({
                  value: t,
                  label: m.profileTypes[t] ?? t,
                }))}
              />
              <FilterMenu
                className="flex-1"
                value={list.filters.division}
                onChange={(v) => list.setFilter('division', v)}
                placeholder={m.list.divisionFilter}
                allLabel={m.list.allDivisions}
                options={(data?.options.divisions ?? []).map((d) => ({
                  value: String(d.id),
                  label: d.name,
                }))}
              />
            </div>
            <ListTable
              columns={columns}
              rows={rows}
              getRowId={(u) => u.id}
              selectedId={selectedId}
              onSelect={(u) => list.setSelectedId(u.id)}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              isFiltered={list.isFiltered}
              actions={(u) => (
                <ActionMenu label={interpolate(m.list.rowMenu, { name: u.full_name })}>
                  <ActionView label={m.actions.view} onSelect={() => list.setSelectedId(u.id)} />
                  <ActionToggle
                    label={m.actions.block}
                    checked={u.status === 'blocked'}
                    onSelect={() =>
                      toggleBlock({ id: u.id, name: u.full_name, blocked: u.status === 'blocked' })
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
        detail={<UserDetailPanel userId={selectedId} onToggleBlock={toggleBlock} />}
      />

      <BlockUserDialog target={confirmBlock} onClose={() => setConfirmBlock(null)} />
    </div>
  );
}
