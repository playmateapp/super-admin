import { defineMessages } from '@/lib/i18n';

/** Copy owned by the shells: sidebar navigation, top bar and the sign-in frame. */
const en = {
  nav: {
    label: 'Main navigation',
    dashboard: 'Dashboard',
    users: 'Users',
    allUsers: 'All Users',
    teams: 'Teams',
    matches: 'Matches',
    venues: 'Venues',
    areas: 'Areas',
    subscriptions: 'Subscriptions',
    notifications: 'Notifications',
    notification: 'Notification',
    settings: 'Settings',
  },
  topbar: {
    openMenu: 'Open navigation',
    closeMenu: 'Close navigation',
    breadcrumb: 'Breadcrumb',
    home: 'Home',
  },
  authShell: {
    heroTitle: 'Manage the PlayMate Ecosystem',
    heroText:
      'Control users, teams, matches, subscriptions and keep the platform safe, fair and growing.',
    features: [
      { title: 'Manage the PlayMate Ecosystem', text: 'Manage players, team owners and admins' },
      { title: 'Team Management', text: 'Monitor teams, approvals and activities' },
      { title: 'Match Oversight', text: 'View and manage all matches' },
      { title: 'Subscription & Revenue', text: 'Track subscriptions and payments' },
      { title: 'Reports & Analytics', text: 'Get insights and make data-driven decisions' },
    ],
  },
};

const bn: typeof en = {
  nav: {
    label: 'প্রধান নেভিগেশন',
    dashboard: 'ড্যাশবোর্ড',
    users: 'ইউজার',
    allUsers: 'সব ইউজার',
    teams: 'টিম',
    matches: 'ম্যাচ',
    venues: 'ভেন্যু',
    areas: 'এলাকা',
    subscriptions: 'সাবস্ক্রিপশন',
    notifications: 'নোটিফিকেশন',
    notification: 'নোটিফিকেশন',
    settings: 'সেটিংস',
  },
  topbar: {
    openMenu: 'নেভিগেশন খুলুন',
    closeMenu: 'নেভিগেশন বন্ধ করুন',
    breadcrumb: 'ব্রেডক্রাম্ব',
    home: 'হোম',
  },
  authShell: {
    heroTitle: 'প্লেমেট ইকোসিস্টেম পরিচালনা করুন',
    heroText:
      'ইউজার, টিম, ম্যাচ ও সাবস্ক্রিপশন নিয়ন্ত্রণ করুন এবং প্ল্যাটফর্মকে নিরাপদ, ন্যায্য ও বর্ধনশীল রাখুন।',
    features: [
      {
        title: 'প্লেমেট ইকোসিস্টেম পরিচালনা',
        text: 'খেলোয়াড়, টিম মালিক ও অ্যাডমিন পরিচালনা করুন',
      },
      { title: 'টিম ব্যবস্থাপনা', text: 'টিম, অনুমোদন ও কার্যক্রম পর্যবেক্ষণ করুন' },
      { title: 'ম্যাচ তদারকি', text: 'সব ম্যাচ দেখুন ও পরিচালনা করুন' },
      { title: 'সাবস্ক্রিপশন ও আয়', text: 'সাবস্ক্রিপশন ও পেমেন্ট ট্র্যাক করুন' },
      { title: 'রিপোর্ট ও বিশ্লেষণ', text: 'তথ্যভিত্তিক সিদ্ধান্ত নিতে অন্তর্দৃষ্টি পান' },
    ],
  },
};

export const layoutMessages = defineMessages({ en, bn });
export type NavLabelKey = keyof typeof en.nav;
