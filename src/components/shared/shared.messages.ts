import { defineMessages } from '@/lib/i18n';

/** Copy owned by the app-wide pieces (brand mark, theme + language switches). */
const en = {
  brand: 'PlayMate',
  tagline: 'Find Players. Build Teams. Play Together.',
  adminPanel: 'Super Admin Panel',
  toLight: 'Switch to light mode',
  toDark: 'Switch to dark mode',
  language: 'Language',
};
const bn: typeof en = {
  brand: 'প্লেমেট',
  tagline: 'Find Players. Build Teams. Play Together.',
  adminPanel: 'সুপার অ্যাডমিন প্যানেল',
  toLight: 'লাইট মোডে যান',
  toDark: 'ডার্ক মোডে যান',
  language: 'ভাষা',
};

export const sharedMessages = defineMessages({ en, bn });
