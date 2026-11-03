'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { commonMessages } from '@/lib/i18n';
import { cn, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

/** Page numbers to show: first, last, current ±1, with gaps as `null`. */
function pageList(page: number, pages: number): (number | null)[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, 2, page - 1, page, page + 1, pages]);
  const sorted = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}

/** Pager — "< Previous 1 2 3 … Next >" under every list (Figma "Pagination"). */
export function Pager({
  page,
  pageSize,
  total,
  onChange,
  className,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  const m = useMessages(commonMessages);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const navBtn =
    'inline-flex h-10 items-center gap-1 rounded-[8px] px-2.5 text-body-xs font-medium text-content-primary disabled:text-content-muted disabled:opacity-60';

  return (
    <nav
      aria-label={interpolate(m.page, { page })}
      className={cn('flex flex-wrap items-center justify-center gap-1', className)}
    >
      <button
        type="button"
        className={navBtn}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft aria-hidden className="size-4 rtl:-scale-x-100" />
        {m.previous}
      </button>
      {pageList(page, pages).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} aria-hidden className="grid size-10 place-items-center">
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
            className={cn(
              'grid size-10 place-items-center rounded-[8px] text-body-xs font-medium text-content-primary',
              p === page ? 'border border-line bg-surface-card' : 'hover:bg-surface-muted',
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className={navBtn}
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        {m.next}
        <ChevronRight aria-hidden className="size-4 rtl:-scale-x-100" />
      </button>
    </nav>
  );
}
