'use client';

import { MapPin, Plus, Trash2, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  ActionDelete,
  ActionEdit,
  ActionMenu,
  AlertModal,
  Button,
  ListTable,
  Panel,
  PanelTitle,
  SearchBox,
  StatStrip,
  type ListColumn,
} from '@/components/ui';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
import { commonMessages } from '@/lib/i18n';
import { formatCount, getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { AreaFormModal } from '../components/area-form-modal';
import { useDeleteArea } from '../hooks/mutations';
import { useAreaList } from '../hooks/queries';
import { areasMessages } from '../i18n/areas.messages';
import type { Area } from '../types';

/**
 * AreasScreen — `/areas`: the areas the app offers (player profiles, venues). Admins add as
 * many as they need, rename, reorder and delete unused ones. No Figma frame; it follows the
 * Venues list (strip, panel, ⋮ menu, modal form).
 */
export function AreasScreen() {
  const m = useMessages(areasMessages);
  const c = useMessages(commonMessages);
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 300);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);
  const [toDelete, setToDelete] = useState<Area | null>(null);
  const remove = useDeleteArea();
  const { data, isLoading, isError, refetch } = useAreaList(debounced);
  const rows = data?.rows;

  const openForm = (area: Area | null) => {
    setEditing(area);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const area = toDelete;
    remove.mutate(area.id, {
      onSuccess: () => toast.success(interpolate(m.actions.deleted, { name: area.name })),
      onError: (err) => {
        const message = getErrorMessage(err, c.deleteFailed);
        const used = /area_in_use:(\d+)/.exec(message);
        toast.error(used ? interpolate(m.actions.inUse, { count: used[1] }) : message);
      },
      onSettled: () => setToDelete(null),
    });
  };

  const columns = useMemo<ListColumn<Area>[]>(
    () => [
      {
        key: 'order',
        header: m.list.order,
        className: 'w-[90px] text-center',
        cell: (a) => <span className="text-content-secondary">{a.sort}</span>,
      },
      {
        key: 'name',
        header: m.list.name,
        cell: (a) => (
          <span className="flex items-center gap-2 text-start">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-tint text-content-brand">
              <MapPin aria-hidden className="size-5" />
            </span>
            <span className="font-display text-body-md">{a.name}</span>
          </span>
        ),
      },
      {
        key: 'venues',
        header: m.list.venues,
        className: 'w-[110px] text-center',
        cell: (a) => <span className="font-display text-body-md">{formatCount(a.venues)}</span>,
      },
      {
        key: 'players',
        header: m.list.players,
        className: 'w-[110px] text-center',
        cell: (a) => <span className="font-display text-body-md">{formatCount(a.players)}</span>,
      },
    ],
    [m],
  );

  const totals = (rows ?? []).reduce(
    (acc, a) => ({ venues: acc.venues + a.venues, players: acc.players + a.players }),
    { venues: 0, players: 0 },
  );

  return (
    <div className="flex flex-col gap-5">
      <StatStrip
        items={[
          {
            key: 'total',
            label: m.stats.total,
            tone: 'green',
            icon: <MapPin className="text-content-brand" strokeWidth={1.75} />,
            value: data ? formatCount(data.total) : '—',
          },
          {
            key: 'venues',
            label: m.stats.venues,
            tone: 'blue',
            icon: <MapPin className="text-info" strokeWidth={1.75} />,
            value: data ? formatCount(totals.venues) : '—',
          },
          {
            key: 'players',
            label: m.stats.players,
            tone: 'indigo',
            icon: <User className="text-violet" strokeWidth={1.75} />,
            value: data ? formatCount(totals.players) : '—',
          },
        ]}
      />

      <Panel className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <PanelTitle>{m.list.title}</PanelTitle>
          <p className="text-body-xs text-content-secondary">{m.list.hint}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <SearchBox value={search} onChange={setSearch} placeholder={m.list.search} />
          <Button className="h-[43px] rounded-input" onClick={() => openForm(null)}>
            <Plus />
            {m.list.add}
          </Button>
        </div>
        <ListTable
          columns={columns}
          rows={rows}
          getRowId={(a) => String(a.id)}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          isFiltered={!!debounced.trim()}
          minWidth={560}
          actions={(a) => (
            <ActionMenu label={interpolate(m.list.rowMenu, { name: a.name })}>
              <ActionEdit label={m.actions.edit} onSelect={() => openForm(a)} />
              <ActionDelete label={m.actions.delete} onSelect={() => setToDelete(a)} />
            </ActionMenu>
          )}
        />
      </Panel>

      <AreaFormModal open={formOpen} onOpenChange={setFormOpen} area={editing} />
      <AlertModal
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        icon={<Trash2 />}
        title={m.actions.deleteTitle}
        message={interpolate(m.actions.deleteMessage, { name: toDelete?.name ?? '' })}
        cancelLabel={m.actions.cancel}
        confirmLabel={m.actions.confirm}
        isPending={remove.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
