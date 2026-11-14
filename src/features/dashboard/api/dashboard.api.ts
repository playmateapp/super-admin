import { rpc } from '@/lib/api/supabase';

import type { DashboardOverview, DashboardRange } from '../types';

/** rpc admin_dashboard — everything the dashboard shows, in one call. */
export const getDashboard = (months: DashboardRange) =>
  rpc<DashboardOverview>('admin_dashboard', { p_months: months });
