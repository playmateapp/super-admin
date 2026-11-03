'use client';

import { useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useFormContext, type FieldValues, type Path } from 'react-hook-form';

import { NativeSelect } from '@/components/ui';

import { FormField } from './form-field';

/**
 * RHF-bound native select. Options are children; `placeholder` renders the empty-string
 * option ("Select"), which maps to "not set" in the schema.
 */
export function SelectInput<T extends FieldValues>({
  name,
  label,
  optionalLabel,
  required,
  hint,
  placeholder,
  className,
  children,
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'size'> & {
  name: Path<T>;
  label?: string;
  optionalLabel?: string;
  hint?: ReactNode;
  placeholder?: string;
}) {
  const id = useId();
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const isEmpty = watch(name) === '';

  return (
    <FormField
      id={id}
      label={label}
      optionalLabel={optionalLabel}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <NativeSelect
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={isEmpty ? 'text-content-muted' : undefined}
        {...register(name)}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {children}
      </NativeSelect>
    </FormField>
  );
}
