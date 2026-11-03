'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';

import { interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useActivity } from '../hooks/queries';
import { notificationsMessages } from '../i18n/notifications.messages';

/** Top-bar bell (Figma: grey 40px tile, red "99+" badge) linking to `/notifications`. */
export function NotificationBell() {
  const m = useMessages(notificationsMessages);
  const { data } = useActivity();
  const count = data?.unread ?? 0;
  return (
    <Link
      href="/notifications"
      aria-label={count ? interpolate(m.bell, { count }) : m.bellNone}
      className="relative grid size-10 place-items-center rounded-tile bg-surface-muted text-content-primary outline-none hover:bg-line focus-visible:ring-4 focus-visible:ring-brand-500/25"
    >
      <Bell aria-hidden className="size-5" strokeWidth={1.75} />
      {count ? (
        <span className="absolute -top-0.5 end-0.5 grid h-3.5 min-w-5 place-items-center rounded-[11px] bg-danger px-0.5 text-[8px] font-semibold leading-none text-content-on-brand">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}
