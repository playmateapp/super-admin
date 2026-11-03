'use client';

import { LOCALES, LOCALE_LABEL } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useLocale, useMessages } from '@/providers/i18n-provider';

import { sharedMessages } from './shared.messages';

/** Segmented EN / বাংলা switch. Updates <html lang/dir> and the locale cookie in place. */
export function LocaleSwitch({ className }: { className?: string }) {
  const m = useMessages(sharedMessages);
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="radiogroup"
      aria-label={m.language}
      className={cn(
        'flex h-10 shrink-0 items-center gap-0.5 rounded-tile border border-line bg-surface-card p-[3px]',
        className,
      )}
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={active}
            lang={l}
            onClick={() => setLocale(l)}
            className={cn(
              'h-full rounded-input px-2.5 text-caption font-semibold transition-colors',
              active
                ? 'bg-surface-inverse text-content-on-inverse'
                : 'text-content-secondary hover:text-content-primary',
            )}
          >
            {LOCALE_LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}
