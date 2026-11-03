'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { adminNav, isNavActive } from './admin-nav';
import { layoutMessages } from './layout.messages';

/**
 * Sidebar link list (Figma "Frame 26080876"): 20px icons, 16px Outfit labels, the active item
 * on a #E7F0EB pill in PlayMate green. `footer` (Logout) sits at the bottom. Rendered twice by
 * AdminShell: fixed on desktop and inside the drawer on small screens.
 */
export function AdminSidebar({
  footer,
  onNavigate,
}: {
  footer?: ReactNode;
  onNavigate?: () => void;
}) {
  const m = useMessages(layoutMessages).nav;
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between gap-6 px-5 pb-5 pt-2.5">
      <nav aria-label={m.label} className="flex flex-col gap-1">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-tile px-3 py-2.5 font-display text-heading-sm transition-colors',
                active
                  ? 'bg-surface-tint font-medium text-content-brand'
                  : 'text-content-nav hover:bg-surface-muted hover:text-content-primary',
              )}
            >
              <Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
              {m[active && item.crumbKey === 'allUsers' ? 'allUsers' : item.labelKey]}
            </Link>
          );
        })}
      </nav>
      {footer}
    </div>
  );
}
