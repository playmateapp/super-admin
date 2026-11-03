import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Centered Cancel / Create button row at the bottom of a create form. */
export function FormActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'mt-10 flex flex-col-reverse items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-5 [&>*]:sm:w-[166px]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Two-column field grid used by every create form (one column on phones). */
export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-x-8 gap-y-6 md:grid-cols-2', className)}>{children}</div>;
}
