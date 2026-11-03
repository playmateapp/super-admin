'use client';

import type { ReactNode } from 'react';
import {
  FormProvider,
  type FieldErrors,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';

import { cn } from '@/lib/utils';

/**
 * Binds a react-hook-form instance to a <form>. Inputs inside read the form from context
 * (`useFormContext`), so screens only pass `name` + `label` to each field.
 */
export function FormWrapper<T extends FieldValues>({
  form,
  onSubmit,
  onInvalid,
  className,
  children,
}: {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  /** Called with the zod errors when submit is blocked (e.g. to show a popup). */
  onInvalid?: (errors: FieldErrors<T>) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className={cn('flex flex-col', className)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
