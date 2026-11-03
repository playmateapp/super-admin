import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

/**
 * Button (Figma "Main Button"). primary = filled PlayMate green ("Login", "Save Password",
 * "+ Add Venue") · outline-brand = green border ("View", "Edit", "Didn't receive the code?") ·
 * outline = neutral bordered · muted = grey fill (inactive pill, "Cancel") · ghost = quiet
 * icon/text · danger = destructive.
 */
export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-content-on-brand hover:bg-brand-400',
        'outline-brand':
          'border border-brand-500 bg-surface-card text-content-brand hover:bg-surface-tint dark:border-content-brand',
        outline: 'border border-line bg-surface-card text-content-primary hover:bg-surface-muted',
        muted: 'bg-surface-muted text-content-primary hover:bg-line',
        ghost: 'bg-transparent text-content-secondary hover:bg-surface-muted',
        danger: 'bg-danger text-content-on-brand hover:bg-danger/90',
      },
      size: {
        sm: 'h-10 rounded-input px-4 text-body-xs [&_svg]:size-4',
        md: 'h-12 rounded-[12px] px-5 text-body-xs [&_svg]:size-5',
        icon: 'size-10 rounded-tile p-0 [&_svg]:size-5',
        'icon-sm': 'size-8 rounded-input p-0 [&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a Next <Link>) with button styles. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? 'button')}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
