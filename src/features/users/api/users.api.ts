import { rpc } from '@/lib/api/supabase';

import type { UserDetail, UsersParams, UsersResponse } from '../types';

/** Users request functions (Supabase RPCs, admin-only). */

/** rpc admin_users — paged, filtered player list + header totals. */
export const getUsers = (p: UsersParams) =>
  rpc<UsersResponse>('admin_users', {
    p_search: p.search ?? '',
    p_type: p.type ?? '',
    p_status: p.status ?? '',
    p_page: p.page,
    p_page_size: p.pageSize,
  });

/** rpc admin_user — one player with stats, photos and recent matches. */
export const getUser = (id: string) => rpc<UserDetail>('admin_user', { p_id: id });

/** rpc admin_set_user_blocked — blocks (read-only + notified, can appeal) or restores a player. */
export const setUserBlocked = (id: string, blocked: boolean) =>
  rpc<void>('admin_set_user_blocked', { p_user: id, p_blocked: blocked });
