/**
 * @/features/auth — admin sign-in (phone + password on Supabase), password reset by SMS code,
 * change password (Settings), the session flag and the profile query. Import only here.
 */

// Screens
export { LoginScreen } from './screen/login.screen';
export { ForgotPasswordScreen } from './screen/forgot-password.screen';
export { SettingsScreen } from './screen/settings.screen';

// Components
export { AccountMenu, LogoutButton } from './components';

// Hooks
export { useProfile } from './hooks/queries';
export { useLogin, useLogout } from './hooks/mutations';

// Store
export { useAuthStore, useIsAuthenticated, useIsAuthInitialized } from './store/auth.store';

// Types
export type { AdminUser } from './types';
