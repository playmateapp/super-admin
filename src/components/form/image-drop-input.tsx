'use client';

import { CloudUpload, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { formMessages } from './form.messages';

/**
 * RHF-bound image picker — the dashed orange drop zone on "Create Platter". The field value
 * is a `File | null`; a picked image is previewed in place and can be removed.
 */
export function ImageDropInput<T extends FieldValues>({
  name,
  label,
  className,
}: {
  name: Path<T>;
  /** Accessible name of the zone (it has no visible field label in the design). */
  label: string;
  className?: string;
}) {
  const { control } = useFormContext<T>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <DropZone
          file={(field.value as File | null) ?? null}
          onChange={field.onChange}
          label={label}
          error={fieldState.error?.message}
          className={className}
        />
      )}
    />
  );
}

function DropZone({
  file,
  onChange,
  label,
  error,
  className,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  label: string;
  error?: string;
  className?: string;
}) {
  const fm = useMessages(formMessages);
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const pick = (next: File | undefined) => {
    if (next && next.type.startsWith('image/')) onChange(next);
  };

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);
          pick(e.dataTransfer.files[0]);
        }}
        className={cn(
          'relative grid min-h-[220px] place-items-center rounded-card border border-dashed border-line-brand p-6 text-center transition-colors sm:min-h-[330px]',
          isOver && 'bg-surface-tint',
          error && 'border-content-danger',
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          aria-label={label}
          className="sr-only"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
            <img
              src={previewUrl}
              alt={file?.name ?? ''}
              className="max-h-[280px] max-w-full rounded-card object-contain"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label={fm.removeFile}
              className="absolute end-3 top-3 grid size-8 place-items-center rounded-pill bg-surface-card text-content-secondary shadow-float hover:text-content-danger"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <span
              aria-hidden
              className="grid size-24 place-items-center rounded-pill bg-info-soft text-info"
            >
              <CloudUpload className="size-11" strokeWidth={1.5} />
            </span>
            <p className="max-w-[260px] text-pretty text-body-xs text-content-primary">
              <label
                htmlFor={id}
                className="cursor-pointer text-content-link focus-within:underline hover:underline"
              >
                {fm.browse}
              </label>{' '}
              {fm.browseHint}
            </p>
          </div>
        )}
      </div>
      {error ? (
        <p role="alert" className="mt-1 text-caption text-content-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
