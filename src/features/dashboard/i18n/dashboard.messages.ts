import { defineMessages } from '@/lib/i18n';

/** Copy of the Dashboard (Figma "Dashboard" admin frame). */
const en = {
  stats: {
    users: 'Total User',
    teams: 'Total Teams',
    matches: 'Total Matches',
    subscriptions: 'Active Subscription',
    revenue: 'Total Revenue',
  },
  subscriptionStatus: {
    title: 'Subscription Status',
    subtitle: 'Quick Update',
    active: 'Active',
    expiring: 'Expiring Soon',
    expired: 'Expired',
    centre: 'Active',
    chartLabel: 'Subscriptions by status: {summary}',
  },
  revenue: {
    title: 'Revenue Overview',
    subtitle: 'Last 6 months',
    chartLabel: 'Revenue per month for the last 6 months',
  },
  growth: {
    title: 'User Growth',
    subtitle: 'Last 6 months',
    chartLabel: 'Total users at the end of each of the last 6 months',
    users: '{count} users',
  },
  recentUsers: {
    title: 'Recent User',
    name: 'Name',
    type: 'Type',
    status: 'Status',
    joined: 'Joined',
    empty: 'No users yet',
  },
  recentPayments: {
    title: 'Recent Payments',
    team: 'Team',
    amount: 'Amount',
    status: 'Status',
    date: 'Date',
    empty: 'No payments yet',
    free: 'Free',
  },
  /** `one` is used when count = 1. */
  ago: {
    now: 'Just now',
    minute: { one: '{count} min ago', other: '{count} min ago' },
    hour: { one: '{count} hour ago', other: '{count} hours ago' },
    day: { one: '{count} day ago', other: '{count} days ago' },
    week: { one: '{count} week ago', other: '{count} weeks ago' },
    month: { one: '{count} month ago', other: '{count} months ago' },
    year: { one: '{count} year ago', other: '{count} years ago' },
  },
};

const bn: typeof en = {
  stats: {
    users: 'মোট ইউজার',
    teams: 'মোট টিম',
    matches: 'মোট ম্যাচ',
    subscriptions: 'সক্রিয় সাবস্ক্রিপশন',
    revenue: 'মোট আয়',
  },
  subscriptionStatus: {
    title: 'সাবস্ক্রিপশন স্ট্যাটাস',
    subtitle: 'সংক্ষিপ্ত হালনাগাদ',
    active: 'সক্রিয়',
    expiring: 'শীঘ্রই মেয়াদ শেষ',
    expired: 'মেয়াদোত্তীর্ণ',
    centre: 'সক্রিয়',
    chartLabel: 'স্ট্যাটাস অনুযায়ী সাবস্ক্রিপশন: {summary}',
  },
  revenue: {
    title: 'আয়ের সারসংক্ষেপ',
    subtitle: 'গত ৬ মাস',
    chartLabel: 'গত ৬ মাসের মাসিক আয়',
  },
  growth: {
    title: 'ইউজার বৃদ্ধি',
    subtitle: 'গত ৬ মাস',
    chartLabel: 'গত ৬ মাসের প্রতি মাস শেষে মোট ইউজার',
    users: '{count} জন ইউজার',
  },
  recentUsers: {
    title: 'সাম্প্রতিক ইউজার',
    name: 'নাম',
    type: 'ধরন',
    status: 'স্ট্যাটাস',
    joined: 'যোগদান',
    empty: 'এখনও কোনো ইউজার নেই',
  },
  recentPayments: {
    title: 'সাম্প্রতিক পেমেন্ট',
    team: 'টিম',
    amount: 'পরিমাণ',
    status: 'স্ট্যাটাস',
    date: 'তারিখ',
    empty: 'এখনও কোনো পেমেন্ট নেই',
    free: 'ফ্রি',
  },
  ago: {
    now: 'এইমাত্র',
    minute: { one: '{count} মিনিট আগে', other: '{count} মিনিট আগে' },
    hour: { one: '{count} ঘণ্টা আগে', other: '{count} ঘণ্টা আগে' },
    day: { one: '{count} দিন আগে', other: '{count} দিন আগে' },
    week: { one: '{count} সপ্তাহ আগে', other: '{count} সপ্তাহ আগে' },
    month: { one: '{count} মাস আগে', other: '{count} মাস আগে' },
    year: { one: '{count} বছর আগে', other: '{count} বছর আগে' },
  },
};

export const dashboardMessages = defineMessages({ en, bn });
