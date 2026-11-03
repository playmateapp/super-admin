import type { Metadata } from 'next';

import { VenuesScreen } from '@/features/venues';

export const metadata: Metadata = { title: 'Venues' };

export default function Page() {
  return <VenuesScreen />;
}
