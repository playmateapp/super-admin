'use client';

import type { ReactNode } from 'react';

import type { Locale } from '@/lib/i18n';

import { I18nProvider } from './i18n-provider';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './toast-provider';

/** Provider stack used by the root layout: Query > Theme > I18n > (app + toasts). */
export function Providers({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <I18nProvider initialLocale={locale}>
          {children}
          <ToastProvider />
        </I18nProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export { useLocale, useMessages } from './i18n-provider';
export { THEME_STORAGE_KEY } from './theme-provider';
