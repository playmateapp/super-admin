'use client';

import { ArrowLeft, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';

import { Button, Modal } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { downloadCsv, formatCount, getErrorMessage, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useImportLocations } from '../hooks/mutations';
import { locationsMessages } from '../i18n/locations.messages';
import type { LocationImportRow } from '../types';
import { IMPORT_EXAMPLE, IMPORT_HEADERS, parseLocationCsv } from '../validations/location.schema';

/**
 * Bulk Upload modal: download the CSV template, choose a file, see how many rows it has,
 * upload. The server adds only what is missing, so the same file can be uploaded twice.
 */
export function BulkUploadModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const m = useMessages(locationsMessages);
  const c = useMessages(commonMessages);
  const upload = useImportLocations();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState('');
  const [rows, setRows] = useState<LocationImportRow[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setFile('');
      setRows(null);
      setError('');
    }
  }, [open]);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = '';
    if (!picked) return;
    setFile(picked.name);
    const parsed = parseLocationCsv(await picked.text());
    if (parsed === null) {
      setRows(null);
      setError(m.bulk.noHeader);
    } else if (parsed.length === 0) {
      setRows(null);
      setError(m.bulk.noRows);
    } else {
      setRows(parsed);
      setError('');
    }
  };

  const onUpload = () => {
    if (!rows) return;
    upload.mutate(rows, {
      onSuccess: (r) => {
        toast.success(
          interpolate(m.bulk.done, {
            divisions: formatCount(r.divisions),
            districts: formatCount(r.districts),
            thanas: formatCount(r.thanas),
            skipped: formatCount(r.skipped),
          }),
        );
        onOpenChange(false);
      },
      onError: (err) => toast.error(getErrorMessage(err, c.saveFailed)),
    });
  };

  const b = m.bulk;
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={b.title}>
      <div className="relative mb-4 flex items-center justify-center">
        <button
          type="button"
          aria-label={m.form.back}
          onClick={() => onOpenChange(false)}
          className="absolute start-0 grid size-8 place-items-center rounded-input hover:bg-surface-muted"
        >
          <ArrowLeft className="size-5 rtl:-scale-x-100" />
        </button>
        <h2 className="font-display text-heading-md font-semibold text-content-primary">
          {b.title}
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-body-xs text-content-secondary">{b.intro}</p>
        <Button
          type="button"
          variant="outline"
          className="self-start"
          onClick={() => downloadCsv('locations-template', IMPORT_HEADERS, IMPORT_EXAMPLE)}
        >
          <Download />
          {b.template}
        </Button>
        <input
          ref={input}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={onFile}
          tabIndex={-1}
          aria-hidden
        />
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex flex-col items-center gap-2 rounded-card border border-dashed border-line bg-surface-muted px-4 py-6 text-center hover:border-brand-500"
        >
          <FileSpreadsheet aria-hidden className="size-8 text-content-brand" />
          <span className="font-display text-body-md text-content-primary">
            {file ? b.change : b.choose}
          </span>
          {rows ? (
            <span className="text-body-xs text-content-secondary">
              {interpolate(b.rows, { count: formatCount(rows.length), file })}
            </span>
          ) : null}
        </button>
        {error ? (
          <p role="alert" className="text-body-xs text-content-danger">
            {error}
          </p>
        ) : null}
        <Button
          type="button"
          className="w-full"
          disabled={!rows || upload.isPending}
          onClick={onUpload}
        >
          {upload.isPending ? b.uploading : b.upload}
          <Upload />
        </Button>
      </div>
    </Modal>
  );
}
