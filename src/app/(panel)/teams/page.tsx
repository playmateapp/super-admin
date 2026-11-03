import type { Metadata } from 'next';

import { TeamsScreen } from '@/features/teams';

export const metadata: Metadata = { title: 'Teams' };

export default function Page() {
  return <TeamsScreen />;
}
