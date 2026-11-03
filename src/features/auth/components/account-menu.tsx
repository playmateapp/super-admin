'use client';

import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EntityAvatar,
} from '@/components/ui';
import { useMessages } from '@/providers/i18n-provider';

import { useProfile } from '../hooks/queries';
import { authMessages } from '../i18n/auth.messages';
import { LogoutDialog } from './logout-button';

/** Top-bar avatar (Figma: 40px round picture) with a menu: who is signed in, Settings, Logout. */
export function AccountMenu() {
  const m = useMessages(authMessages).account;
  const { data: admin } = useProfile();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const name = admin?.full_name || 'Admin';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={m.menu}
          className="rounded-full outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
        >
          <EntityAvatar name={name} size={40} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[220px]">
          <div className="px-3 py-2">
            <p className="text-caption text-content-secondary">{m.signedInAs}</p>
            <p className="truncate text-body-xs font-medium text-content-primary">{name}</p>
            {admin?.phone ? (
              <p dir="ltr" className="text-caption text-content-muted">
                +{admin.phone}
              </p>
            ) : null}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings />
              {m.settings}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem tone="danger" onSelect={() => setConfirmOpen(true)}>
            <LogOut />
            {m.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutDialog open={confirmOpen} onOpenChange={setConfirmOpen} />
    </>
  );
}
