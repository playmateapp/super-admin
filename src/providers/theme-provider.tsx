'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * Light / dark theme. Writes `data-theme` on <html> (the attribute the design tokens in
 * globals.css key off) and remembers the choice under `playmate-theme`.
 */
export const THEME_STORAGE_KEY = 'playmate-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      storageKey={THEME_STORAGE_KEY}
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
