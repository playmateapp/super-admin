import Image from 'next/image';

import { cn } from '@/lib/utils';

/**
 * Sidebar icon for "Subscriptions" — the design uses its own gold crown badge (not a lucide
 * glyph), exported from Figma to `public/icons/subscription.svg`. Same props as a lucide icon.
 */
export function SubscriptionNavIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <Image
      src="/icons/subscription.svg"
      alt=""
      width={20}
      height={20}
      unoptimized
      aria-hidden
      className={cn('shrink-0', className)}
    />
  );
}
