import type { Metadata } from 'next';

import { TurfRequestsScreen } from '@/features/turf-requests';

export const metadata: Metadata = { title: 'Turf Requests' };

export default function Page() {
  return <TurfRequestsScreen />;
}
