import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

/**
 * Shared box styles of every form control (Figma "Input Fild": #F2F2F7 fill, stroke border,
 * 10px radius, 14px Inter; green focus ring).
 */
export const fieldBox =
  'w-full rounded-input border border-line bg-surface-muted px-3 text-body-xs text-content-primary outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-content-muted focus:border-line-brand focus:ring-[3px] focus:ring-brand-500/15 disabled:opacity-60 aria-[invalid=true]:border-content-danger';

/** Text input — pass `type="date"` for the date fields. */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBox, 'h-11', className)} {...props} />
  ),
);
Input.displayName = 'Input';

/** Multi-line input ("Description"). */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldBox, 'min-h-[102px] resize-y py-3', className)}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
