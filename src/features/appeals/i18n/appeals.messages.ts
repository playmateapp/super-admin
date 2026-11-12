import { defineMessages } from '@/lib/i18n';

/** Copy of the Appeals module (no Figma frame — follows the Areas screen). */
const en = {
  stats: { pending: 'Waiting for review', approved: 'Approved', rejected: 'Rejected' },
  list: {
    title: 'Unblock Requests',
    hint: 'Blocked players ask here to get their account back. They are told your decision in the app.',
    teamHint:
      'Owners of blocked teams ask here to get their team back. The owner is told your decision in the app.',
    tabsLabel: 'Filter requests by status',
    kindLabel: 'Show requests for',
    player: 'Player',
    team: 'Team',
    owner: 'Owner',
    message: 'Request',
    date: 'Sent',
    status: 'Status',
    rowView: 'View team {name}',
    rowApprove: 'Approve {name}',
    rowReject: 'Reject {name}',
  },
  kinds: { user: 'Players', team: 'Teams' },
  tabs: { all: 'All', pending: 'Pending', approved: 'Approved', rejected: 'Rejected' },
  status: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' },
  actions: {
    viewTeam: 'View team',
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
    approveTeamTitle: 'Unblock this team?',
    approveTeamMessage:
      '{name} is visible again and can challenge and play right away. Its owner and captains are notified.',
    rejectTeamMessage: '{name} stays blocked. The owner sees your reason in the app.',
  },
};

const bn: typeof en = {
  stats: { pending: 'পর্যালোচনার অপেক্ষায়', approved: 'অনুমোদিত', rejected: 'বাতিল' },
  list: {
    title: 'আনব্লক অনুরোধ',
    hint: 'ব্লক হওয়া প্লেয়াররা এখানে অ্যাকাউন্ট ফিরে পেতে অনুরোধ করেন। আপনার সিদ্ধান্ত তাদের অ্যাপে জানানো হয়।',
    teamHint:
      'ব্লক হওয়া টিমের মালিকরা এখানে টিম ফিরে পেতে অনুরোধ করেন। আপনার সিদ্ধান্ত মালিককে অ্যাপে জানানো হয়।',
    tabsLabel: 'স্ট্যাটাস অনুযায়ী অনুরোধ ফিল্টার করুন',
    kindLabel: 'যাদের অনুরোধ দেখাবে',
    player: 'প্লেয়ার',
    team: 'টিম',
    owner: 'মালিক',
    message: 'অনুরোধ',
    date: 'পাঠানো হয়েছে',
    status: 'স্ট্যাটাস',
    rowView: 'টিম {name} দেখুন',
    rowApprove: '{name} অনুমোদন করুন',
    rowReject: '{name} বাতিল করুন',
  },
  kinds: { user: 'প্লেয়ার', team: 'টিম' },
  tabs: { all: 'সব', pending: 'অপেক্ষমাণ', approved: 'অনুমোদিত', rejected: 'বাতিল' },
  status: { pending: 'অপেক্ষমাণ', approved: 'অনুমোদিত', rejected: 'বাতিল' },
  actions: {
    viewTeam: 'টিম দেখুন',
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
    approveTeamTitle: 'এই টিম আনব্লক করবেন?',
    approveTeamMessage:
      '{name} আবার দেখা যাবে এবং সঙ্গে সঙ্গে চ্যালেঞ্জ ও ম্যাচ খেলতে পারবে। মালিক ও ক্যাপ্টেনরা নোটিফিকেশন পাবেন।',
    rejectTeamMessage: '{name} ব্লকই থাকবে। মালিক অ্যাপে আপনার দেওয়া কারণ দেখতে পাবেন।',
  },
};

export const appealsMessages = defineMessages({ en, bn });
