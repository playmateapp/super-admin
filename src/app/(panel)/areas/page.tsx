import type { Metadata } from 'next';

import { AreasScreen } from '@/features/areas';

export const metadata: Metadata = { title: 'Areas' };

export default function Page() {
  return <AreasScreen />;
}
