'use client';

import type { ReactNode } from 'react';

import { commonMessages } from '@/lib/i18n';
import { cn, downloadCsv } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { Button } from './button';
import { Checkbox } from './checkbox';
import { StatusState } from './status-state';

/**
 * DataTable — the admin list table: navy header row, 72px zebra rows, optional checkbox
 * column and a trailing row-actions column. It also owns the loading / error / empty states
 * so screens only pass the query flags. Wide tables scroll sideways inside the card.
 */
export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Plain value for CSV export; columns without it are left out of the file. */
  value?: (row: T) => string | number;
  /** The row's identifying column — darker, medium weight (first column in the design). */
  primary?: boolean;
  className?: string;
}

export interface DataTableSelection {
  isSelected: (id: string) => boolean;
  allSelected: boolean;
  someSelected: boolean;
  toggle: (id: string) => void;
  toggleAll: () => void;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selection,
  rowActions,
  isLoading = false,
  isError = false,
  onRetry,
  isFiltered = false,
  minWidth = 880,
  className,
}: {
  columns: DataTableColumn<T>[];
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  selection?: DataTableSelection;
  rowActions?: (row: T) => ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  /** True when a search / filter is active, to word the empty state. */
  isFiltered?: boolean;
  minWidth?: number;
  className?: string;
}) {
  const m = useMessages(commonMessages);

  if (isLoading) return <StatusState variant="loading" title={m.loading} />;
  if (isError) {
    return (
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
  }
  if (!rows?.length) {
    return <StatusState variant="empty" title={isFiltered ? m.emptyFiltered : m.empty} />;
  }

  return (
    <div className={cn('relative overflow-x-auto', className)}>
      {/* The navy strip is also painted on the table itself so no hairline shows between
          header cells at fractional zoom levels. */}
      <table
        className="w-full border-separate border-spacing-0 bg-[linear-gradient(rgb(var(--surface-inverse))_44px,transparent_44px)] text-start"
        style={{ minWidth }}
      >
        <thead>
          <tr className="h-11 text-caption font-medium text-content-on-inverse [&>th]:bg-surface-inverse">
            {selection ? (
              <th scope="col" className="w-[56px] ps-6 text-start">
                <Checkbox
                  checked={selection.allSelected}
                  indeterminate={selection.someSelected}
                  onChange={selection.toggleAll}
                  label={m.selectAll}
                  className={cn(!selection.allSelected && !selection.someSelected && 'opacity-50')}
                />
              </th>
            ) : null}
            {columns.map((col, i) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'whitespace-nowrap px-3 text-start font-medium',
                  i === 0 && !selection && 'ps-6',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
            {rowActions ? (
              <th scope="col" className="w-[64px] pe-4">
                <span className="sr-only">{m.actions}</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            return (
              <tr
                key={id}
                className="h-[72px] text-body-xs text-content-secondary even:bg-surface-sunken [&>td]:border-b [&>td]:border-line"
              >
                {selection ? (
                  <td className="ps-6">
                    <Checkbox
                      checked={selection.isSelected(id)}
                      onChange={() => selection.toggle(id)}
                      label={m.selectRow}
                    />
                  </td>
                ) : null}
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-3',
                      i === 0 && !selection && 'ps-6',
                      col.primary && 'font-medium text-content-primary',
                      col.className,
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
                {rowActions ? <td className="pe-4 text-end">{rowActions(row)}</td> : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** "Download all": writes the rows to a CSV using each column's `header` + `value`. */
export function downloadTable<T>(filename: string, columns: DataTableColumn<T>[], rows: T[]) {
  const exported = columns.filter((col) => col.value);
  downloadCsv(
    filename,
    exported.map((col) => col.header),
    rows.map((row) => exported.map((col) => col.value?.(row))),
  );
}
