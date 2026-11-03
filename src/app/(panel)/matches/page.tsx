import type { Metadata } from 'next';

import { MatchesScreen } from '@/features/matches';

export const metadata: Metadata = { title: 'Matches' };

export default function Page() {
  return <MatchesScreen />;
}
