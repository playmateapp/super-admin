import { defineMessages } from '@/lib/i18n';

/** Copy of the sign-in, password-reset and settings screens (Figma "Login" + reset frames). */
const en = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Sign in to access PlayMate admin panel.',
    phone: 'Mobile Number',
    phonePlaceholder: 'Inter Your Mobile Number',
    password: 'Password',
    passwordPlaceholder: 'Password',
    forgot: 'Forget Password',
    submit: 'Login',
    submitting: 'Signing in…',
  },
  forgot: {
    title: 'Forgot Password',
    subtitle: 'Enter your mobile number and we’ll send you a verification code.',
    submit: 'Send Code',
    sending: 'Sending…',
    backToLogin: 'Back to Login',
  },
  verify: {
    title: 'Verify Your Mobile Number',
    sentTo: 'We’ve sent a {count} digit code to',
    codeLabel: 'Enter your Verification code',
    digit: 'Digit {n}',
    submit: 'Send Code',
    verifying: 'Verifying…',
    resend: 'Didn’t receive the code? Resend',
    resendIn: 'Resend code in {seconds}s',
  },
  reset: {
    title: 'Reset Your Password',
    subtitle: 'Reset Your Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    placeholder: 'Password',
    submit: 'Reset Password',
    saving: 'Saving…',
  },
  success: {
    title: 'Successful Set Your Password',
    toLogin: 'Go to Login',
  },
  settings: {
    title: 'Settings',
    cardTitle: 'Change your password',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    submit: 'Save Password',
    saving: 'Saving…',
    saved: 'Password updated',
  },
  account: {
    menu: 'Account menu',
    signedInAs: 'Signed in as',
    settings: 'Settings',
    logout: 'Logout',
  },
  logout: {
    title: 'Log Out?',
    message: 'Are you sure you want to log out of your PlayMate Admin account?',
    cancel: 'Cancel',
    confirm: 'Yes',
  },
  /** Error popups (Figma error frames: title + message). */
  alerts: {
    close: 'Close',
    phoneEmpty: { title: 'Empty Mobile Number', message: 'Mobile number is required.' },
    phoneInvalid: {
      title: 'Invalid Mobile Number',
      message: 'Please enter a valid mobile number.',
    },
    passwordEmpty: { title: 'Empty Password', message: 'Password is required.' },
    credentials: {
      title: 'Incorrect Login Credentials',
      message: 'The mobile number or password is incorrect.',
    },
    notAdmin: {
      title: 'Not an Admin Account',
      message: 'This number can’t access the PlayMate admin panel.',
    },
    blocked: { title: 'Account Blocked', message: 'This account has been blocked.' },
    notRegistered: {
      title: 'Mobile Number Not Registered',
      message: 'This number doesn’t exist.',
    },
    codeIncorrect: {
      title: 'Incorrect Verification Code',
      message: 'Incorrect verification code. Please try again.',
    },
    codeExpired: {
      title: 'Expired Verification Code',
      message: 'This verification code has expired. Please request a new code.',
    },
    codeResent: {
      title: 'OTP Resent Successfully',
      message: 'A new code was sent to your number.',
    },
    tooMany: {
      title: 'Too Many Requests',
      message: 'Please wait a few minutes before trying again.',
    },
    smsFailed: {
      title: 'Couldn’t Send the Code',
      message: 'We couldn’t send an SMS to this number. Try again later.',
    },
    samePassword: {
      title: 'Same Password',
      message: 'The new password must be different from the old one.',
    },
    unknown: { title: 'Something Went Wrong', message: 'Please try again.' },
  },
  errors: {
    required: 'This field is required',
    phone: 'Please enter a valid mobile number.',
    passwordRequired: 'Password is required.',
    passwordMin: 'Password must be at least 8 characters.',
    confirmRequired: 'Please confirm your password.',
    mismatch: 'Passwords do not match.',
    code: 'Enter the full code',
  },
};

