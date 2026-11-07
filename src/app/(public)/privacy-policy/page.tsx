import type { Metadata } from 'next';

import { PrivacyPolicyScreen } from '@/features/legal';

export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy · PlayMate' },
  description: 'How the PlayMate app collects, uses and protects your information.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PrivacyPolicyScreen />;
}
