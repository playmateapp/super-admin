'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';

import * as authApi from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { ChangePasswordInput, LoginInput } from '../types';

/** Auth mutations. Supabase keeps the session; these flip the session flag and caches. */

export function useLogin() {
  const qc = useQueryClient();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (admin) => {
      qc.setQueryData(queryKeys.auth.profile(), admin);
      setAuthenticated(true);
    },
  });
}

/** Always clears the local session and every cached query, even if the call fails. */
export function useLogout() {
  const qc = useQueryClient();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      setAuthenticated(false);
      qc.clear();
    },
  });
}

export const useSendResetCode = () =>
  useMutation({ mutationFn: (phone: string) => authApi.sendResetCode(phone) });

export const useVerifyResetCode = () =>
  useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      authApi.verifyResetCode(phone, code),
  });

export function useResetPassword() {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  return useMutation({
    mutationFn: (password: string) => authApi.resetPassword(password),
    onSuccess: () => setAuthenticated(false),
  });
}

export const useChangePassword = () =>
  useMutation({ mutationFn: (input: ChangePasswordInput) => authApi.changePassword(input) });
