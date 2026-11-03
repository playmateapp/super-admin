import { rpc } from '@/lib/api/supabase';

import type { SubscriptionDetail, SubscriptionsParams, SubscriptionsResponse } from '../types';

/** Subscriptions request functions (Supabase RPCs, admin-only, read-only). */

/** rpc admin_subscriptions — paged, filtered list + header totals. */
export const getSubscriptions = (p: SubscriptionsParams) =>
  rpc<SubscriptionsResponse>('admin_subscriptions', {
    p_search: p.search ?? '',
    p_status: p.status ?? '',
    p_from: p.from || null,
    p_to: p.to || null,
    p_page: p.page,
    p_page_size: p.pageSize,
  });

/** rpc admin_subscription — one subscription with payment, owner and team. */
export const getSubscription = (id: string) =>
  rpc<SubscriptionDetail>('admin_subscription', { p_id: id });
