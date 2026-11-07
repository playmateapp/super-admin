import { defineMessages } from '@/lib/i18n';

/** Copy of the Appeals module (no Figma frame — follows the Areas screen). */
const en = {
  stats: { pending: 'Waiting for review', approved: 'Approved', rejected: 'Rejected' },
  list: {
    title: 'Unblock Requests',
    hint: 'Blocked players ask here to get their account back. They are told your decision in the app.',
    tabsLabel: 'Filter requests by status',
    player: 'Player',
    message: 'Request',
    date: 'Sent',
    status: 'Status',
    rowApprove: 'Approve {name}',
    rowReject: 'Reject {name}',
  },
  tabs: { all: 'All', pending: 'Pending', approved: 'Approved', rejected: 'Rejected' },
  status: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' },
  actions: {
    approve: 'Approve',
    reject: 'Reject',
    cancel: 'Cancel',
    approveTitle: 'Unblock this player?',
    approveMessage: '{name} gets full access back right away and is notified.',
    approved: '{name} unblocked',
    rejectTitle: 'Reject this request?',
    rejectMessage: '{name} stays blocked and sees your reason in the app.',
    reasonLabel: 'Reason',
    reasonPlaceholder: 'Why is this request being rejected?',
    reasonRequired: 'Please give a reason',
    rejected: 'Request from {name} rejected',
  },
};

const bn: typeof en = {
  stats: { pending: 'পর্যালোচনার অপেক্ষায়', approved: 'অনুমোদিত', rejected: 'বাতিল' },
  list: {
    title: 'আনব্লক অনুরোধ',
    hint: 'ব্লক হওয়া প্লেয়াররা এখানে অ্যাকাউন্ট ফিরে পেতে অনুরোধ করেন। আপনার সিদ্ধান্ত তাদের অ্যাপে জানানো হয়।',
    tabsLabel: 'স্ট্যাটাস অনুযায়ী অনুরোধ ফিল্টার করুন',
    player: 'প্লেয়ার',
    message: 'অনুরোধ',
    date: 'পাঠানো হয়েছে',
    status: 'স্ট্যাটাস',
    rowApprove: '{name} অনুমোদন করুন',
    rowReject: '{name} বাতিল করুন',
  },
  tabs: { all: 'সব', pending: 'অপেক্ষমাণ', approved: 'অনুমোদিত', rejected: 'বাতিল' },
  status: { pending: 'অপেক্ষমাণ', approved: 'অনুমোদিত', rejected: 'বাতিল' },
  actions: {
    approve: 'অনুমোদন',
    reject: 'বাতিল করুন',
    cancel: 'ফিরে যান',
    approveTitle: 'এই প্লেয়ারকে আনব্লক করবেন?',
    approveMessage: '{name} সঙ্গে সঙ্গে পূর্ণ অ্যাক্সেস ফিরে পাবেন এবং নোটিফিকেশন পাবেন।',
    approved: '{name} আনব্লক হয়েছেন',
    rejectTitle: 'এই অনুরোধ বাতিল করবেন?',
    rejectMessage: '{name} ব্লকই থাকবেন এবং অ্যাপে আপনার দেওয়া কারণ দেখতে পাবেন।',
    reasonLabel: 'কারণ',
    reasonPlaceholder: 'এই অনুরোধ কেন বাতিল করা হচ্ছে?',
    reasonRequired: 'অনুগ্রহ করে একটি কারণ লিখুন',
    rejected: '{name}-এর অনুরোধ বাতিল হয়েছে',
  },
};

export const appealsMessages = defineMessages({ en, bn });
