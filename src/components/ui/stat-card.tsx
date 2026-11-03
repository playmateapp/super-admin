import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * StatCard — label, big Sora number and a 48px tinted icon tile ("Order 1,50,000").
 * `tone` colours the tile only.
 */
const tiles = {
  brand: 'border-brand-500 bg-surface-tint text-content-brand',
  violet: 'border-violet bg-violet-soft text-violet',
  success: 'border-success bg-success-soft text-success',
  info: 'border-info bg-info-soft text-info',
} as const;

export type StatTone = keyof typeof tiles;

export function StatCard({
  label,
  value,
  icon,
  tone = 'brand',
  className,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: StatTone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-card border border-line bg-surface-card px-6 py-6 sm:px-[30px]',
        className,
      )}
    >
      <div className="min-w-0 font-display">
        <p className="truncate text-caption text-content-primary/80">{label}</p>
        <p className="mt-1 truncate text-heading-lg font-bold text-content-primary">{value}</p>
      </div>
      <span
        aria-hidden
        className={cn(
          'grid size-12 shrink-0 place-items-center rounded-card border [&_svg]:size-6',
          tiles[tone],
        )}
      >
        {icon}
      </span>
    </div>
  );
}
