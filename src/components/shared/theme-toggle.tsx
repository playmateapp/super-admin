'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui';
import { useIsHydrated } from '@/lib/hooks/use-is-hydrated';
import { useMessages } from '@/providers/i18n-provider';

import { sharedMessages } from './shared.messages';

/** Light/dark switch. Shows a sun in dark mode and a moon in light mode. */
export function ThemeToggle({ className }: { className?: string }) {
  const m = useMessages(sharedMessages);
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useIsHydrated();
  const isDark = hydrated && resolvedTheme === 'dark';
  const label = isDark ? m.toLight : m.toDark;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className={className}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
