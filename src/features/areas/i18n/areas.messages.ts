import { defineMessages } from '@/lib/i18n';

/** Copy of the Areas module (no Figma frame — follows the Venues screen). */
const en = {
  stats: { total: 'Total Areas', venues: 'Venues with an area', players: 'Players with an area' },
  list: {
    title: 'All Areas',
    hint: 'Players pick these in the app and venues are grouped by them.',
    search: 'Search areas by name',
    add: 'Add Area',
    order: 'Order',
    name: 'Area',
    venues: 'Venues',
    players: 'Players',
    rowMenu: 'Actions for {name}',
  },
  actions: {
    edit: 'Edit',
    delete: 'Delete',
    deleteTitle: 'Delete Area?',
    deleteMessage:
      '“{name}” will no longer be offered in the app. Players who chose it keep it on their profile.',
    cancel: 'Cancel',
    confirm: 'Delete',
    deleted: '{name} deleted',
    inUse: '{count} venue(s) still use this area. Move them to another area first, then delete it.',
  },
  form: {
    addTitle: 'Add Area',
    editTitle: 'Edit Area',
    back: 'Back',
    name: 'Area Name',
    namePlaceholder: 'e.g. Banani Dhaka',
    order: 'Display Order',
    orderHint: 'Lower numbers show first. Leave empty to add it at the end.',
    renameHint: 'Renaming also updates the venues and player profiles that use this area.',
    save: 'Save',
    saving: 'Saving…',
    created: 'Area added. Players can pick it in the app now.',
    updated: 'Area updated',
  },
  errors: {
    required: 'This field is required',
    tooLong: 'Use at most 60 characters',
    order: 'Enter a whole number from 0 to 9999',
    duplicate: 'This area already exists',
  },
};

const bn: typeof en = {
  stats: { total: 'মোট এলাকা', venues: 'এলাকাসহ ভেন্যু', players: 'এলাকাসহ খেলোয়াড়' },
  list: {
    title: 'সব এলাকা',
    hint: 'খেলোয়াড়রা অ্যাপে এগুলো বেছে নেন এবং ভেন্যু এলাকা অনুযায়ী সাজানো হয়।',
    search: 'নাম দিয়ে এলাকা খুঁজুন',
    add: 'এলাকা যোগ করুন',
    order: 'ক্রম',
    name: 'এলাকা',
    venues: 'ভেন্যু',
    players: 'খেলোয়াড়',
    rowMenu: '{name} এর অ্যাকশন',
  },
  actions: {
    edit: 'সম্পাদনা',
    delete: 'মুছুন',
    deleteTitle: 'এলাকা মুছবেন?',
    deleteMessage:
      '“{name}” আর অ্যাপে দেখানো হবে না। যেসব খেলোয়াড় এটি বেছে নিয়েছেন, তাদের প্রোফাইলে এটি থেকে যাবে।',
    cancel: 'বাতিল',
    confirm: 'মুছুন',
    deleted: '{name} মুছে ফেলা হয়েছে',
    inUse:
      '{count}টি ভেন্যু এখনও এই এলাকা ব্যবহার করছে। আগে সেগুলো অন্য এলাকায় সরান, তারপর মুছুন।',
  },
  form: {
    addTitle: 'এলাকা যোগ করুন',
    editTitle: 'এলাকা সম্পাদনা',
    back: 'ফিরে যান',
    name: 'এলাকার নাম',
    namePlaceholder: 'যেমন বনানী ঢাকা',
    order: 'দেখানোর ক্রম',
    orderHint: 'ছোট সংখ্যা আগে দেখাবে। খালি রাখলে শেষে যোগ হবে।',
    renameHint: 'নাম বদলালে এই এলাকা ব্যবহারকারী ভেন্যু ও খেলোয়াড়দের প্রোফাইলও হালনাগাদ হবে।',
    save: 'সংরক্ষণ',
    saving: 'সংরক্ষণ হচ্ছে…',
    created: 'এলাকা যোগ হয়েছে। খেলোয়াড়রা এখন অ্যাপে এটি বেছে নিতে পারবেন।',
    updated: 'এলাকা হালনাগাদ হয়েছে',
  },
  errors: {
    required: 'এই ঘরটি পূরণ করা আবশ্যক',
    tooLong: 'সর্বোচ্চ ৬০ অক্ষর',
    order: '০ থেকে ৯৯৯৯ এর মধ্যে পূর্ণ সংখ্যা লিখুন',
    duplicate: 'এই এলাকা আগে থেকেই আছে',
  },
};

export const areasMessages = defineMessages({ en, bn });
export type AreasMessages = typeof en;
