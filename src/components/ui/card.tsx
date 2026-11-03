import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

/** Card — white surface, 8px radius, hairline border and the soft grey drop shadow. */
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-card border border-line bg-surface-card shadow-card', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
