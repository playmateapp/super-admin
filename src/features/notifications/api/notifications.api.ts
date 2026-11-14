import { rpc } from '@/lib/api/supabase';

import type { ActivityFeed, ActivityFilters } from '../types';

/**
 * rpc admin_activity — newest platform events (filtered by date / read state) plus the overall
 * unread count for the bell.
 */
export const getActivity = ({
  from = null,
  to = null,
  status = '',
  limit = 60,
}: ActivityFilters = {}) =>
  rpc<ActivityFeed>('admin_activity', {
    p_limit: limit,
    p_from: from || null,
    p_to: to || null,
    p_status: status,
  });

/** rpc admin_set_activity_read — mark one item read or unread for this admin. */
export const setActivityRead = (input: { kind: string; ref: string; read: boolean }) =>
  rpc<void>('admin_set_activity_read', {
    p_kind: input.kind,
    p_ref: input.ref,
    p_read: input.read,
  });

/** rpc admin_mark_all_activity — mark every item read (`true`) or unread (`false`). */
export const markAllActivity = (read: boolean) =>
  rpc<void>('admin_mark_all_activity', { p_read: read });
