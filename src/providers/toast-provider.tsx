'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

import { useLocale } from './i18n-provider';

/** App-wide toasts (sonner), following the active theme and text direction. */
export function ToastProvider() {
  const { resolvedTheme } = useTheme();
  const { dir } = useLocale();
  return (
    <Toaster
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      dir={dir}
      position={dir === 'rtl' ? 'bottom-left' : 'bottom-right'}
      richColors
    />
  );
}
