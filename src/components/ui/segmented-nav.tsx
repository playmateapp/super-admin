'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

/**
 * SegmentedNav — pill tabs that are links, for sibling pages of one section
 * (Orders: "Company orders" / "Individual orders").
 */
export function SegmentedNav({
  items,
  label,
  className,
}: {
  items: { href: string; label: string }[];
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={label}
      className={cn(
        'scrollbar-none mb-5 inline-flex max-w-full gap-1 overflow-x-auto rounded-card border border-line bg-surface-card p-1',
        className,
      )}
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'whitespace-nowrap rounded-input px-4 py-2 text-body-xs font-medium transition-colors',
              active
                ? 'bg-surface-inverse text-content-on-inverse'
                : 'text-content-secondary hover:bg-surface-muted/70 hover:text-content-primary',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
