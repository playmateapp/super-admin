import Image from 'next/image';

import { cn } from '@/lib/utils';

/**
 * Coloured icons exported from the Figma file (`public/icons/*.svg`) — the ones lucide has no
 * match for (gold crown badge, jersey group, football, cards). Decorative: always pair with
 * visible text or an `sr-only` label.
 */
/** File + native aspect ratio (width / height) — the SVGs use preserveAspectRatio="none". */
const files = {
  crown: ['/icons/crown.svg', 1],
  jersey: ['/icons/team-jersey.svg', 1],
  football: ['/icons/football.svg', 1],
  goal: ['/icons/stat-goal.svg', 1],
  assist: ['/icons/stat-assist.svg', 14.4837 / 18.8501],
  redCard: ['/icons/red-card.svg', 12.9949 / 20],
  yellowCard: ['/icons/yellow-card.svg', 12.9949 / 20],
} as const;

export type DesignIconName = keyof typeof files;

/** `size` is the height; the width follows the icon's own proportions. */
export function DesignIcon({
  name,
  size = 24,
  className,
}: {
  name: DesignIconName;
  size?: number;
  className?: string;
}) {
  const [src, ratio] = files[name];
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={Math.round(size * ratio * 100) / 100}
      height={size}
      unoptimized
      className={cn('shrink-0', className)}
    />
  );
}
