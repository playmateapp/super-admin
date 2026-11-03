/**
 * Locale configuration. English is the default UI language; Bangla is the second one.
 * The chosen locale is kept in a cookie so the server renders the right `lang` / `dir`
 * on <html> with no flash. Both locales are LTR today, but direction stays a per-locale
 * setting so an RTL language can be added without touching components.
 */

export const LOCALES = ['en', 'bn'] as const;
export type Locale = (typeof LOCALES)[number];
export type Direction = 'ltr' | 'rtl';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'playmate-locale';

export const LOCALE_DIR: Record<Locale, Direction> = { en: 'ltr', bn: 'ltr' };

/** Label shown in the language switch — each language names itself. */
export const LOCALE_LABEL: Record<Locale, string> = { en: 'EN', bn: 'বাংলা' };

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}
