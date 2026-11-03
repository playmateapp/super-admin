import { rpc } from '@/lib/api/supabase';

import type { DashboardOverview } from '../types';

/** rpc admin_dashboard — everything the dashboard shows, in one call. */
export const getDashboard = () => rpc<DashboardOverview>('admin_dashboard');
