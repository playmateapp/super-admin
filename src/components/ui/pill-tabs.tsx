'use client';

import { cn } from '@/lib/utils';

/**
 * PillTabs — the "Over View · Stats · Photos · About" switch on detail panels. Filled green
 * when active, grey pill otherwise. Controlled; the screen keeps the active key.
 */
export function PillTabs<K extends string>({
  tabs,
  value,
  onChange,
  label,
  className,
}: {
  tabs: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex w-full gap-2', className)}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              'h-[42px] min-w-0 flex-1 truncate rounded-[30px] border px-3 text-body-xs font-semibold transition-colors',
              active
                ? 'border-brand-500 bg-brand-500 text-content-on-brand'
                : 'border-line bg-surface-muted text-content-primary hover:bg-line',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** UnderlineTabs — the home / away team switch inside the match "Players" tab. */
export function UnderlineTabs<K extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex w-full border-b border-line">
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              '-mb-px min-w-0 flex-1 truncate border-b-2 px-2 py-2 text-body-xs transition-colors',
              active
                ? 'border-brand-500 text-content-brand'
                : 'border-transparent text-content-muted hover:text-content-primary',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
