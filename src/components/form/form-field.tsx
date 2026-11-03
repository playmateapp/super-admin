'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Label + control + error/hint line shared by every RHF-bound input. `optionalLabel` adds the
 * muted "(Optional)" suffix from the design next to the label.
 */
export function FormField({
  id,
  label,
  optionalLabel,
  required,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label?: string;
  optionalLabel?: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      {label ? (
        <label htmlFor={id} className="font-display text-body-xs font-medium text-content-primary">
          {label}
          {optionalLabel ? (
            <span className="font-normal text-content-muted"> {optionalLabel}</span>
          ) : null}
          {required ? (
            <span aria-hidden className="text-content-danger">
              {' '}
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-caption text-content-danger">
          {error}
        </p>
      ) : hint ? (
        <div id={`${id}-hint`} className="text-caption text-content-secondary">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
