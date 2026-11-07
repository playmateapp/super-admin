import { defineMessages } from '@/lib/i18n';

interface PolicySection {
  title: string;
  paragraphs?: string[];
  items?: string[];
  closing?: string;
}

/** Privacy policy copy. `{email}` becomes the contact link. */
const en = {
  title: 'Privacy Policy',
  effective: 'Effective date: 7 November 2026',
  intro:
    'This policy explains how PlayMate ("we", "us") handles your information when you use the PlayMate mobile app. PlayMate helps football players find each other, build teams, challenge other teams and run matches.',
  sections: [
    {
      title: 'Information we collect',
      paragraphs: ['You give us this information when you use the app:'],
      items: [
        'Account details: your mobile number and password. We send a one-time code by SMS to verify your number.',
        'Player profile: your name, date of birth, position, area, a short bio, profile and cover photos, and any other photos you add.',
        'Team and match activity: teams you create or join, join requests, offers, challenges, squads, match events such as goals and cards, and your statistics.',
        'Messages: the chat messages you send to other users.',
        'Saved items: the players and teams you save.',
        'Subscription records: the team, plan, amount, payment method and status. We do not currently collect card or mobile wallet details.',
        'Requests to us: the unblock requests you send if your account is blocked.',
      ],
      closing:
        'We also collect a device token and your device platform so we can send push notifications. Our service providers may keep technical logs, such as your IP address, to run and secure the service.',
    },
    {
      title: 'Information we do not collect',
      items: [
        'We do not access your GPS location or your phone contacts.',
        'The app contains no advertising, and we do not sell your personal information.',
      ],
    },
    {
      title: 'How we use your information',
      items: [
        'To create your account, verify your number and keep you signed in.',
        'To run the app features, including player and team profiles, challenges, live matches, chat and statistics.',
        'To send you notifications about activity that involves you.',
        'To manage team subscriptions.',
        'To keep the service safe, investigate abuse, enforce our rules and handle unblock requests.',
      ],
    },
    {
      title: 'What other people can see',
      paragraphs: [
        'PlayMate is a community app. Other signed-in players can see your name, photos, Player ID, position, area, age, availability, bio, team and match statistics. Your teams and match results can also be seen by other players.',
        'Your phone number is not shown on your player profile.',
        'Photos you upload are stored at web addresses that anyone who has the link can open, so only upload photos you are comfortable sharing.',
        'Chat messages are visible to the people in that conversation. They are not end-to-end encrypted, and we may review them when needed to investigate abuse or meet a legal duty.',
      ],
    },
    {
      title: 'Service providers we share information with',
      paragraphs: ['We share information only as needed with providers who run parts of PlayMate:'],
      items: [
        'Supabase: database, sign-in and photo storage.',
        'Twilio: sending SMS verification codes.',
        'Google Firebase Cloud Messaging: delivering push notifications.',
      ],
      closing:
        'We may also disclose information if the law requires it, or to protect the safety and rights of our users and PlayMate. These providers may process information outside your country.',
    },
    {
      title: 'Security',
      paragraphs: [
        'Information is sent over encrypted connections, and we use access rules to limit who can read or change data. No online service is completely secure, so we cannot guarantee absolute security.',
      ],
    },
    {
      title: 'How long we keep information',
      paragraphs: [
        'We keep your information while your account is active. When you delete your account, we delete your personal information within 30 days, unless we must keep certain records to meet a legal duty, resolve a dispute or prevent abuse.',
      ],
    },
    {
      title: 'Your choices and rights',
      items: [
        'You can view and update your profile in the app.',
        'You can turn off notifications in your device settings.',
        'You can ask us for a copy of your information, or ask us to correct or delete it, by emailing {email}.',
      ],
    },
    {
      title: 'Deleting your account',
      paragraphs: [
        'To delete your account and its data, email {email} and include your Player ID and the mobile number on your account. We may ask you to confirm that the account is yours.',
      ],
    },
    {
      title: 'Children',
      paragraphs: [
        'PlayMate is not intended for children under 13. If you believe a child under 13 has given us personal information, contact us and we will delete it.',
      ],
    },
    {
      title: 'Changes to this policy',
      paragraphs: [
        'We may update this policy. When we do, we will post the new version on this page and change the effective date.',
      ],
    },
    {
      title: 'Contact us',
      paragraphs: ['If you have questions about this policy or your data, email {email}.'],
    },
  ] as PolicySection[],
};

