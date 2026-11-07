import { defineMessages } from '@/lib/i18n';

/** Copy of the admin Notifications page (Figma "Notifications") and the top-bar bell. */
const en = {
  title: 'Notifications',
  bell: 'Notifications, {count} new',
  bellNone: 'Notifications',
  empty: 'No activity yet',
  emptyHint: 'New users, teams, subscriptions, matches and venues will show up here.',
  newBadge: 'New',
  ago: {
    now: 'now',
    minute: '{count}m',
    hour: '{count}h',
    day: '{count}d',
    week: '{count}w',
    month: '{count}mo',
    year: '{count}y',
  },
  kinds: {
    user_registered: {
      title: 'New User Registered',
      body: 'A new user, {name}, has registered on PlayMate.',
    },
    block_appeal: {
      title: 'Unblock Request',
      body: '{name} asked to get their account unblocked.',
    },
    team_created: {
      title: 'New Team Created',
      body: '{owner} created a new team, {team}.',
    },
    subscription_activated: {
      title: 'Team Subscription Activated',
      body: '{team} subscribed for ৳{amount}/month. Subscription period: {start} – {end}.',
    },
    subscription_activated_free: {
      title: 'Team Subscription Activated',
      body: '{team} took a free subscription (limited-time offer). Subscription period: {start} – {end}.',
    },
    subscription_expiring: {
      title: 'Subscription Expiring Soon',
      body: '{team}’s monthly subscription of ৳{amount} will expire on {end}. Renewal is required to keep the team active.',
    },
    subscription_expired: {
      title: 'Subscription Expired',
      body: '{team}’s monthly subscription expired on {end}. The team must renew its ৳{amount} subscription.',
    },
    match_scheduled: {
      title: 'Upcoming Match',
      body: '{home} vs {away} is scheduled for {date} at {time}.',
    },
    match_ready: {
      title: 'Match Ready to Start',
      body: '{home} vs {away} is scheduled to start at {time}.',
    },
    match_ongoing: {
      title: 'Match Ongoing',
      body: '{home} vs {away} is now live. Current score: {home} {hs}–{as} {away}.',
    },
    match_completed: {
      title: 'Match Completed',
      body: '{home} vs {away} has ended. Final score: {home} {hs}–{as} {away}.',
    },
    match_cancelled: {
      title: 'Match Cancelled',
      body: '{home} vs {away} has been cancelled.',
    },
    venue_added: {
      title: 'New Venue Added',
      body: '{owner} added a new venue, {venue}, to PlayMate.',
    },
  },
  admin: 'PlayMate admin',
};

const bn: typeof en = {
  title: 'নোটিফিকেশন',
  bell: 'নোটিফিকেশন, {count}টি নতুন',
  bellNone: 'নোটিফিকেশন',
  empty: 'এখনও কোনো কার্যক্রম নেই',
  emptyHint: 'নতুন ইউজার, টিম, সাবস্ক্রিপশন, ম্যাচ ও ভেন্যু এখানে দেখা যাবে।',
  newBadge: 'নতুন',
  ago: {
    now: 'এখন',
    minute: '{count} মি',
    hour: '{count} ঘ',
    day: '{count} দিন',
    week: '{count} সপ্তাহ',
    month: '{count} মাস',
    year: '{count} বছর',
  },
  kinds: {
    user_registered: {
      title: 'নতুন ইউজার নিবন্ধিত',
      body: 'নতুন ইউজার {name} প্লেমেটে নিবন্ধন করেছেন।',
    },
    block_appeal: {
      title: 'আনব্লক অনুরোধ',
      body: '{name} তার অ্যাকাউন্ট আনব্লক করার অনুরোধ করেছেন।',
    },
    team_created: {
      title: 'নতুন টিম তৈরি',
      body: '{owner} নতুন টিম {team} তৈরি করেছেন।',
    },
    subscription_activated: {
      title: 'টিম সাবস্ক্রিপশন সক্রিয়',
      body: '{team} মাসে ৳{amount} দিয়ে সাবস্ক্রাইব করেছে। মেয়াদ: {start} – {end}।',
    },
    subscription_activated_free: {
      title: 'টিম সাবস্ক্রিপশন সক্রিয়',
      body: '{team} ফ্রি সাবস্ক্রিপশন নিয়েছে (সীমিত সময়ের অফার)। মেয়াদ: {start} – {end}।',
    },
    subscription_expiring: {
      title: 'সাবস্ক্রিপশনের মেয়াদ শীঘ্রই শেষ',
      body: '{team} এর ৳{amount} মাসিক সাবস্ক্রিপশন {end} তারিখে শেষ হবে। টিম সক্রিয় রাখতে নবায়ন প্রয়োজন।',
    },
    subscription_expired: {
      title: 'সাবস্ক্রিপশনের মেয়াদ শেষ',
      body: '{team} এর মাসিক সাবস্ক্রিপশন {end} তারিখে শেষ হয়েছে। টিমকে ৳{amount} সাবস্ক্রিপশন নবায়ন করতে হবে।',
    },
    match_scheduled: {
      title: 'আসন্ন ম্যাচ',
      body: '{home} বনাম {away} ম্যাচটি {date} তারিখ {time} এ নির্ধারিত।',
    },
    match_ready: {
      title: 'ম্যাচ শুরুর জন্য প্রস্তুত',
      body: '{home} বনাম {away} ম্যাচটি {time} এ শুরু হবে।',
    },
    match_ongoing: {
      title: 'ম্যাচ চলছে',
      body: '{home} বনাম {away} এখন লাইভ। বর্তমান স্কোর: {home} {hs}–{as} {away}।',
    },
    match_completed: {
      title: 'ম্যাচ সম্পন্ন',
      body: '{home} বনাম {away} শেষ হয়েছে। চূড়ান্ত স্কোর: {home} {hs}–{as} {away}।',
    },
    match_cancelled: {
      title: 'ম্যাচ বাতিল',
      body: '{home} বনাম {away} ম্যাচটি বাতিল হয়েছে।',
    },
    venue_added: {
      title: 'নতুন ভেন্যু যোগ',
      body: '{owner} প্লেমেটে নতুন ভেন্যু {venue} যোগ করেছেন।',
    },
  },
  admin: 'প্লেমেট অ্যাডমিন',
};

export const notificationsMessages = defineMessages({ en, bn });
