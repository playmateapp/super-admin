'use client';

import type { ReactNode } from 'react';

import { commonMessages } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { Button } from './button';
import { StatusState } from './status-state';

export interface ListColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Width / alignment classes shared by the header and body cell. */
  className?: string;
}

/**
 * ListTable — the PlayMate list (Figma "All User", "All Teams", ...): a rounded #F6F9F8
 * header row, airy body rows, the selected row tinted green. Clicking a row selects it (the
 * screen shows it in the detail panel). Owns its loading / error / empty states and scrolls
 * sideways inside its card below `minWidth`.
 */
export function ListTable<T>({
  columns,
  rows,
  getRowId,
  selectedId,
  onSelect,
  actions,
  actionsHeader,
  isLoading = false,
  isError = false,
  onRetry,
  isFiltered = false,
  minWidth = 680,
  className,
}: {
  columns: ListColumn<T>[];
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  selectedId?: string | null;
  onSelect?: (row: T) => void;
  /** Trailing "Action" cell (the ⋮ menu). */
  actions?: (row: T) => ReactNode;
  actionsHeader?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  isFiltered?: boolean;
  minWidth?: number;
  className?: string;
}) {
  const m = useMessages(commonMessages);

  let body: ReactNode = null;
  if (isLoading) body = <StatusState variant="loading" title={m.loading} />;
  else if (isError)
    body = (
      <StatusState
        variant="error"
        title={m.loadError}
        actions={
          onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry}>
              {m.retry}
            </Button>
          ) : null
        }
      />
    );
  else if (!rows?.length)
    body = <StatusState variant="empty" title={isFiltered ? m.emptyFiltered : m.empty} />;

  return (
    <div className={cn('min-w-0 overflow-x-auto', className)}>
      <table className="w-full border-separate border-spacing-y-1.5" style={{ minWidth }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'bg-surface-sunken p-2.5 text-center text-body-md font-normal text-content-secondary',
                  i === 0 && 'rounded-s-[10px]',
                  !actions && i === columns.length - 1 && 'rounded-e-[10px]',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
            {actions ? (
              <th
                scope="col"
                className="w-[70px] rounded-e-[10px] bg-surface-sunken p-2.5 text-center text-body-md font-normal text-content-secondary"
              >
                {actionsHeader ?? m.action}
              </th>
            ) : null}
          </tr>
        </thead>
        {body ? null : (
          <tbody>
            {rows?.map((row) => {
              const id = getRowId(row);
              const selected = id === selectedId;
              return (
                <tr
                  key={id}
                  onClick={onSelect ? () => onSelect(row) : undefined}
                  aria-selected={onSelect ? selected : undefined}
                  className={cn(
                    'group',
                    onSelect && 'cursor-pointer',
                    selected
                      ? '[&>td]:bg-surface-tint'
                      : onSelect && 'hover:[&>td]:bg-surface-sunken',
                  )}
                >
                  {columns.map((col, i) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-2.5 py-1.5 align-middle text-body-xs text-content-primary transition-colors',
                        i === 0 && 'rounded-s-[10px]',
                        !actions && i === columns.length - 1 && 'rounded-e-[10px]',
                        col.className,
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                  {actions ? (
                    <td className="rounded-e-[10px] px-2.5 py-1.5 text-center transition-colors">
                      <div className="flex justify-center">{actions(row)}</div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {body}
    </div>
  );
}

/** Name + small id under it, with a 40px picture (first column of most lists). */
export function IdentityCell({
  avatar,
  name,
  sub,
}: {
  avatar: ReactNode;
  name: string;
  sub?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-start">
      {avatar}
      <div className="flex min-w-0 flex-col gap-1">
        <p className="line-clamp-2 text-body-md leading-none text-content-primary">{name}</p>
        {sub ? <p className="text-caption text-content-secondary">{sub}</p> : null}
      </div>
    </div>
  );
}
