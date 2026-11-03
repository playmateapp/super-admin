import type { Locale } from './config';

/**
 * Feature-owned translations. Each feature/layout keeps its own `*.messages.ts`:
 *
 *   const en = { title: 'Company List' };
 *   const bn: typeof en = { title: 'কোম্পানির তালিকা' };
 *   export const companyMessages = defineMessages({ en, bn });
 *
 * Typing `bn` as `typeof en` makes a missing Bangla key a compile error.
 */
export type LocalizedMessages<T> = Record<Locale, T>;

export function defineMessages<T>(messages: LocalizedMessages<T>): LocalizedMessages<T> {
  return messages;
}
