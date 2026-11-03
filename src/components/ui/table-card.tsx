import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Card } from './card';

/**
 * TableCard — card that frames a DataTable: title at the start, toolbar (download, filters,
 * search) at the end. The toolbar wraps under the title on narrow screens.
 */
export function TableCard({
  title,
  toolbar,
  children,
  className,
}: {
  title: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-5 sm:px-6">
        <h2 className="font-sans text-heading-md font-medium text-content-primary">{title}</h2>
        {toolbar ? (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">{toolbar}</div>
        ) : null}
      </div>
      {children}
    </Card>
  );
}
