import type { Metadata } from 'next';

import { SubscriptionsScreen } from '@/features/subscriptions';

export const metadata: Metadata = { title: 'Subscriptions' };

export default function Page() {
  return <SubscriptionsScreen />;
}
