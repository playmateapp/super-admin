'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { StatusState } from '@/components/ui';
import { useAuthStore } from '@/features/auth';

/**
 * Protects a whole route group (used once in `(panel)/layout.tsx`). Guests are sent to
 * `/login?next=<current path>`; nothing renders until the stored session has been read.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const initialize = useAuthStore((s) => s.initialize);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(initialize, [initialize]);
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  if (!isInitialized || !isAuthenticated) {
    return <StatusState variant="loading" title="" className="min-h-screen justify-center" />;
  }
  return <>{children}</>;
}
