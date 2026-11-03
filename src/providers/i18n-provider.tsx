'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  LOCALE_COOKIE,
  LOCALE_DIR,
  type Direction,
  type Locale,
  type LocalizedMessages,
} from '@/lib/i18n';

/**
 * Holds the active locale on the client. Initial value comes from the server (cookie),
 * so SSR markup already has the right language and direction. `setLocale` updates the
 * cookie and <html lang/dir> in place — no reload.
 */

interface I18nContextValue {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = LOCALE_DIR[next];
  }, []);

  const value = useMemo(
    () => ({ locale, dir: LOCALE_DIR[locale], setLocale }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Active locale, direction and setter. */
export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useLocale must be used inside <I18nProvider>');
  return ctx;
}

/** Pick the active language's messages from a feature's `defineMessages(...)` bundle. */
export function useMessages<T>(bundle: LocalizedMessages<T>): T {
  return bundle[useLocale().locale];
}
