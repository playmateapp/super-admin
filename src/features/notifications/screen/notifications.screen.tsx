'use client';

import { useEffect, useRef } from 'react';

import { StatusState } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { useMessages } from '@/providers/i18n-provider';

import { ActivityRow } from '../components/activity-row';
import { useMarkActivitySeen } from '../hooks/mutations';
import { useActivity } from '../hooks/queries';
import { notificationsMessages } from '../i18n/notifications.messages';

/**
 * NotificationsScreen — `/notifications` (Figma "Notifications"): the platform activity feed.
 * Opening the page marks everything as seen (the bell resets); rows that were new keep their
 * highlight until the admin leaves.
 */
export function NotificationsScreen() {
  const m = useMessages(notificationsMessages);
  const c = useMessages(commonMessages);
  const { data, isLoading, isError, refetch } = useActivity();
  const markSeen = useMarkActivitySeen();
  const marked = useRef(false);

  useEffect(() => {
    if (data && data.unread > 0 && !marked.current) {
      marked.current = true;
      markSeen.mutate();
    }
  }, [data, markSeen]);

  return (
    <div className="flex max-w-[622px] flex-col gap-2.5">
      <h1 className="font-display text-heading-md font-semibold text-content-primary">{m.title}</h1>
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
        <ul className="flex flex-col gap-2">
          {data.items.map((item) => (
            <ActivityRow key={`${item.kind}-${item.ref}`} item={item} />
          ))}
        </ul>
      ) : (
        <div className="rounded-card bg-surface-card">
          <StatusState variant="empty" title={m.empty} description={m.emptyHint} />
        </div>
      )}
    </div>
  );
}
