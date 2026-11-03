import { create } from 'zustand';

import { supabase } from '@/lib/api/supabase';
import { tokenStorage } from '@/lib/auth/token-storage';

/**
 * Auth UI state. Session flags only — the admin object comes from `useProfile`.
 * `initialize()` reads the stored Supabase session once and follows sign-outs (expired /
 * revoked refresh token) so the guard sends the admin back to `/login`.
 */
interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  /** Reads the stored session once on the client (safe to call repeatedly). */
  initialize: () => void;
  setAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isInitialized: false,
  isAuthenticated: false,
  initialize: () => {
    if (get().isInitialized) return;
    set({ isInitialized: true, isAuthenticated: tokenStorage.hasSession() });
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') set({ isAuthenticated: false });
    });
  },
  setAuthenticated: (value) => set({ isAuthenticated: value, isInitialized: true }),
}));

// Selectors
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useIsAuthInitialized = () => useAuthStore((s) => s.isInitialized);
