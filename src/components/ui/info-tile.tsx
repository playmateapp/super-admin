import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * InfoTile — a bordered 56px row with a label at the start and its value at the end
 * (order details: "Company — Market Access Group"). The value can be a link.
 */
export function InfoTile({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-h-14 items-center justify-between gap-4 rounded-tile border border-line-strong bg-surface-card px-5 py-3 text-body-md',
        className,
      )}
    >
      <span className="shrink-0 text-content-nav">{label}</span>
      <span className="min-w-0 truncate text-end font-semibold text-content-primary">
        {children}
      </span>
    </div>
  );
}
