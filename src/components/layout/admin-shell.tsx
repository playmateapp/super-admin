'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { BrandLogo, LocaleSwitch, ThemeToggle } from '@/components/shared';
import { Button } from '@/components/ui';
import { useMessages } from '@/providers/i18n-provider';

import { activeNavLink } from './admin-nav';
import { AdminSidebar } from './admin-sidebar';
import { layoutMessages } from './layout.messages';

/**
 * Frame of every signed-in admin page (Figma admin frames, 1600px): 280px white sidebar with
 * the logo row on top, a 71px top bar with the "Home > Page" breadcrumb, and the page.
 * `topbarEnd` (notification bell + account) and `sidebarFooter` (Logout) are passed in by the
 * route layout because layout components never import features. Below `lg` the sidebar is a
 * drawer; theme + language switches move into it below `sm`.
 */
export function AdminShell({
  topbarEnd,
  sidebarFooter,
  children,
}: {
  topbarEnd: ReactNode;
  sidebarFooter: ReactNode;
  children: ReactNode;
}) {
  const m = useMessages(layoutMessages);
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const current = activeNavLink(pathname);

  useEffect(() => setDrawerOpen(false), [pathname]);

  const logoRow = (
    <div className="flex h-topbar shrink-0 items-center border-b border-line px-5">
      <BrandLogo size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-page">
      <aside
        data-print-hide
        className="fixed inset-y-0 start-0 z-30 hidden w-sidebar flex-col bg-surface-card lg:flex"
      >
        {logoRow}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <AdminSidebar footer={sidebarFooter} />
        </div>
      </aside>

      <div className="lg:ps-sidebar">
        <header
          data-print-hide
          className="sticky top-0 z-20 flex h-topbar items-center gap-3 border-b border-line bg-surface-card px-4 sm:px-6 lg:px-10"
        >
          <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Dialog.Trigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={m.topbar.openMenu}
                className="lg:hidden"
              >
                <Menu />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-navy/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 start-0 z-50 flex w-sidebar max-w-[85vw] flex-col bg-surface-card shadow-float data-[state=open]:animate-in data-[state=open]:slide-in-from-left lg:hidden"
              >
                <Dialog.Title className="sr-only">{m.topbar.openMenu}</Dialog.Title>
                <div className="flex h-topbar shrink-0 items-center justify-between border-b border-line px-5">
                  <BrandLogo size={40} />
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="icon" aria-label={m.topbar.closeMenu}>
                      <X />
                    </Button>
                  </Dialog.Close>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-3 sm:hidden">
                  <LocaleSwitch />
                  <ThemeToggle />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <AdminSidebar footer={sidebarFooter} onNavigate={() => setDrawerOpen(false)} />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <nav aria-label={m.topbar.breadcrumb} className="min-w-0">
            <ol className="flex items-center font-display text-heading-sm">
              <li className="hidden items-center sm:flex">
                <Link href="/dashboard" className="text-content-muted hover:text-content-primary">
                  {m.topbar.home}
                </Link>
                <ChevronRight aria-hidden className="size-5 text-content-muted rtl:-scale-x-100" />
              </li>
              {current ? (
                <li aria-current="page" className="truncate font-medium text-content-brand">
                  {m.nav[current.crumbKey ?? current.labelKey]}
                </li>
              ) : null}
            </ol>
          </nav>

          <div className="ms-auto flex items-center gap-2 sm:gap-3">
            <LocaleSwitch className="hidden sm:flex" />
            <ThemeToggle className="hidden sm:inline-flex" />
            {topbarEnd}
          </div>
        </header>

        <main className="px-4 pb-10 pt-5 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
