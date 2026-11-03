'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';

import { FormWrapper, TextInput } from '@/components/form';
import { Button } from '@/components/ui';
import { interpolate, maskPhone, toE164 } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { AuthAlert } from '../components/auth-alert';
import { OtpInput } from '../components/otp-input';
import { useResetPassword, useSendResetCode, useVerifyResetCode } from '../hooks/mutations';
import { authMessages, type AuthAlertKey } from '../i18n/auth.messages';
import { AuthFlowError } from '../types';
import {
  phoneSchema,
  resetSchema,
  type PhoneFormValues,
  type ResetFormValues,
} from '../validations/auth.schema';

/** Twilio Verify (the SMS provider of the Supabase project) sends 6-digit codes. */
const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

type Step = 'phone' | 'code' | 'reset' | 'done';

const alertFor = (err: unknown, alerts: object): AuthAlertKey => {
  const reason = err instanceof AuthFlowError ? err.reason : 'unknown';
  return reason in alerts ? (reason as AuthAlertKey) : 'unknown';
};

function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex w-full max-w-[425px] flex-col gap-1.5 text-center">
      <h1 className="font-display text-[28px] font-bold leading-[1.5] text-content-primary">
        {title}
      </h1>
      {subtitle ? (
        <p className="font-display text-heading-sm text-content-muted">{subtitle}</p>
      ) : null}
    </div>
  );
}

/**
 * ForgotPasswordScreen — `/forgot-password` (Figma "Forgot Password" → "Verify Your Mobile
 * Number" → "Reset Your Password" → "Successful Set Your Password"). The SMS code signs the
 * admin in for one step so Supabase lets them set a new password; they then log in again.
 */
export function ForgotPasswordScreen() {
  const m = useMessages(authMessages);
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [alert, setAlert] = useState<AuthAlertKey | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const sendCode = useSendResetCode();
  const verify = useVerifyResetCode();
  const reset = useResetPassword();

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(useMemo(() => phoneSchema(m.errors), [m.errors])),
    defaultValues: { phone: '' },
  });
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(useMemo(() => resetSchema(m.errors), [m.errors])),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const onPhone = async ({ phone: value }: PhoneFormValues) => {
    try {
      await sendCode.mutateAsync(value);
      setPhone(value);
      setCode('');
      setResendIn(RESEND_SECONDS);
      setStep('code');
    } catch (err) {
      setAlert(alertFor(err, m.alerts));
    }
  };

  const onResend = async () => {
    try {
      await sendCode.mutateAsync(phone);
      setResendIn(RESEND_SECONDS);
      setCode('');
      setAlert('codeResent');
    } catch (err) {
      setAlert(alertFor(err, m.alerts));
    }
  };

  const onVerify = async () => {
    if (code.length < CODE_LENGTH) {
      setCodeInvalid(true);
      return;
    }
    try {
      await verify.mutateAsync({ phone, code });
      setStep('reset');
    } catch (err) {
      setCodeInvalid(true);
      setAlert(alertFor(err, m.alerts));
    }
  };

  const onReset = async ({ newPassword }: ResetFormValues) => {
    try {
      await reset.mutateAsync(newPassword);
      setStep('done');
    } catch (err) {
      setAlert(alertFor(err, m.alerts));
    }
  };

  const onResetInvalid = (errors: FieldErrors<ResetFormValues>) => {
    if (errors.newPassword && !resetForm.getValues('newPassword')) setAlert('passwordEmpty');
  };

  return (
    <>
      {step === 'phone' ? (
        <>
          <Heading title={m.forgot.title} subtitle={m.forgot.subtitle} />
          <FormWrapper
            form={phoneForm}
            onSubmit={onPhone}
            onInvalid={(errors) =>
              errors.phone &&
              setAlert(phoneForm.getValues('phone').trim() ? 'phoneInvalid' : 'phoneEmpty')
            }
            className="w-full gap-6"
          >
            <TextInput<PhoneFormValues>
              name="phone"
              type="tel"
              label={m.login.phone}
              placeholder={m.login.phonePlaceholder}
              autoComplete="tel"
              dir="ltr"
            />
            <Button type="submit" className="w-full" disabled={sendCode.isPending}>
              {sendCode.isPending ? m.forgot.sending : m.forgot.submit}
            </Button>
          </FormWrapper>
          <Link
            href="/login"
            className="font-display text-body-xs font-medium text-content-brand hover:underline"
          >
            {m.forgot.backToLogin}
          </Link>
        </>
      ) : null}

      {step === 'code' ? (
        <>
          <Heading title={m.verify.title} />
          <p className="-mt-4 text-center font-display text-heading-sm text-content-muted">
            {interpolate(m.verify.sentTo, { count: CODE_LENGTH })}
            <br />
            <span dir="ltr">{maskPhone(toE164(phone))}</span>
          </p>
          <div className="flex w-full flex-col gap-4">
            <p className="text-center font-display text-body-xs font-medium text-content-primary">
              {m.verify.codeLabel}
            </p>
            <OtpInput
              length={CODE_LENGTH}
              value={code}
              invalid={codeInvalid}
              onChange={(v) => {
                setCode(v);
                setCodeInvalid(false);
              }}
            />
            <Button className="w-full" onClick={onVerify} disabled={verify.isPending}>
              {verify.isPending ? m.verify.verifying : m.verify.submit}
            </Button>
            <Button
              variant="outline-brand"
              className="w-full"
              onClick={onResend}
              disabled={resendIn > 0 || sendCode.isPending}
            >
              {resendIn > 0
                ? interpolate(m.verify.resendIn, { seconds: resendIn })
                : m.verify.resend}
              <ArrowRight aria-hidden className="rtl:-scale-x-100" />
            </Button>
          </div>
        </>
      ) : null}

      {step === 'reset' ? (
        <>
          <Heading title={m.reset.title} subtitle={m.reset.subtitle} />
          <FormWrapper
            form={resetForm}
            onSubmit={onReset}
            onInvalid={onResetInvalid}
            className="w-full gap-6"
          >
            <div className="flex flex-col gap-4">
              <TextInput<ResetFormValues>
                name="newPassword"
                type="password"
                label={m.reset.newPassword}
                placeholder={m.reset.placeholder}
                autoComplete="new-password"
              />
              <TextInput<ResetFormValues>
                name="confirmPassword"
                type="password"
                label={m.reset.confirmPassword}
                placeholder={m.reset.placeholder}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={reset.isPending}>
              {reset.isPending ? m.reset.saving : m.reset.submit}
              <ArrowRight aria-hidden className="rtl:-scale-x-100" />
            </Button>
          </FormWrapper>
        </>
      ) : null}

      {step === 'done' ? (
        <>
          <div aria-hidden className="relative grid size-[150px] place-items-center">
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(var(--success)/0.18)_0%,transparent_70%)]" />
            <span className="grid size-[60px] place-items-center rounded-full bg-success text-content-on-brand">
              <Check className="size-8" strokeWidth={3} />
            </span>
          </div>
          <Heading title={m.success.title} />
          <Button asChild className="w-full">
            <Link href="/login">
              {m.success.toLogin}
              <ArrowRight aria-hidden className="rtl:-scale-x-100" />
            </Link>
          </Button>
        </>
      ) : null}

      <AuthAlert alert={alert} onClose={() => setAlert(null)} />
    </>
  );
}
