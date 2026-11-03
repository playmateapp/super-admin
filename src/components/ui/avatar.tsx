import { cn } from '@/lib/utils';

/** Initials avatar (40px, 8px radius) used for the signed-in admin in the top bar. */
export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-card bg-surface-tint text-body-xs font-semibold text-content-brand',
        className,
      )}
    >
      {initials}
    </span>
  );
}
