import { rpc } from '@/lib/api/supabase';

import type { ActivityFeed } from '../types';

/** rpc admin_activity — newest platform events + how many arrived since the admin last looked. */
export const getActivity = (limit = 60) => rpc<ActivityFeed>('admin_activity', { p_limit: limit });

/** rpc admin_mark_activity_seen — resets the bell counter. */
export const markActivitySeen = () => rpc<void>('admin_mark_activity_seen');
