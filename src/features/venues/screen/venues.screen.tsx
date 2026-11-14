'use client';

import { MapPin, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  ActionEdit,
  ActionMenu,
  ActionToggle,
  ActionView,
  Button,
  FilterMenu,
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
import { useDistricts, useDivisions, useThanas } from '@/lib/hooks/use-locations';
import { useListState } from '@/lib/hooks/use-list-state';
import { commonMessages } from '@/lib/i18n';
import { formatCount, getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { VenueDetailPanel } from '../components/venue-detail-panel';
import { VenueFormModal } from '../components/venue-form-modal';
import { useSetVenueStatus } from '../hooks/mutations';
import { useVenues } from '../hooks/queries';
import { venuesMessages } from '../i18n/venues.messages';
import type { Venue } from '../types';

const PAGE_SIZE = 9;

/**
 * VenuesScreen — `/venues` (Figma "All Venues"): totals, the venue (= turf) list with search,
 * Division / District / Thana + status filters and "+ Add Venue", the detail panel and the
 * Add / Edit modal.
 */
export function VenuesScreen() {
  const m = useMessages(venuesMessages);
  const c = useMessages(commonMessages);
  const list = useListState({ division: '', district: '', thana: '', status: '' });
  const { data: divisions } = useDivisions();
  const { data: districts } = useDistricts(
    list.filters.division ? Number(list.filters.division) : null,
  );
  const { data: thanas } = useThanas(list.filters.district ? Number(list.filters.district) : null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Venue | null>(null);
  const setStatus = useSetVenueStatus();

  const params = useMemo(
    () => ({
      search: list.debouncedSearch,
      status: list.filters.status,
      divisionId: list.filters.division ? Number(list.filters.division) : null,
      districtId: list.filters.district ? Number(list.filters.district) : null,
      thanaId: list.filters.thana ? Number(list.filters.thana) : null,
      page: list.page,
      pageSize: PAGE_SIZE,
    }),
    [list.debouncedSearch, list.filters, list.page],
  );
  const { data, isLoading, isError, refetch } = useVenues(params);
  const rows = data?.rows;
  const selectedId = list.selectedId ?? rows?.[0]?.id ?? null;

  const openForm = (venue: Venue | null) => {
    setEditing(venue);
    setFormOpen(true);
  };

  const toggleStatus = (venue: Venue) => {
    const next = venue.status === 'active' ? 'inactive' : 'active';
    setStatus.mutate(
      { id: venue.id, status: next },
      {
        onSuccess: () =>
          toast.success(
            interpolate(next === 'inactive' ? m.actions.madeInactive : m.actions.madeActive, {
              name: venue.name,
            }),
          ),
        onError: (err) => toast.error(getErrorMessage(err, c.actionFailed)),
      },
    );
  };

  const columns = useMemo<ListColumn<Venue>[]>(
    () => [
      {
        key: 'venue',
        header: m.list.venue,
        cell: (v) => (
          <span className="flex items-center gap-2 text-start">
            {v.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL
              <img
                src={v.photo_url}
                alt=""
                className="h-10 w-[54px] shrink-0 rounded-[4px] object-cover"
              />
            ) : (
              <span className="grid h-10 w-[54px] shrink-0 place-items-center rounded-[4px] bg-surface-muted">
                <MapPin aria-hidden className="size-5 text-content-muted" />
              </span>
            )}
            <span className="line-clamp-2 font-display text-body-xs">{v.name}</span>
          </span>
        ),
      },
      {
        key: 'location',
        header: m.list.location,
        cell: (v) => (
          <span className="line-clamp-2 font-display text-body-xs">
            {[v.thana, v.district].filter(Boolean).join(', ') || v.address || c.none}
          </span>
        ),
      },
      {
        key: 'status',
        header: m.list.status,
        className: 'w-[120px] text-center',
        cell: (v) => <StatusTag status={v.status} className="w-full" />,
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
            icon: <MapPin className="text-info" strokeWidth={1.75} />,
            value: data ? formatCount(data.stats.total) : '—',
          },
          {
            key: 'active',
            label: m.stats.active,
            tone: 'indigo',
            icon: <MapPin className="text-violet" strokeWidth={1.75} />,
            value: data ? formatCount(data.stats.active) : '—',
          },
          {
            key: 'inactive',
            label: m.stats.inactive,
            tone: 'red',
            icon: <MapPin className="text-danger" strokeWidth={1.75} />,
            value: data ? formatCount(data.stats.inactive) : '—',
          },
        ]}
      />

      <SplitLayout
        list={
          <Panel className="flex flex-col gap-4 p-4">
            <PanelTitle>{m.list.title}</PanelTitle>
            {/* Search + Add on top, the four filters on their own row (they don't fit beside it). */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 md:gap-4">
                <SearchBox
                  value={list.search}
                  onChange={list.setSearch}
                  placeholder={m.list.search}
                />
                <Button className="h-[43px] shrink-0 rounded-input" onClick={() => openForm(null)}>
                  <Plus />
                  {m.list.add}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <FilterMenu
                  className="w-full"
                  value={list.filters.division}
                  onChange={(v) => {
                    list.setFilter('division', v);
                    list.setFilter('district', '');
                    list.setFilter('thana', '');
                  }}
                  placeholder={m.list.divisionFilter}
                  allLabel={m.list.divisionFilter}
                  options={(divisions ?? []).map((d) => ({ value: String(d.id), label: d.name }))}
                />
                <FilterMenu
                  className="w-full"
                  value={list.filters.district}
                  onChange={(v) => {
                    list.setFilter('district', v);
                    list.setFilter('thana', '');
                  }}
                  placeholder={m.list.districtFilter}
                  allLabel={m.list.districtFilter}
                  options={(districts ?? []).map((d) => ({ value: String(d.id), label: d.name }))}
                />
                <FilterMenu
                  className="w-full"
                  value={list.filters.thana}
                  onChange={(v) => list.setFilter('thana', v)}
                  placeholder={m.list.thanaFilter}
                  allLabel={m.list.thanaFilter}
                  options={(thanas ?? []).map((t) => ({ value: String(t.id), label: t.name }))}
                />
                <FilterMenu
                  className="w-full"
                  value={list.filters.status}
                  onChange={(v) => list.setFilter('status', v)}
                  placeholder={m.list.statusFilter}
                  allLabel={m.list.allStatuses}
                  options={(['active', 'inactive'] as const).map((s) => ({
                    value: s,
                    label: c.status[s],
                  }))}
                />
              </div>
            </div>
            <ListTable
              columns={columns}
              rows={rows}
              getRowId={(v) => v.id}
              selectedId={selectedId}
              onSelect={(v) => list.setSelectedId(v.id)}
              isLoading={isLoading}
              isError={isError}
              onRetry={refetch}
              isFiltered={list.isFiltered}
              actions={(v) => (
                <ActionMenu label={interpolate(m.list.rowMenu, { name: v.name })}>
                  <ActionView
                    filled
                    label={m.actions.view}
                    onSelect={() => list.setSelectedId(v.id)}
                  />
                  <ActionEdit label={m.actions.edit} onSelect={() => openForm(v)} />
                  <ActionToggle
                    label={m.actions.inactive}
                    checked={v.status === 'inactive'}
                    onSelect={() => toggleStatus(v)}
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
        detail={
          <VenueDetailPanel venueId={selectedId} onEdit={openForm} onToggleStatus={toggleStatus} />
        }
      />

      <VenueFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        venue={editing}
        onSaved={(id) => list.setSelectedId(id)}
      />
    </div>
  );
}
