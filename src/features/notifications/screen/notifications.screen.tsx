'use client';

import { CheckCheck, Mail } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button, DateRangeMenu, FilterMenu, StatusState, type DateRange } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { ActivityRow } from '../components/activity-row';
import { useMarkAllActivity, useSetActivityRead } from '../hooks/mutations';
import { useActivity } from '../hooks/queries';
import { notificationsMessages } from '../i18n/notifications.messages';
import type { ActivityItem, ActivityPeriod, ActivityReadStatus } from '../types';
import { periodWindow } from '../utils/period';

const PAGE_LIMIT = 200;

/**
 * NotificationsScreen — `/notifications` (Figma "Notifications"): the platform activity feed.
 * Filters by date (today / yesterday / last 7 days / custom range) and read state; each row can
 * be marked read or unread, and the toolbar marks everything read or unread. Opening the page
 * no longer marks everything seen — the admin decides.
 */
export function NotificationsScreen() {
  const m = useMessages(notificationsMessages);
  const c = useMessages(commonMessages);

  const [period, setPeriod] = useState<ActivityPeriod>('');
  const [range, setRange] = useState<DateRange>({ from: '', to: '' });
  const [status, setStatus] = useState<ActivityReadStatus>('');

  // Recomputed when the filters change; "today" rolls over on the next filter change or reload.
  const filters = useMemo(
    () => ({ ...periodWindow(period, range), status, limit: PAGE_LIMIT }),
    [period, range, status],
  );
  const { data, isLoading, isError, refetch } = useActivity(filters);

  const setRead = useSetActivityRead();
  const markAll = useMarkAllActivity();
  const filtered = period !== '' || status !== '';

  const toggleRead = (item: ActivityItem) =>
    setRead.mutate(
      { kind: item.kind, ref: item.ref, read: item.unread },
      { onError: () => toast.error(m.actionFailed) },
    );

  const markEverything = (read: boolean) =>
    markAll.mutate(read, {
      onSuccess: () => toast.success(read ? m.allMarkedRead : m.allMarkedUnread),
      onError: () => toast.error(m.actionFailed),
    });

  const busyKey = setRead.isPending ? `${setRead.variables?.kind}-${setRead.variables?.ref}` : null;

  return (
    <div className="flex max-w-[622px] flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-heading-md font-semibold text-content-primary">
          {m.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={markAll.isPending || !data?.unread}
            onClick={() => markEverything(true)}
          >
            <CheckCheck aria-hidden />
            {m.markAllRead}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={markAll.isPending}
            onClick={() => markEverything(false)}
          >
            <Mail aria-hidden />
            {m.markAllUnread}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <FilterMenu
          className="sm:w-[160px]"
          value={period}
          onChange={(v) => setPeriod(v as ActivityPeriod)}
          placeholder={m.filters.period}
          allLabel={m.filters.anyTime}
          options={[
            { value: 'today', label: m.filters.today },
            { value: 'yesterday', label: m.filters.yesterday },
            { value: 'week', label: m.filters.week },
            { value: 'custom', label: m.filters.custom },
          ]}
        />
        {period === 'custom' ? (
          <DateRangeMenu
            value={range}
            onChange={setRange}
            placeholder={m.filters.range}
            labels={{
              from: m.filters.from,
              to: m.filters.to,
              clear: m.filters.clear,
              joiner: m.filters.joiner,
            }}
          />
        ) : null}
        <FilterMenu
          className="sm:w-[140px]"
          value={status}
          onChange={(v) => setStatus(v as ActivityReadStatus)}
          placeholder={m.filters.status}
          allLabel={m.filters.allStatuses}
          options={[
            { value: 'unread', label: m.filters.unread },
            { value: 'read', label: m.filters.read },
          ]}
        />
      </div>

      {isLoading ? (
        <StatusState variant="loading" title={c.loading} />
      ) : isError ? (
        <StatusState
          variant="error"
          title={c.loadError}
          actions={
            <button type="button" onClick={() => refetch()} className="text-content-link">
              {c.retry}
            </button>
          }
        />
      ) : data?.items.length ? (
        <>
          <ul className="flex flex-col gap-2">
            {data.items.map((item) => {
              const key = `${item.kind}-${item.ref}`;
              return (
                <ActivityRow
                  key={key}
                  item={item}
                  onToggleRead={toggleRead}
                  busy={busyKey === key}
                />
              );
            })}
          </ul>
          {data.total > data.items.length ? (
            <p className="text-center font-display text-caption text-content-muted">
              {interpolate(m.showing, { shown: data.items.length, total: data.total })}
            </p>
          ) : null}
        </>
      ) : (
        <div className="rounded-card bg-surface-card">
          <StatusState
            variant="empty"
            title={filtered ? m.noMatch : m.empty}
            description={filtered ? m.noMatchHint : m.emptyHint}
          />
        </div>
      )}
    </div>
  );
}
