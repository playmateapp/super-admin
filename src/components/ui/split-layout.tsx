import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { StatusState } from './status-state';

/**
 * SplitLayout — list card (749px) beside a detail panel (471px) on desktop; stacked on
 * smaller screens, list first. Matches the Figma admin frames at 1600px.
 */
export function SplitLayout({
  list,
  detail,
  className,
}: {
  list: ReactNode;
  detail: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid items-start gap-5 xl:grid-cols-[minmax(0,749fr)_minmax(360px,471fr)]',
        className,
      )}
    >
      <div className="min-w-0">{list}</div>
      <div className="min-w-0 xl:sticky xl:top-[91px]">{detail}</div>
    </div>
  );
}

/** The image + name + chips header of a detail panel, with the ⋮ menu top-end. */
export function DetailHeader({
  media,
  title,
  subtitle,
  badges,
  menu,
}: {
  media: ReactNode;
  title: string;
  subtitle?: string;
  badges?: ReactNode;
  menu?: ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center gap-4 pt-1">
      {menu ? <div className="absolute end-0 top-0">{menu}</div> : null}
      {media}
      <div className="flex w-full flex-col items-center gap-2 px-8 text-center">
        <h2 className="text-balance break-words font-display text-heading-xl font-medium text-content-primary">
          {title}
        </h2>
        {subtitle ? <p className="text-body-xs text-content-secondary">{subtitle}</p> : null}
        {badges ? <div className="flex flex-wrap justify-center gap-3">{badges}</div> : null}
      </div>
    </div>
  );
}

/** Section heading inside a detail panel ("Player Information", "Recent Matches"). */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display text-heading-sm font-semibold text-content-primary">{children}</h3>
  );
}

/** Loading / empty / error placeholder of a detail panel (keeps the panel's card frame). */
export function PanelState({
  variant,
  title,
  retryLabel,
  onRetry,
}: {
  variant: 'loading' | 'empty' | 'error';
  title: string;
  retryLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-card bg-surface-card p-5">
      <StatusState
        variant={variant}
        title={title}
        actions={
          variant === 'error' && onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null
        }
      />
    </div>
  );
}
