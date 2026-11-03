'use client';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { sharedMessages } from './shared.messages';

/**
 * PlayMate logo (Figma "Logo" sidebar lockup): the play-button mark + "Play**Mate**" wordmark
 * with the tagline, or "Super Admin Panel" on the auth screens (`variant="admin"`).
 * `tone="light"` is for the dark photo side of the sign-in page.
 */
export function BrandLogo({
  size = 40,
  href = '/dashboard',
  variant = 'tagline',
  tone = 'default',
  className,
}: {
  size?: number;
  href?: string | null;
  variant?: 'tagline' | 'admin';
  tone?: 'default' | 'light';
  className?: string;
}) {
  const m = useMessages(sharedMessages);
  const big = variant === 'admin';
  const mark = (
    <span className="inline-flex items-center gap-1.5">
      <Image
        src={tone === 'light' ? '/brand/logo-mark-dark.png' : '/brand/logo-mark.png'}
        alt=""
        width={size}
        height={size}
        priority
        className="shrink-0"
      />
      <span className="flex flex-col gap-1">
        <span
          className={cn(
            'font-display font-extrabold leading-none tracking-[-0.03em]',
            big ? 'text-[28px]' : 'text-[24px]',
          )}
        >
          <span className={tone === 'light' ? 'text-white' : 'text-content-primary'}>Play</span>
          <span className="text-brand-bright">Mate</span>
        </span>
        {big ? (
          <span
            className={cn(
              'font-display text-[15px] leading-[1.3]',
              tone === 'light' ? 'text-white' : 'text-content-muted',
            )}
          >
            {m.adminPanel}
          </span>
        ) : (
          <span className="whitespace-nowrap text-[5px] font-semibold leading-[1.4] tracking-[0.1px] text-content-secondary">
            {m.tagline}
          </span>
        )}
      </span>
      <span className="sr-only">{m.brand}</span>
    </span>
  );
  if (!href) return <span className={cn('inline-flex', className)}>{mark}</span>;
  return (
    <Link href={href} aria-label={m.brand} className={cn('inline-flex', className)}>
      {mark}
    </Link>
  );
}
