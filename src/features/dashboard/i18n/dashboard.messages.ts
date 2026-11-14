import { defineMessages } from '@/lib/i18n';

/** Copy of the Dashboard (PM dashboard mock, 2026-11-14). */
const en = {
  banner: {
    greeting: 'Welcome back, {name}',
    fallbackName: 'Super Admin',
    subtitle: "Here's what's happening on PlayMate today.",
    rangeLabel: 'Time range for the charts',
    range: {
      1: 'Last 30 days',
      3: 'Last 3 months',
      6: 'Last 6 months',
      12: 'Last 12 months',
    },
  },
  stats: {
    players: 'Total Players',
    teams: 'Total Teams',
    turfs: 'Total Turfs',
    matches: 'Total Matches',
    subscriptions: 'Active Subscriptions',
    revenue: 'Total Revenue',
    vs: 'vs last 30 days',
    trendLabel: '{change} compared with 30 days ago',
  },
  growth: {
    title: 'User, Team & Turf Growth',
    players: 'Players',
    teams: 'Teams',
    turfs: 'Turfs',
    chartLabel: 'Total players, teams and turfs at the end of each month',
  },
  revenue: {
    title: 'Revenue Overview',
    chartLabel: 'Revenue per month',
  },
  subscriptionStatus: {
    title: 'Subscription Status',
    active: 'Active',
    expiring: 'Expiring Soon',
    expired: 'Expired',
    centre: 'Active',
    chartLabel: 'Subscriptions by status: {summary}',
  },
  playerStatus: {
    title: 'Player Status',
    active: 'Active Players',
    blocked: 'Blocked Players',
  },
  teamStatus: {
    title: 'Team Status',
    active: 'Active Teams',
    blocked: 'Blocked Teams',
  },
  divisions: {
    players: 'Players by Division',
    teams: 'Teams by Division',
    turfs: 'Turfs by Division',
    others: 'Others',
    notSet: 'Not set',
    empty: 'No data yet',
  },
  recentPlayers: {
    title: 'Recently Joined',
    empty: 'No players yet',
  },
  recentMatches: {
    title: 'Recent Matches',
    vs: 'vs',
    phase: {
      live: 'Live',
      finished: 'Completed',
      canceled: 'Canceled',
      upcoming: 'Upcoming',
    },
    today: 'Today, {time}',
    tomorrow: 'Tomorrow, {time}',
    yesterday: 'Yesterday, {time}',
    empty: 'No matches yet',
  },
  pending: {
    title: 'Pending Actions',
    turfRequests: 'Turf Listing Requests',
    playerAppeals: 'Appeal Requests (Blocked Players)',
    teamAppeals: 'Appeal Requests (Blocked Teams)',
    total: '{count} pending',
  },
  viewAll: 'View all',
  /** `one` is used when count = 1. */
  ago: {
    now: 'Just now',
    minute: { one: '{count} min ago', other: '{count} mins ago' },
    hour: { one: '{count} hour ago', other: '{count} hours ago' },
    day: { one: '{count} day ago', other: '{count} days ago' },
    week: { one: '{count} week ago', other: '{count} weeks ago' },
    month: { one: '{count} month ago', other: '{count} months ago' },
    year: { one: '{count} year ago', other: '{count} years ago' },
  },
};

const bn: typeof en = {
  banner: {
    greeting: 'স্বাগতম, {name}',
    fallbackName: 'সুপার অ্যাডমিন',
    subtitle: 'আজ PlayMate-এ যা ঘটছে।',
    rangeLabel: 'চার্টের সময়সীমা',
    range: {
      1: 'গত ৩০ দিন',
      3: 'গত ৩ মাস',
      6: 'গত ৬ মাস',
      12: 'গত ১২ মাস',
    },
  },
  stats: {
    players: 'মোট খেলোয়াড়',
    teams: 'মোট টিম',
    turfs: 'মোট টার্ফ',
    matches: 'মোট ম্যাচ',
    subscriptions: 'সক্রিয় সাবস্ক্রিপশন',
    revenue: 'মোট আয়',
    vs: 'গত ৩০ দিনের তুলনায়',
    trendLabel: '৩০ দিন আগের তুলনায় {change}',
  },
  growth: {
    title: 'খেলোয়াড়, টিম ও টার্ফ বৃদ্ধি',
    players: 'খেলোয়াড়',
    teams: 'টিম',
    turfs: 'টার্ফ',
    chartLabel: 'প্রতি মাস শেষে মোট খেলোয়াড়, টিম ও টার্ফ',
  },
  revenue: {
    title: 'আয়ের সারসংক্ষেপ',
    chartLabel: 'মাসিক আয়',
  },
  subscriptionStatus: {
    title: 'সাবস্ক্রিপশন স্ট্যাটাস',
    active: 'সক্রিয়',
    expiring: 'শীঘ্রই মেয়াদ শেষ',
    expired: 'মেয়াদোত্তীর্ণ',
    centre: 'সক্রিয়',
    chartLabel: 'স্ট্যাটাস অনুযায়ী সাবস্ক্রিপশন: {summary}',
  },
  playerStatus: {
    title: 'খেলোয়াড় স্ট্যাটাস',
    active: 'সক্রিয় খেলোয়াড়',
    blocked: 'ব্লক করা খেলোয়াড়',
  },
  teamStatus: {
    title: 'টিম স্ট্যাটাস',
    active: 'সক্রিয় টিম',
    blocked: 'ব্লক করা টিম',
  },
  divisions: {
    players: 'বিভাগ অনুযায়ী খেলোয়াড়',
    teams: 'বিভাগ অনুযায়ী টিম',
    turfs: 'বিভাগ অনুযায়ী টার্ফ',
    others: 'অন্যান্য',
    notSet: 'নির্ধারিত নয়',
    empty: 'এখনও কোনো তথ্য নেই',
  },
  recentPlayers: {
    title: 'সম্প্রতি যোগ দিয়েছেন',
    empty: 'এখনও কোনো খেলোয়াড় নেই',
  },
  recentMatches: {
    title: 'সাম্প্রতিক ম্যাচ',
    vs: 'বনাম',
    phase: {
      live: 'লাইভ',
      finished: 'সম্পন্ন',
      canceled: 'বাতিল',
      upcoming: 'আসন্ন',
    },
    today: 'আজ, {time}',
    tomorrow: 'আগামীকাল, {time}',
    yesterday: 'গতকাল, {time}',
    empty: 'এখনও কোনো ম্যাচ নেই',
  },
  pending: {
    title: 'অপেক্ষমাণ কাজ',
    turfRequests: 'টার্ফ লিস্টিং অনুরোধ',
    playerAppeals: 'আপিল অনুরোধ (ব্লক করা খেলোয়াড়)',
    teamAppeals: 'আপিল অনুরোধ (ব্লক করা টিম)',
    total: '{count}টি অপেক্ষমাণ',
  },
  viewAll: 'সব দেখুন',
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
