'use client';

import { useId, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { useFormContext, type FieldValues, type Path } from 'react-hook-form';

import { Textarea } from '@/components/ui';

import { FormField } from './form-field';

/** RHF-bound multi-line input ("Description"). */
export function TextareaInput<T extends FieldValues>({
  name,
  label,
  optionalLabel,
  required,
  hint,
  className,
  ...props
}: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> & {
  name: Path<T>;
  label?: string;
  optionalLabel?: string;
  hint?: ReactNode;
}) {
  const id = useId();
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

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
      <Textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...register(name)}
        {...props}
      />
    </FormField>
  );
}
