import { AlertCircle, Inbox, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Loading / empty / error placeholder used by every data-backed screen. */
export function StatusState({
  variant,
  title,
  description,
  icon,
  actions,
  className,
}: {
  variant: 'loading' | 'empty' | 'error';
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const fallbackIcon = {
    loading: <Loader2 className="size-9 animate-spin text-content-brand" />,
    empty: <Inbox className="size-9 text-content-secondary" />,
    error: <AlertCircle className="size-9 text-content-danger" />,
  }[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn('flex flex-col items-center gap-3 px-4 py-16 text-center', className)}
    >
      {icon ?? fallbackIcon}
      {title ? <p className="text-heading-sm font-semibold text-content-primary">{title}</p> : null}
      {description ? (
        <p className="max-w-md text-body-xs text-content-secondary">{description}</p>
      ) : null}
      {actions ? <div className="mt-2 flex gap-3">{actions}</div> : null}
    </div>
  );
}
