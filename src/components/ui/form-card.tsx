import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Card } from './card';

/**
 * FormCard — the create screens' card: navy title bar on top, form body below
 * ("Menu Create", "Create Company").
 */
export function FormCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <h2 className="bg-surface-inverse px-6 py-5 font-sans text-heading-md font-medium text-content-on-inverse sm:px-[34px]">
        {title}
      </h2>
      <div className="px-5 py-8 sm:px-[34px] sm:py-10">{children}</div>
    </Card>
  );
}
