import { addDays, startOfDay, subDays } from 'date-fns';

import type { DateRange } from '@/components/ui';

import type { ActivityPeriod } from '../types';

/**
 * Turns a toolbar date preset into the `[from, to)` ISO window `admin_activity` filters on,
 * using the admin's local day boundaries. Custom ranges are whole days (`to` inclusive).
 */
export function periodWindow(
  period: ActivityPeriod,
  custom: DateRange,
  now = new Date(),
): { from: string | null; to: string | null } {
  const today = startOfDay(now);
  switch (period) {
    case 'today':
      return { from: today.toISOString(), to: null };
    case 'yesterday':
      return { from: subDays(today, 1).toISOString(), to: today.toISOString() };
    case 'week':
      return { from: subDays(today, 6).toISOString(), to: null };
    case 'custom':
      return {
        from: custom.from ? startOfDay(new Date(`${custom.from}T00:00:00`)).toISOString() : null,
        to: custom.to ? addDays(new Date(`${custom.to}T00:00:00`), 1).toISOString() : null,
      };
    default:
      return { from: null, to: null };
  }
}
