'use client';

import { PieChart, User, Users } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { BrandLogo, LocaleSwitch, ThemeToggle } from '@/components/shared';
import { useMessages } from '@/providers/i18n-provider';

import { layoutMessages } from './layout.messages';

/** Icons of the five feature rows on the photo side (two are Figma exports). */
const featureIcons: ReactNode[] = [
  <User key="user" className="size-6 text-white" strokeWidth={1.75} />,
  <Users key="users" className="size-6 text-white" strokeWidth={1.75} />,
  <Image key="ball" src="/icons/login-ball.svg" alt="" width={24} height={24} unoptimized />,
  <Image key="crown" src="/icons/login-crown.svg" alt="" width={24} height={24} unoptimized />,
  <PieChart key="pie" className="size-6 text-white" strokeWidth={1.75} />,
];

/**
 * Frame for the signed-out routes (Figma "Login" and the password-reset frames): stadium photo
 * with the PlayMate pitch on the start half, the form card centred on the end half. Below `lg`
 * only the form shows. Theme + language switches sit top-end.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const m = useMessages(layoutMessages).authShell;

  return (
    <div className="flex min-h-screen bg-surface-page">
      <section
        aria-hidden
        className="relative hidden w-[53%] shrink-0 overflow-hidden bg-navy lg:block"
      >
        <Image
          src="/brand/login-bg.png"
          alt=""
          fill
          priority
          sizes="53vw"
          className="object-cover"
        />
        <div className="auth-photo-overlay absolute inset-0" />
        <div className="absolute inset-y-0 start-[11%] flex w-[min(481px,78%)] flex-col justify-center gap-6 text-white">
          <BrandLogo size={55} variant="admin" tone="light" href={null} />
          <div className="flex flex-col gap-1.5">
            <p className="font-display text-[28px] font-bold leading-[1.5]">{m.heroTitle}</p>
            <p className="font-display text-heading-sm">{m.heroText}</p>
          </div>
          <ul className="flex flex-col gap-4">
            {m.features.map((f, i) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="grid shrink-0 place-items-center rounded-[8px] bg-success/25 p-2.5 opacity-80">
                  {featureIcons[i]}
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="font-display text-heading-md font-semibold">{f.title}</span>
                  <span className="font-display text-heading-sm">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <main className="relative flex min-w-0 flex-1 items-center justify-center px-4 py-16">
        <div className="absolute end-4 top-4 flex items-center gap-2 sm:end-6 sm:top-6">
          <LocaleSwitch />
          <ThemeToggle />
        </div>
        <div className="flex w-full max-w-[457px] flex-col items-center gap-6 rounded-card bg-surface-card p-4">
          <BrandLogo size={64} variant="admin" href={null} />
          {children}
        </div>
      </main>
    </div>
  );
}
