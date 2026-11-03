import { z } from 'zod';

import { isPhoneLike } from '@/lib/utils';

import type { AuthMessages } from '../i18n/auth.messages';

/**
 * Auth form schemas, built from the active language's messages so zod errors are already
 * localised. Login only checks presence — the server decides if the password is right.
 */
type E = AuthMessages['errors'];

const phone = (e: E) => z.string().trim().min(1, e.required).refine(isPhoneLike, e.phone);

export const loginSchema = (e: E) =>
  z.object({ phone: phone(e), password: z.string().min(1, e.passwordRequired) });
export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;

export const phoneSchema = (e: E) => z.object({ phone: phone(e) });
export type PhoneFormValues = z.infer<ReturnType<typeof phoneSchema>>;

const newPasswordFields = (e: E) => ({
  newPassword: z.string().min(1, e.passwordRequired).min(8, e.passwordMin),
  confirmPassword: z.string().min(1, e.confirmRequired),
});

export const resetSchema = (e: E) =>
  z.object(newPasswordFields(e)).refine((v) => v.newPassword === v.confirmPassword, {
    message: e.mismatch,
    path: ['confirmPassword'],
  });
export type ResetFormValues = z.infer<ReturnType<typeof resetSchema>>;

export const changePasswordSchema = (e: E) =>
  z
    .object({ oldPassword: z.string().min(1, e.passwordRequired), ...newPasswordFields(e) })
    .refine((v) => v.newPassword === v.confirmPassword, {
      message: e.mismatch,
      path: ['confirmPassword'],
    });
export type ChangePasswordFormValues = z.infer<ReturnType<typeof changePasswordSchema>>;
