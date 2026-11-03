import { defineMessages } from '@/lib/i18n';

/** Copy owned by the generic form inputs. */
const en = {
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  browse: 'Browse',
  browseHint: 'and choose the picture you want to upload from your computer',
  removeFile: 'Remove file',
};
const bn: typeof en = {
  showPassword: 'পাসওয়ার্ড দেখান',
  hidePassword: 'পাসওয়ার্ড লুকান',
  browse: 'ব্রাউজ করুন',
  browseHint: 'এবং আপনার কম্পিউটার থেকে যে ছবিটি আপলোড করতে চান তা বেছে নিন',
  removeFile: 'ফাইল সরান',
};

export const formMessages = defineMessages({ en, bn });
