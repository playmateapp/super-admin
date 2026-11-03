import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

/** Panel — the white 16px-radius card every PlayMate admin section sits on (no shadow). */
export const Panel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-card bg-surface-card', className)} {...props} />
  ),
);
Panel.displayName = 'Panel';

/** Card title inside a Panel (Figma "H3 Semibold" 20px Outfit). */
export function PanelTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('font-display text-heading-md font-semibold text-content-primary', className)}
      {...props}
    />
  );
}
