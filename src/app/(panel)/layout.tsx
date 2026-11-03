import type { ReactNode } from 'react';

import { AdminShell } from '@/components/layout';
import { AuthGuard } from '@/components/shared';
import { AccountMenu, LogoutButton } from '@/features/auth';
import { NotificationBell } from '@/features/notifications';

/**
 * Layout-only route group (not a module, not part of the URL): every signed-in page shares the
 * guard and the sidebar/top-bar frame. Guests are sent to `/login`.
 */
export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell
        topbarEnd={
          <>
            <NotificationBell />
            <AccountMenu />
          </>
        }
        sidebarFooter={<LogoutButton />}
      >
        {children}
      </AdminShell>
    </AuthGuard>
  );
}
