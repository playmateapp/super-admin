import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface VersusSide {
  name: string;
  logo: ReactNode;
  score?: number | null;
}

/**
 * VersusCard — the "Recent Matches" card: date on top, home name + logo + score against score
 * + logo + away name, a caption (venue) and an optional footer row (player stats).
 */
export function VersusCard({
  date,
  home,
  away,
  caption,
  footer,
  className,
}: {
  date: string;
  home: VersusSide;
  away: VersusSide;
  caption?: string;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-card border border-line bg-surface-card p-2.5',
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-center text-caption text-content-muted">{date}</p>
        <div className="flex items-center gap-2.5">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            <span className="truncate font-display text-body-xs font-medium text-content-primary">
              {home.name}
            </span>
            {home.logo}
            {home.score != null ? (
              <span className="font-display text-heading-md font-semibold text-danger">
                {home.score}
              </span>
            ) : null}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {away.score != null ? (
              <span className="font-display text-heading-md font-semibold text-danger">
                {away.score}
              </span>
            ) : null}
            {away.logo}
            <span className="truncate font-display text-body-xs font-medium text-content-primary">
              {away.name}
            </span>
          </div>
        </div>
        {caption ? (
          <p className="text-center text-caption text-content-primary">{caption}</p>
        ) : null}
      </div>
      {footer}
    </div>
  );
}

/** Row of icon + number cells split by hairlines (goals · assists · red · yellow). */
export function StatRow({
  items,
}: {
  items: { key: string; icon: ReactNode; value: ReactNode; label: string }[];
}) {
  return (
    <div className="flex items-center justify-between rounded-[10px] bg-surface-muted px-4 py-2">
      {items.map((item, i) => (
        <div key={item.key} className="flex items-center gap-4">
          {i > 0 ? <span aria-hidden className="h-[15px] w-px bg-line-strong" /> : null}
          <span className="flex items-center gap-2" title={item.label}>
            <span aria-hidden className="grid size-5 place-items-center">
              {item.icon}
            </span>
            <span className="sr-only">{item.label}</span>
            <span className="font-display text-body-xs font-semibold text-content-primary">
              {item.value}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
