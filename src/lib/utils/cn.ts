import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge must know our custom font-size and shadow/radius names (tailwind.config.ts),
 * otherwise it treats `text-body-sm` as a text COLOR and drops `text-content-*` next to it.
 * Add new fontSize / boxShadow / borderRadius keys here when you add them to the config.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'heading-xl',
            'heading-lg',
            'heading-md',
            'heading-sm',
            'body-md',
            'body-sm',
            'body-xs',
            'caption',
            'micro',
          ],
        },
      ],
      shadow: [{ shadow: ['card', 'sidebar', 'field', 'float'] }],
      rounded: [{ rounded: ['card', 'input', 'tile', 'pill'] }],
    },
  },
});

/** Merge conditional class names and resolve Tailwind conflicts (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