const bn: typeof en = {
  login: {
    title: 'আবার স্বাগতম',
    subtitle: 'প্লেমেট অ্যাডমিন প্যানেলে প্রবেশ করতে সাইন ইন করুন।',
    phone: 'মোবাইল নম্বর',
    phonePlaceholder: 'আপনার মোবাইল নম্বর লিখুন',
    password: 'পাসওয়ার্ড',
    passwordPlaceholder: 'পাসওয়ার্ড',
    forgot: 'পাসওয়ার্ড ভুলে গেছেন',
    submit: 'লগইন',
    submitting: 'সাইন ইন হচ্ছে…',
  },
  forgot: {
    title: 'পাসওয়ার্ড ভুলে গেছেন',
    subtitle: 'আপনার মোবাইল নম্বর দিন, আমরা একটি যাচাই কোড পাঠাব।',
    submit: 'কোড পাঠান',
    sending: 'পাঠানো হচ্ছে…',
    backToLogin: 'লগইনে ফিরে যান',
  },
  verify: {
    title: 'আপনার মোবাইল নম্বর যাচাই করুন',
    sentTo: 'আমরা একটি {count} সংখ্যার কোড পাঠিয়েছি',
    codeLabel: 'যাচাই কোড লিখুন',
    digit: 'অঙ্ক {n}',
    submit: 'কোড যাচাই করুন',
    verifying: 'যাচাই হচ্ছে…',
    resend: 'কোড পাননি? আবার পাঠান',
    resendIn: '{seconds} সেকেন্ড পর আবার পাঠান',
  },
  reset: {
    title: 'পাসওয়ার্ড রিসেট করুন',
    subtitle: 'নতুন পাসওয়ার্ড সেট করুন',
    newPassword: 'নতুন পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    placeholder: 'পাসওয়ার্ড',
    submit: 'পাসওয়ার্ড রিসেট করুন',
    saving: 'সংরক্ষণ হচ্ছে…',
  },
  success: {
    title: 'পাসওয়ার্ড সফলভাবে সেট হয়েছে',
    toLogin: 'লগইনে যান',
  },
  settings: {
    title: 'সেটিংস',
    cardTitle: 'পাসওয়ার্ড পরিবর্তন করুন',
    oldPassword: 'পুরনো পাসওয়ার্ড',
    newPassword: 'নতুন পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    submit: 'পাসওয়ার্ড সংরক্ষণ',
    saving: 'সংরক্ষণ হচ্ছে…',
    saved: 'পাসওয়ার্ড পরিবর্তন হয়েছে',
  },
  account: {
    menu: 'অ্যাকাউন্ট মেনু',
    signedInAs: 'সাইন ইন করেছেন',
    settings: 'সেটিংস',
    logout: 'লগআউট',
  },
  logout: {
    title: 'লগ আউট?',
    message: 'আপনি কি প্লেমেট অ্যাডমিন অ্যাকাউন্ট থেকে লগ আউট করতে চান?',
    cancel: 'বাতিল',
    confirm: 'হ্যাঁ',
  },
  alerts: {
    close: 'বন্ধ করুন',
    phoneEmpty: { title: 'মোবাইল নম্বর নেই', message: 'মোবাইল নম্বর আবশ্যক।' },
    phoneInvalid: { title: 'ভুল মোবাইল নম্বর', message: 'সঠিক মোবাইল নম্বর লিখুন।' },
    passwordEmpty: { title: 'পাসওয়ার্ড নেই', message: 'পাসওয়ার্ড আবশ্যক।' },
    credentials: {
      title: 'লগইন তথ্য সঠিক নয়',
      message: 'মোবাইল নম্বর বা পাসওয়ার্ড ভুল।',
    },
    notAdmin: {
      title: 'অ্যাডমিন অ্যাকাউন্ট নয়',
      message: 'এই নম্বর দিয়ে প্লেমেট অ্যাডমিন প্যানেলে প্রবেশ করা যাবে না।',
    },
    blocked: { title: 'অ্যাকাউন্ট ব্লকড', message: 'এই অ্যাকাউন্টটি ব্লক করা হয়েছে।' },
    notRegistered: {
      title: 'মোবাইল নম্বর নিবন্ধিত নয়',
      message: 'এই নম্বরটি পাওয়া যায়নি।',
    },
    codeIncorrect: {
      title: 'ভুল যাচাই কোড',
      message: 'যাচাই কোডটি ভুল। আবার চেষ্টা করুন।',
    },
    codeExpired: {
      title: 'যাচাই কোডের মেয়াদ শেষ',
      message: 'এই কোডের মেয়াদ শেষ হয়েছে। নতুন কোড চান।',
    },
    codeResent: {
      title: 'কোড আবার পাঠানো হয়েছে',
      message: 'আপনার নম্বরে নতুন কোড পাঠানো হয়েছে।',
    },
    tooMany: {
      title: 'অনেকবার চেষ্টা করা হয়েছে',
      message: 'কয়েক মিনিট অপেক্ষা করে আবার চেষ্টা করুন।',
    },
    smsFailed: {
      title: 'কোড পাঠানো যায়নি',
      message: 'এই নম্বরে এসএমএস পাঠানো যায়নি। পরে আবার চেষ্টা করুন।',
    },
    samePassword: {
      title: 'একই পাসওয়ার্ড',
      message: 'নতুন পাসওয়ার্ড পুরনোটির থেকে আলাদা হতে হবে।',
    },
    unknown: { title: 'কিছু একটা সমস্যা হয়েছে', message: 'আবার চেষ্টা করুন।' },
  },
  errors: {
    required: 'এই ঘরটি পূরণ করা আবশ্যক',
    phone: 'সঠিক মোবাইল নম্বর লিখুন।',
    passwordRequired: 'পাসওয়ার্ড আবশ্যক।',
    passwordMin: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।',
    confirmRequired: 'পাসওয়ার্ড নিশ্চিত করুন।',
    mismatch: 'পাসওয়ার্ড মেলেনি।',
    code: 'পুরো কোডটি লিখুন',
  },
};

export const authMessages = defineMessages({ en, bn });
export type AuthMessages = typeof en;
export type AuthAlertKey = keyof Omit<AuthMessages['alerts'], 'close'>;
