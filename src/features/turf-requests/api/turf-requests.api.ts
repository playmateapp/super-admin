import { rpc } from '@/lib/api/supabase';

import type { TurfRequest, TurfRequestsParams, TurfRequestsResponse } from '../types';

/** Turf request functions (Supabase RPCs, admin-only). */

/** rpc admin_turf_requests — paged, filtered list + status totals. */
export const getTurfRequests = (p: TurfRequestsParams) =>
  rpc<TurfRequestsResponse>('admin_turf_requests', {
    p_search: p.search ?? '',
    p_status: p.status ?? '',
    p_page: p.page,
    p_page_size: p.pageSize,
  });

/** rpc admin_turf_request — one request. */
export const getTurfRequest = (id: string) => rpc<TurfRequest>('admin_turf_request', { p_id: id });

/** rpc admin_approve_turf_request — publishes it as a venue; returns the venue id. */
export const approveTurfRequest = (id: string) =>
  rpc<string>('admin_approve_turf_request', { p_id: id });

/** rpc admin_reject_turf_request — the reason is what the owner reads in the app. */
export const rejectTurfRequest = (id: string, reason: string) =>
  rpc<void>('admin_reject_turf_request', { p_id: id, p_reason: reason });

/** rpc admin_delete_turf_request — the owner can send a new request afterwards. */
export const deleteTurfRequest = (id: string) =>
  rpc<void>('admin_delete_turf_request', { p_id: id });
