'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import { getSubscription, getSubscriptions } from '../api/subscriptions.api';
import type { SubscriptionsParams } from '../types';

export function useSubscriptions(params: SubscriptionsParams) {
  return useQuery({
    queryKey: queryKeys.subscriptions.list(params),
    queryFn: () => getSubscriptions(params),
    placeholderData: keepPreviousData,
  });
}

export function useSubscription(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.subscriptions.detail(id ?? ''),
    queryFn: () => getSubscription(id as string),
    enabled: !!id,
  });
}
