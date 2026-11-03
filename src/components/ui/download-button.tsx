'use client';

import { toast } from 'sonner';

import { commonMessages } from '@/lib/i18n';
import { useMessages } from '@/providers/i18n-provider';

import { Button } from './button';
import { downloadTable, type DataTableColumn } from './data-table';

/**
 * DownloadButton — the toolbar's "Download all". Exports the ticked rows when some are
 * selected, otherwise every row on screen, as a CSV built from the table's columns.
 */
export function DownloadButton<T>({
  filename,
  columns,
  rows,
  selectedIds,
  getRowId,
}: {
  filename: string;
  columns: DataTableColumn<T>[];
  rows: T[] | undefined;
  selectedIds?: string[];
  getRowId?: (row: T) => string;
}) {
  const m = useMessages(commonMessages);
  const onClick = () => {
    const all = rows ?? [];
    const picked =
      selectedIds?.length && getRowId
        ? all.filter((row) => selectedIds.includes(getRowId(row)))
        : all;
    if (!picked.length) {
      toast.info(m.downloadEmpty);
      return;
    }
    downloadTable(filename, columns, picked);
  };
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      {m.downloadAll}
    </Button>
  );
}
