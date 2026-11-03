import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type StripTone = 'green' | 'blue' | 'cyan' | 'gold' | 'indigo' | 'red';

/** Label colour per tone (Figma: the label text is the tone's strong colour). */
const labelTone: Record<StripTone, string> = {
  green: 'text-content-brand',
  blue: 'text-info',
  cyan: 'text-cyan',
  gold: 'text-danger',
  indigo: 'text-violet',
  red: 'text-danger',
};

/** Literal class names so Tailwind keeps the `.strip-*` gradients (globals.css). */
const stripBg: Record<StripTone, string> = {
  green: 'strip-green',
  blue: 'strip-blue',
  cyan: 'strip-cyan',
  gold: 'strip-gold',
  indigo: 'strip-indigo',
  red: 'strip-red',
};

export interface StripItem {
  key: string;
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone: StripTone;
}

/**
 * StatStrip — the row of totals at the top of every admin page: a gradient header (icon +
 * label) over a 28px number, all cells in one white card. Wraps to two columns on phones.
 */
export function StatStrip({ items, className }: { items: StripItem[]; className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-card bg-surface-card p-2.5 sm:flex',
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={item.key} className="flex min-w-0 flex-1 flex-col gap-px bg-surface-card">
          <div
            className={cn(
              stripBg[item.tone],
              'flex items-center gap-2 p-2.5',
              i === 0 && 'sm:rounded-s-[4px]',
              i === items.length - 1 && 'sm:rounded-e-[4px]',
            )}
          >
            <span aria-hidden className="grid size-6 shrink-0 place-items-center [&_svg]:size-6">
              {item.icon}
            </span>
            <span
              className={cn(
                'truncate font-display text-body-xs font-normal xl:text-heading-sm',
                labelTone[item.tone],
              )}
            >
              {item.label}
            </span>
          </div>
          <p className="truncate p-2.5 font-display text-heading-xl text-content-primary">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
