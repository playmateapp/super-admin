'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';

import { FormWrapper, TextInput } from '@/components/form';
import { Button } from '@/components/ui';
import { useMessages } from '@/providers/i18n-provider';

import { AuthAlert } from '../components/auth-alert';
import { useLogin } from '../hooks/mutations';
import { authMessages, type AuthAlertKey } from '../i18n/auth.messages';
import { useAuthStore } from '../store/auth.store';
import { AuthFlowError } from '../types';
import { loginSchema, type LoginFormValues } from '../validations/auth.schema';

/** Only same-site paths are allowed as `?next=` targets. */
const safeNext = (next: string | null) =>
  next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

function LoginForm() {
  const m = useMessages(authMessages);
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const login = useLogin();
  const initialize = useAuthStore((s) => s.initialize);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [alert, setAlert] = useState<AuthAlertKey | null>(null);
  const schema = useMemo(() => loginSchema(m.errors), [m.errors]);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '', password: '' },
  });

  // An admin who is already signed in skips the form.
  useEffect(initialize, [initialize]);
  useEffect(() => {
    if (isAuthenticated) router.replace(next);
  }, [isAuthenticated, next, router]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login.mutateAsync(values);
    } catch (err) {
      const reason = err instanceof AuthFlowError ? err.reason : 'unknown';
      setAlert(reason in m.alerts ? (reason as AuthAlertKey) : 'unknown');
    }
  };

  // The design reports form errors in the same popup as server errors.
  const onInvalid = (errors: FieldErrors<LoginFormValues>) => {
    if (errors.phone) {
      setAlert(form.getValues('phone').trim() ? 'phoneInvalid' : 'phoneEmpty');
    } else if (errors.password) setAlert('passwordEmpty');
  };

  return (
    <>
      <div className="flex w-full max-w-[425px] flex-col gap-1.5 text-center">
        <h1 className="font-display text-[28px] font-bold leading-[1.5] text-content-primary">
          {m.login.title}
        </h1>
        <p className="font-display text-heading-sm text-content-muted">{m.login.subtitle}</p>
      </div>
      <FormWrapper form={form} onSubmit={onSubmit} onInvalid={onInvalid} className="w-full gap-6">
        <div className="flex flex-col gap-4">
          <TextInput<LoginFormValues>
            name="phone"
            type="tel"
            label={m.login.phone}
            placeholder={m.login.phonePlaceholder}
            autoComplete="username"
            dir="ltr"
          />
          <div className="flex flex-col items-end gap-2">
            <TextInput<LoginFormValues>
              name="password"
              type="password"
              label={m.login.password}
              placeholder={m.login.passwordPlaceholder}
              autoComplete="current-password"
              className="w-full"
            />
            <Link
              href="/forgot-password"
              className="font-display text-body-xs font-medium text-danger hover:underline"
            >
              {m.login.forgot}
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? m.login.submitting : m.login.submit}
        </Button>
      </FormWrapper>
      <AuthAlert alert={alert} onClose={() => setAlert(null)} />
    </>
  );
}

/** LoginScreen — `/login` (Figma "Login"): mobile number + password for admins. */
export function LoginScreen() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
