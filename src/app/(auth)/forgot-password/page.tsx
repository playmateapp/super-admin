import type { Metadata } from 'next';

import { ForgotPasswordScreen } from '@/features/auth';

export const metadata: Metadata = { title: 'Forgot password' };



//test
export default function Page() {
  return <ForgotPasswordScreen />;
}
