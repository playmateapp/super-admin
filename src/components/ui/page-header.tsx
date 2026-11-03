import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

/**
 * PageHeader — the big Sora title, the breadcrumb trail under it and an optional action at
 * the end (the orange "Create" button). The last crumb is the current page (no link).
 */
export interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  title,
  crumbs = [],
  action,
}: {
  title: string;
  crumbs?: Crumb[];
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="text-balance text-heading-lg font-bold text-content-primary sm:text-heading-xl">
          {title}
        </h1>
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mt-2">
            <ol className="flex flex-wrap items-center gap-1.5 font-display text-body-xs text-content-secondary">
              {crumbs.map((crumb, i) => (
                <Fragment key={`${crumb.label}-${i}`}>
                  {i > 0 ? (
                    <li aria-hidden className="flex">
                      <ChevronRight className="size-[18px] rtl:-scale-x-100" />
                    </li>
                  ) : null}
                  <li>
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-content-primary">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                        {crumb.label}
                      </span>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>
          </nav>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-3">{action}</div> : null}
    </div>
  );
}