const bn: typeof en = {
  title: 'প্রাইভেসি পলিসি',
  effective: 'কার্যকর হওয়ার তারিখ: ৭ নভেম্বর ২০২৬',
  intro:
    'আপনি PlayMate মোবাইল অ্যাপ ব্যবহার করলে PlayMate ("আমরা") আপনার তথ্য কীভাবে ব্যবহার করে, এই পলিসিতে তা ব্যাখ্যা করা হয়েছে। PlayMate ফুটবল খেলোয়াড়দের একে অপরকে খুঁজে পেতে, দল গড়তে, অন্য দলকে চ্যালেঞ্জ করতে এবং ম্যাচ পরিচালনা করতে সাহায্য করে।',
  sections: [
    {
      title: 'আমরা যে তথ্য সংগ্রহ করি',
      paragraphs: ['অ্যাপ ব্যবহারের সময় আপনি আমাদের এই তথ্যগুলো দেন:'],
      items: [
        'অ্যাকাউন্টের তথ্য: আপনার মোবাইল নম্বর ও পাসওয়ার্ড। নম্বর যাচাই করতে আমরা SMS-এ একটি ওয়ান-টাইম কোড পাঠাই।',
        'প্লেয়ার প্রোফাইল: আপনার নাম, জন্মতারিখ, পজিশন, এলাকা, সংক্ষিপ্ত পরিচিতি, প্রোফাইল ও কভার ছবি এবং আপনার যোগ করা অন্যান্য ছবি।',
        'দল ও ম্যাচের কার্যক্রম: আপনার তৈরি করা বা যোগ দেওয়া দল, জয়েন রিকোয়েস্ট, অফার, চ্যালেঞ্জ, স্কোয়াড, গোল ও কার্ডের মতো ম্যাচের ঘটনা এবং আপনার পরিসংখ্যান।',
        'মেসেজ: অন্য ব্যবহারকারীদের পাঠানো আপনার চ্যাট মেসেজ।',
        'সেভ করা তথ্য: আপনার সেভ করা প্লেয়ার ও দল।',
        'সাবস্ক্রিপশনের রেকর্ড: দল, প্ল্যান, পরিমাণ, পেমেন্টের মাধ্যম ও স্ট্যাটাস। আমরা বর্তমানে কার্ড বা মোবাইল ওয়ালেটের তথ্য সংগ্রহ করি না।',
        'আমাদের কাছে করা অনুরোধ: অ্যাকাউন্ট ব্লক হলে আপনার পাঠানো আনব্লকের অনুরোধ।',
      ],
      closing:
        'পুশ নোটিফিকেশন পাঠানোর জন্য আমরা একটি ডিভাইস টোকেন ও আপনার ডিভাইসের প্ল্যাটফর্মের তথ্যও সংগ্রহ করি। সেবা চালু ও সুরক্ষিত রাখতে আমাদের সেবাদাতারা আপনার IP ঠিকানার মতো টেকনিক্যাল লগ রাখতে পারে।',
    },
    {
      title: 'আমরা যে তথ্য সংগ্রহ করি না',
      items: [
        'আমরা আপনার GPS লোকেশন বা ফোনের কনট্যাক্ট অ্যাক্সেস করি না।',
        'অ্যাপে কোনো বিজ্ঞাপন নেই এবং আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না।',
      ],
    },
    {
      title: 'আমরা আপনার তথ্য যেভাবে ব্যবহার করি',
      items: [
        'আপনার অ্যাকাউন্ট তৈরি করতে, নম্বর যাচাই করতে এবং আপনাকে সাইন ইন রাখতে।',
        'প্লেয়ার ও দলের প্রোফাইল, চ্যালেঞ্জ, লাইভ ম্যাচ, চ্যাট ও পরিসংখ্যানসহ অ্যাপের ফিচার চালাতে।',
        'আপনার সঙ্গে সম্পর্কিত কার্যক্রমের নোটিফিকেশন পাঠাতে।',
        'দলের সাবস্ক্রিপশন পরিচালনা করতে।',
        'সেবা নিরাপদ রাখতে, অপব্যবহার তদন্ত করতে, আমাদের নিয়ম প্রয়োগ করতে এবং আনব্লকের অনুরোধ দেখতে।',
      ],
    },
    {
      title: 'অন্যরা যা দেখতে পারেন',
      paragraphs: [
        'PlayMate একটি কমিউনিটি অ্যাপ। সাইন ইন করা অন্য প্লেয়াররা আপনার নাম, ছবি, Player ID, পজিশন, এলাকা, বয়স, প্রাপ্যতা, পরিচিতি, দল ও ম্যাচের পরিসংখ্যান দেখতে পারেন। আপনার দল ও ম্যাচের ফলাফলও অন্য প্লেয়াররা দেখতে পারেন।',
        'আপনার ফোন নম্বর আপনার প্লেয়ার প্রোফাইলে দেখানো হয় না।',
        'আপনার আপলোড করা ছবি এমন ওয়েব ঠিকানায় রাখা হয়, যার লিংক থাকলে যে কেউ তা খুলতে পারেন। তাই শুধু সেই ছবিই আপলোড করুন যা শেয়ার করতে আপনি স্বচ্ছন্দ।',
        'চ্যাট মেসেজ শুধু সেই কথোপকথনে থাকা ব্যক্তিরা দেখতে পারেন। এগুলো এন্ড-টু-এন্ড এনক্রিপ্টেড নয়, এবং অপব্যবহার তদন্ত বা আইনি দায়িত্ব পালনের প্রয়োজনে আমরা এগুলো পর্যালোচনা করতে পারি।',
      ],
    },
    {
      title: 'যেসব সেবাদাতার সঙ্গে আমরা তথ্য শেয়ার করি',
      paragraphs: [
        'PlayMate-এর বিভিন্ন অংশ চালায় এমন সেবাদাতাদের সঙ্গে আমরা শুধু প্রয়োজন অনুযায়ী তথ্য শেয়ার করি:',
      ],
      items: [
        'Supabase: ডেটাবেস, সাইন ইন ও ছবি সংরক্ষণ।',
        'Twilio: SMS যাচাইকরণ কোড পাঠানো।',
        'Google Firebase Cloud Messaging: পুশ নোটিফিকেশন পৌঁছে দেওয়া।',
      ],
      closing:
        'আইনের প্রয়োজনে, অথবা আমাদের ব্যবহারকারী ও PlayMate-এর নিরাপত্তা ও অধিকার রক্ষায় আমরা তথ্য প্রকাশ করতে পারি। এই সেবাদাতারা আপনার দেশের বাইরেও তথ্য প্রক্রিয়া করতে পারে।',
    },
    {
      title: 'নিরাপত্তা',
      paragraphs: [
        'তথ্য এনক্রিপ্টেড সংযোগের মাধ্যমে পাঠানো হয়, এবং কে ডেটা পড়তে বা বদলাতে পারবে তা আমরা অ্যাক্সেস নিয়মের মাধ্যমে সীমিত রাখি। কোনো অনলাইন সেবাই সম্পূর্ণ নিরাপদ নয়, তাই আমরা পূর্ণ নিরাপত্তার নিশ্চয়তা দিতে পারি না।',
      ],
    },
    {
      title: 'আমরা কতদিন তথ্য রাখি',
      paragraphs: [
        'আপনার অ্যাকাউন্ট সক্রিয় থাকা পর্যন্ত আমরা আপনার তথ্য রাখি। আপনি অ্যাকাউন্ট ডিলিট করলে আমরা ৩০ দিনের মধ্যে আপনার ব্যক্তিগত তথ্য মুছে ফেলি, তবে আইনি দায়িত্ব পালন, বিরোধ নিষ্পত্তি বা অপব্যবহার প্রতিরোধের জন্য প্রয়োজনীয় কিছু রেকর্ড রাখা হতে পারে।',
      ],
    },
    {
      title: 'আপনার পছন্দ ও অধিকার',
      items: [
        'আপনি অ্যাপে আপনার প্রোফাইল দেখতে ও আপডেট করতে পারেন।',
        'ডিভাইসের সেটিংস থেকে আপনি নোটিফিকেশন বন্ধ করতে পারেন।',
        'আপনার তথ্যের কপি চাইতে, অথবা তথ্য সংশোধন বা ডিলিট করার অনুরোধ জানাতে {email} ঠিকানায় ইমেইল করুন।',
      ],
    },
    {
      title: 'অ্যাকাউন্ট ডিলিট করা',
      paragraphs: [
        'আপনার অ্যাকাউন্ট ও এর ডেটা ডিলিট করতে {email} ঠিকানায় ইমেইল করুন এবং আপনার Player ID ও অ্যাকাউন্টের মোবাইল নম্বর লিখুন। অ্যাকাউন্টটি আপনার কি না তা নিশ্চিত করতে আমরা আপনাকে অনুরোধ করতে পারি।',
      ],
    },
    {
      title: 'শিশু',
      paragraphs: [
        'PlayMate ১৩ বছরের কম বয়সী শিশুদের জন্য নয়। ১৩ বছরের কম বয়সী কোনো শিশু আমাদের ব্যক্তিগত তথ্য দিয়েছে বলে মনে হলে আমাদের জানান, আমরা তা মুছে ফেলব।',
      ],
    },
    {
      title: 'এই পলিসির পরিবর্তন',
      paragraphs: [
        'আমরা এই পলিসি আপডেট করতে পারি। আপডেট হলে নতুন সংস্করণ এই পেজে প্রকাশ করা হবে এবং কার্যকর হওয়ার তারিখ বদলে দেওয়া হবে।',
      ],
    },
    {
      title: 'যোগাযোগ',
      paragraphs: ['এই পলিসি বা আপনার ডেটা নিয়ে কোনো প্রশ্ন থাকলে {email} ঠিকানায় ইমেইল করুন।'],
    },
  ],
};

export const legalMessages = defineMessages({ en, bn });
