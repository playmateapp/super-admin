import { ChevronDown } from 'lucide-react';
import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

import { fieldBox } from './input';

/**
 * Native <select> styled like Input with a chevron. Native keeps it accessible and gives the
 * OS picker on mobile. Options are passed as children. `size="sm"` is the packed toolbar
 * filter ("Select Location").
 */
export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  containerClassName?: string;
  size?: 'md' | 'sm';
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, containerClassName, size = 'md', children, ...props }, ref) => (
    <div className={cn('relative', containerClassName)}>
      <select
        ref={ref}
        className={cn(
          fieldBox,
          'h-11 cursor-pointer appearance-none',
          size === 'sm' ? 'border-line pe-9 ps-3 text-content-muted' : 'pe-11',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-content-primary',
          size === 'sm' ? 'end-2.5 size-4 text-content-muted' : 'end-4 size-5',
        )}
      />
    </div>
  ),
);
NativeSelect.displayName = 'NativeSelect';
