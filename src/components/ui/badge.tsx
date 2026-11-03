import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

/**
 * Badge — the small status pill in the last table column ("Active", "Paid", "Due").
 * One tone per meaning: success = good/final, warning = needs attention, danger = failed,
 * info = in progress, neutral = off.
 */
export const badgeVariants = cva(
  'inline-flex items-center whitespace-nowrap rounded-[4px] px-3.5 py-1.5 text-micro font-medium',
  {
    variants: {
      tone: {
        success: 'bg-success-soft text-success',
        warning: 'bg-warning-soft text-warning',
        danger: 'bg-danger-soft text-danger',
        info: 'bg-info-soft text-info',
        neutral: 'bg-surface-muted text-content-secondary',
      },
    },
    defaultVariants: { tone: 'success' },
  },
);

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>['tone']>;

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
