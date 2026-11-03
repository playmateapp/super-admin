'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AlertModal } from '@/components/ui';
import { useMessages } from '@/providers/i18n-provider';

import { useLogout } from '../hooks/mutations';
import { authMessages } from '../i18n/auth.messages';

/** The "Log Out?" confirmation (Figma frame 18483:11338). */
export function LogoutDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const m = useMessages(authMessages).logout;
  const router = useRouter();
  const logout = useLogout();
  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      icon={<LogOut />}
      title={m.title}
      message={m.message}
      cancelLabel={m.cancel}
      confirmLabel={m.confirm}
      isPending={logout.isPending}
      onConfirm={() =>
        logout.mutate(undefined, {
          onSettled: () => {
            onOpenChange(false);
            router.replace('/login');
          },
        })
      }
    />
  );
}

/** Red "Logout" item at the bottom of the sidebar; asks for confirmation first. */
export function LogoutButton() {
  const m = useMessages(authMessages).account;
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-1.5 rounded-tile px-3 py-2.5 font-display text-heading-sm text-danger transition-colors hover:bg-danger-soft"
      >
        <LogOut aria-hidden className="size-5" strokeWidth={1.75} />
        {m.logout}
      </button>
      <LogoutDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
