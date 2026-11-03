import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { env } from '@/lib/config/env';
import { LOCALE_DIR } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n/get-locale';
import { cn } from '@/lib/utils';
import { Providers } from '@/providers';

import { bengali, inter, outfit } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: 'PlayMate Admin', template: '%s · PlayMate Admin' },
  description: 'PlayMate super admin panel.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F9F8' },
    { media: '(prefers-color-scheme: dark)', color: '#0D110F' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = getServerLocale();
  return (
    <html
      lang={locale}
      dir={LOCALE_DIR[locale]}
      data-theme="light"
      suppressHydrationWarning
      className={cn(inter.variable, outfit.variable, bengali.variable)}
    >
      <body>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
