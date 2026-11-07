import type { Metadata } from 'next';

import { AppealsScreen } from '@/features/appeals';

export const metadata: Metadata = { title: 'Appeals' };

export default function Page() {
  return <AppealsScreen />;
}
