import type { Metadata } from 'next';

import { SettingsScreen } from '@/features/auth';

export const metadata: Metadata = { title: 'Settings' };

export default function Page() {
  return <SettingsScreen />;
}
