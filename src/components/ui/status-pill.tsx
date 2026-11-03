import { cn } from '@/lib/utils';

export type PillTone = 'success' | 'info' | 'danger' | 'warning' | 'cyan' | 'neutral';

const tones: Record<PillTone, string> = {
  success: 'bg-success-soft text-success',
  info: 'bg-info-soft text-info',
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning',
  cyan: 'bg-cyan-soft text-cyan',
  neutral: 'bg-surface-muted text-content-primary',
};

/** StatusPill — rounded status label (Figma: 12px Inter, soft fill, 22px radius). */
export function StatusPill({
  tone,
  label,
  className,
}: {
  tone: PillTone;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex min-w-[80px] items-center justify-center whitespace-nowrap rounded-[22px] px-3 py-[5px] text-caption',
        tones[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}

/** Small filled chip (player position — "goalkeeper"). */
export function Chip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[19px] bg-chip px-2 py-0.5 text-caption text-content-on-brand',
        className,
      )}
    >
      {label}
    </span>
  );
}
