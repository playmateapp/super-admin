import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Detail-panel facts (Figma "Player Information"): a 36px grey icon tile, a muted label and
 * the value. `InfoBox` is the bordered 16px card that groups them.
 */
export function InfoItem({
  icon,
  label,
  value,
  className,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex min-h-9 min-w-0 items-center gap-1.5', className)}>
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-[4px] bg-surface-muted text-content-primary [&_svg]:size-6 [&_svg]:stroke-[1.5]"
      >
        {icon}
      </span>
      <div className="min-w-0 text-caption leading-[1.5]">
        <p className="text-content-muted">{label}</p>
        <div className="break-words text-content-primary">{value}</div>
      </div>
    </div>
  );
}

export function InfoBox({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-card border border-line bg-surface-card p-2.5',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Two columns of InfoItems with a hairline between them (stacks on narrow panels). */
export function InfoColumns({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr]">
      <div className="flex min-w-0 flex-col gap-2">{left}</div>
      <span aria-hidden className="hidden w-px self-stretch bg-line sm:block" />
      <div className="flex min-w-0 flex-col gap-2">{right}</div>
    </div>
  );
}

export function InfoDivider() {
  return <span aria-hidden className="block h-px w-full bg-line" />;
}
