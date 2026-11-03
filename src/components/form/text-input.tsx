'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useFormContext, type FieldValues, type Path } from 'react-hook-form';

import { Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { FormField } from './form-field';
import { formMessages } from './form.messages';

/**
 * RHF-bound input (text / email / tel / number / date / password). Password fields get a
 * show/hide toggle. Errors come from the zod schema (already localised by the screen).
 */
export function TextInput<T extends FieldValues>({
  name,
  label,
  optionalLabel,
  required,
  hint,
  type = 'text',
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> & {
  name: Path<T>;
  label?: string;
  optionalLabel?: string;
  hint?: ReactNode;
}) {
  const fm = useMessages(formMessages);
  const id = useId();
  const [show, setShow] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;
  const isPassword = type === 'password';

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
      <div className="relative">
        <Input
          id={id}
          type={isPassword && show ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(isPassword && 'pe-11')}
          {...register(name)}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-pressed={show}
            aria-label={show ? fm.hidePassword : fm.showPassword}
            className="absolute end-0 top-0 grid h-11 w-11 place-items-center text-content-muted hover:text-content-primary"
          >
            {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        ) : null}
      </div>
    </FormField>
  );
}
