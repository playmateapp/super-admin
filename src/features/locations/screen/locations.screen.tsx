'use client';

import { Building2, Map as MapIcon, MapPin, Plus, Trash2, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  ActionDelete,
  ActionEdit,
  ActionMenu,
  AlertModal,
  Button,
  FilterMenu,
  ListTable,
  Panel,
  PanelTitle,
  PillTabs,
  SearchBox,
  StatStrip,
  type ListColumn,
} from '@/components/ui';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
import { commonMessages } from '@/lib/i18n';
import { formatCount, getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { BulkUploadModal } from '../components/bulk-upload-modal';
import { LocationFormModal } from '../components/location-form-modal';
import { useDeleteLocation } from '../hooks/mutations';
import { useLocationList, useLocationOptions } from '../hooks/queries';
import { locationsMessages } from '../i18n/locations.messages';
import type { LocationLevel, LocationRow } from '../types';

/**
 * LocationsScreen — `/locations`: the Division → District → Thana / Upazila tree players pick on
 * their profile and in the app's player / team filters. Tabs switch the level, the toolbar
 * narrows by parent, rows are added one by one or from a CSV (Bulk Upload). No Figma frame;
 * it follows the Areas list.
 */
export function LocationsScreen() {
  const m = useMessages(locationsMessages);
  const c = useMessages(commonMessages);
  const [level, setLevel] = useState<LocationLevel>('division');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 300);
  const [formOpen, setFormOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editing, setEditing] = useState<LocationRow | null>(null);
  const [toDelete, setToDelete] = useState<LocationRow | null>(null);
  const remove = useDeleteLocation();

  // Thanas narrow by district when one is chosen; districts by division.
  const parent =
    level === 'district'
      ? division
        ? Number(division)
        : null
      : level === 'thana'
        ? district
          ? Number(district)
          : null
        : null;
  const { data, isLoading, isError, refetch } = useLocationList(level, parent, debounced);
  const divisions = useLocationOptions('division', null);
  const districts = useLocationOptions('district', division ? Number(division) : null);
  const totals = {
    division: useLocationList('division', null).data?.total,
    district: useLocationList('district', null).data?.total,
    thana: useLocationList('thana', null).data?.total,
  };

  // Without a district filter, thanas list only those of the chosen division.
  const rows = useMemo(() => {
    const all = data?.rows;
    if (!all || level !== 'thana' || district || !division) return all;
    const name = divisions.data?.find((d) => d.value === division)?.label;
    return all.filter((r) => r.division_name === name);
  }, [data, level, district, division, divisions.data]);

  const changeLevel = (next: LocationLevel) => {
    setLevel(next);
    setSearch('');
  };

  const openForm = (row: LocationRow | null) => {
    setEditing(row);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const row = toDelete;
    remove.mutate(
      { level, id: row.id },
      {
        onSuccess: () => toast.success(interpolate(m.actions.deleted, { name: row.name })),
        onError: (err) => {
          const message = getErrorMessage(err, c.deleteFailed);
          const used = /location_in_use:(\d+)/.exec(message);
          toast.error(used ? interpolate(m.actions.inUse, { count: used[1] }) : message);
        },
        onSettled: () => setToDelete(null),
      },
    );
  };

  const columns = useMemo<ListColumn<LocationRow>[]>(() => {
    const list: ListColumn<LocationRow>[] = [
      {
        key: 'order',
        header: m.list.order,
        className: 'w-[80px] text-center',
        cell: (r) => <span className="text-content-secondary">{r.sort}</span>,
      },
      {
        key: 'name',
        header: m.list.name,
        cell: (r) => (
          <span className="flex items-center gap-2 text-start">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-tint text-content-brand">
              <MapPin aria-hidden className="size-5" />
            </span>
            <span className="font-display text-body-md">{r.name}</span>
          </span>
        ),
      },
    ];
    if (level !== 'division') {
      list.push({
        key: 'parent',
        header: m.list.parent,
        cell: (r) => (
          <span className="text-body-xs text-content-secondary">
            {level === 'thana' ? `${r.parent_name}, ${r.division_name}` : r.parent_name}
          </span>
        ),
      });
    }
    if (level !== 'thana') {
      list.push({
        key: 'children',
        header: m.list.children[level],
        className: 'w-[100px] text-center',
        cell: (r) => <span className="font-display text-body-md">{formatCount(r.children)}</span>,
      });
    }
    list.push({
      key: 'players',
      header: m.list.players,
      className: 'w-[100px] text-center',
      cell: (r) => <span className="font-display text-body-md">{formatCount(r.players)}</span>,
    });
    return list;
  }, [m, level]);

  const count = (n: number | undefined) => (n == null ? '—' : formatCount(n));

  return (
    <div className="flex flex-col gap-5">
      <StatStrip
        items={[
          {
            key: 'divisions',
            label: m.stats.divisions,
            tone: 'green',
            icon: <MapIcon className="text-content-brand" strokeWidth={1.75} />,
            value: count(totals.division),
          },
          {
            key: 'districts',
            label: m.stats.districts,
            tone: 'blue',
            icon: <Building2 className="text-info" strokeWidth={1.75} />,
            value: count(totals.district),
          },
          {
            key: 'thanas',
            label: m.stats.thanas,
            tone: 'indigo',
            icon: <MapPin className="text-violet" strokeWidth={1.75} />,
            value: count(totals.thana),
          },
        ]}
      />

      <Panel className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <PanelTitle>{m.list.title}</PanelTitle>
          <p className="text-body-xs text-content-secondary">{m.list.hint}</p>
        </div>
        <PillTabs
          label={m.tabs.label}
          value={level}
          onChange={changeLevel}
          tabs={[
            { key: 'division', label: m.tabs.division },
            { key: 'district', label: m.tabs.district },
            { key: 'thana', label: m.tabs.thana },
          ]}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <SearchBox value={search} onChange={setSearch} placeholder={m.list.search} />
          {level !== 'division' ? (
            <FilterMenu
              value={division}
              onChange={(v) => {
                setDivision(v);
                setDistrict('');
              }}
              options={divisions.data ?? []}
              placeholder={m.list.division}
              allLabel={m.list.allDivisions}
            />
          ) : null}
          {level === 'thana' ? (
            <FilterMenu
              value={district}
              onChange={setDistrict}
              options={districts.data ?? []}
              placeholder={m.list.district}
              allLabel={m.list.allDistricts}
            />
          ) : null}
          <Button
            variant="outline-brand"
            className="h-[43px] rounded-input"
            onClick={() => setBulkOpen(true)}
          >
            <Upload />
            {m.list.bulk}
          </Button>
          <Button className="h-[43px] rounded-input" onClick={() => openForm(null)}>
            <Plus />
            {m.list.add}
          </Button>
        </div>
        <ListTable
          columns={columns}
          rows={rows}
          getRowId={(r) => String(r.id)}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          isFiltered={!!debounced.trim() || !!division || !!district}
          minWidth={620}
          actions={(r) => (
            <ActionMenu label={interpolate(m.list.rowMenu, { name: r.name })}>
              <ActionEdit label={m.actions.edit} onSelect={() => openForm(r)} />
              <ActionDelete label={m.actions.delete} onSelect={() => setToDelete(r)} />
            </ActionMenu>
          )}
        />
      </Panel>

      <LocationFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        level={level}
        row={editing}
        defaults={{
          division:
            editing && level === 'thana'
              ? (divisions.data?.find((d) => d.label === editing.division_name)?.value ?? division)
              : division,
          district,
        }}
      />
      <BulkUploadModal open={bulkOpen} onOpenChange={setBulkOpen} />
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
