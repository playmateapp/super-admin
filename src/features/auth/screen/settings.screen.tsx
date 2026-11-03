'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormWrapper, TextInput } from '@/components/form';
import { Button, Panel } from '@/components/ui';
import { useMessages } from '@/providers/i18n-provider';

import { AuthAlert } from '../components/auth-alert';
import { useChangePassword } from '../hooks/mutations';
import { authMessages, type AuthAlertKey } from '../i18n/auth.messages';
import { AuthFlowError } from '../types';
import { changePasswordSchema, type ChangePasswordFormValues } from '../validations/auth.schema';

/** SettingsScreen — `/settings` (Figma "Settings"): change the admin's password. */
export function SettingsScreen() {
  const m = useMessages(authMessages);
  const change = useChangePassword();
  const [alert, setAlert] = useState<AuthAlertKey | null>(null);
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(useMemo(() => changePasswordSchema(m.errors), [m.errors])),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await change.mutateAsync({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      form.reset();
      toast.success(m.settings.saved);
    } catch (err) {
      const reason = err instanceof AuthFlowError ? err.reason : 'unknown';
      if (reason === 'credentials') {
        form.setError('oldPassword', { message: m.alerts.credentials.message });
      } else {
        setAlert(reason in m.alerts ? (reason as AuthAlertKey) : 'unknown');
      }
    }
  };

  return (
    <div className="flex max-w-[622px] flex-col gap-2.5">
      <h1 className="font-display text-heading-md font-semibold text-content-primary">
        {m.settings.title}
      </h1>
      <Panel className="p-3">
        <FormWrapper form={form} onSubmit={onSubmit} className="gap-3">
          <h2 className="text-center font-display text-heading-sm font-medium text-content-primary">
            {m.settings.cardTitle}
          </h2>
          <TextInput<ChangePasswordFormValues>
            name="oldPassword"
            type="password"
            label={m.settings.oldPassword}
            placeholder={m.settings.oldPassword}
            autoComplete="current-password"
          />
          <TextInput<ChangePasswordFormValues>
            name="newPassword"
            type="password"
            label={m.settings.newPassword}
            placeholder={m.settings.newPassword}
            autoComplete="new-password"
          />
          <TextInput<ChangePasswordFormValues>
            name="confirmPassword"
            type="password"
            label={m.settings.confirmPassword}
            placeholder={m.settings.confirmPassword}
            autoComplete="new-password"
          />
          <Button type="submit" className="mt-1 w-full" disabled={change.isPending}>
            {change.isPending ? m.settings.saving : m.settings.submit}
          </Button>
        </FormWrapper>
      </Panel>
      <AuthAlert alert={alert} onClose={() => setAlert(null)} />
    </div>
  );
}
