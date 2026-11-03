/**
 * @/lib/i18n — locale config + message helpers (client-safe).
 * Server helper `getServerLocale` is imported from '@/lib/i18n/get-locale'.
 * The React context + hooks live in '@/providers/i18n-provider'.
 */
export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_DIR,
  LOCALE_LABEL,
  isLocale,
  type Locale,
  type Direction,
} from './config';
export { defineMessages, type LocalizedMessages } from './messages';
export { commonMessages, type CommonMessages } from './common.messages';
