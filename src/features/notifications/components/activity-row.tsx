'use client';

import { Check, Clock, Mail, MailOpen, MapPin, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { DesignIcon, EntityAvatar } from '@/components/ui';
import {
  cn,
  formatClock,
  formatDateMedium,
  interpolate,
  relativeParts,
  type RelativeUnit,
} from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { notificationsMessages } from '../i18n/notifications.messages';
import type { ActivityItem } from '../types';

function KindIcon({ item }: { item: ActivityItem }) {
  const round = 'grid size-11 shrink-0 place-items-center rounded-full';
  const name = item.data.name ?? item.data.team ?? item.data.home ?? '';
  const icons: Partial<Record<ActivityItem['kind'], ReactNode>> = {
    match_completed: (
      <span className={cn(round, 'bg-success text-content-on-brand')}>
        <Check className="size-6" />
      </span>
    ),
    match_ready: (
      <span className={cn(round, 'bg-warning text-content-on-brand')}>
        <Clock className="size-6" />
      </span>
    ),
    match_cancelled: (
      <span className={cn(round, 'bg-danger text-content-on-brand')}>
        <X className="size-6" />
      </span>
    ),
    venue_added: (
      <span className={cn(round, 'bg-success-soft text-content-brand')}>
        <MapPin className="size-6" />
      </span>
    ),
    subscription_expiring: (
      <span className={cn(round, 'bg-gold/25')}>
        <DesignIcon name="crown" size={26} />
      </span>
    ),
    subscription_expired: (
      <span className={cn(round, 'bg-danger-soft')}>
        <DesignIcon name="crown" size={26} />
      </span>
    ),
  };
  return icons[item.kind] ?? <EntityAvatar src={item.data.image} name={name} size={44} />;
}

/**
 * One feed row (Figma "Notifications"): icon, bold title, grey sentence, time on the end, and a
 * read / unread toggle. Unread rows are highlighted with a green dot.
 */
export function ActivityRow({
  item,
  onToggleRead,
  busy,
}: {
  item: ActivityItem;
  onToggleRead: (item: ActivityItem) => void;
  busy?: boolean;
}) {
  const m = useMessages(notificationsMessages);
  const copy =
    item.kind === 'subscription_activated' && item.data.free
      ? m.kinds.subscription_activated_free
      : m.kinds[item.kind];
  const d = item.data;
  const body = interpolate(copy.body, {
    name: d.name || '—',
    team: d.team || '—',
    owner: d.owner || m.admin,
    amount: d.amount ?? 0,
    start: d.starts_at ? formatDateMedium(d.starts_at) : '',
    end: d.ends_at ? formatDateMedium(d.ends_at) : '',
    home: d.home || '—',
    away: d.away || '—',
    date: d.kick_off ? formatDateMedium(d.kick_off) : '',
    time: d.kick_off ? formatClock(d.kick_off) : '',
    hs: d.home_score ?? 0,
    as: d.away_score ?? 0,
    venue: d.venue || '—',
  });
  const ago = relativeParts(item.at);

  return (
    <li
      className={cn(
        'flex items-start gap-2.5 rounded-[12px] p-2.5',
        item.unread ? 'bg-surface-sunken ring-1 ring-line' : 'bg-surface-card',
      )}
    >
      <KindIcon item={item} />
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
        <p className="font-display text-body-xs font-medium text-content-primary">{copy.title}</p>
        <p className="line-clamp-2 font-display text-body-xs text-content-secondary">{body}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 pt-1">
        <span className="flex items-center gap-1.5 font-display text-caption text-content-muted">
          {item.unread ? (
            <span aria-label={m.filters.unread} className="size-2 rounded-full bg-brand-500" />
          ) : null}
          {interpolate(m.ago[ago.unit as RelativeUnit], { count: ago.count })}
        </span>
        <button
          type="button"
          disabled={busy}
          onClick={() => onToggleRead(item)}
          aria-label={item.unread ? m.markRead : m.markUnread}
          title={item.unread ? m.markRead : m.markUnread}
          className="grid size-7 place-items-center rounded-input text-content-secondary outline-none transition-colors hover:bg-surface-muted hover:text-content-primary focus-visible:ring-4 focus-visible:ring-brand-500/25 disabled:opacity-50"
        >
          {item.unread ? (
            <MailOpen aria-hidden className="size-4" />
          ) : (
            <Mail aria-hidden className="size-4" />
          )}
        </button>
      </div>
    </li>
  );
}
