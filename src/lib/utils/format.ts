import { format, parseISO } from 'date-fns';

/**
 * Number / date formatting shared by every screen. Numerals stay Western 0–9 in both
 * languages, so tables line up the same way in English and Bangla.
 */

/** Date-only strings (`2022-12-12`) are read as local dates, so the day never shifts. */
const toDate = (value: string | Date) => (typeof value === 'string' ? parseISO(value) : value);

const groupedFormat = new Intl.NumberFormat('en-IN');

/** 150000 → "1,50,000" (South Asian grouping, as on the design's stat cards). */
export function formatNumber(value: number) {
  return groupedFormat.format(value);
}

/** 14050 → "14050 BDT" — table amounts are shown ungrouped with the currency label. */
export function formatAmount(value: number, currency: string) {
  return `${value} ${currency}`;
}

/** "12/12/2022" — the date format of every table. */
export function formatDate(value: string | Date) {
  return format(toDate(value), 'dd/MM/yyyy');
}

/** "Jan 4, 2022" — user tables. */
export function formatDateMedium(value: string | Date) {
  return format(toDate(value), 'MMM d, yyyy');
}

/** "Nov 2022" — invoice period. */
export function formatMonthYear(value: string | Date) {
  return format(toDate(value), 'MMM yyyy');
}

/** "01:45 pm" — order and delivery times. */
export function formatTime(value: string | Date) {
  return format(toDate(value), 'hh:mm aaa');
}

/** Replace `{name}` placeholders: `interpolate('{count} selected', { count: 9 })`. */
export function interpolate(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** 84200 → "৳84,200" (Figma revenue / payment amounts). */
export function formatTaka(value: number) {
  return `৳${new Intl.NumberFormat('en-US').format(value)}`;
}

/** 12328 → "12,328" (stat strips use Western grouping). */
export function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

/** "Oct 04, 2026" — match rows. */
export function formatDay(value: string | Date) {
  return format(toDate(value), 'MMM dd, yyyy');
}

/** "Oct-04-2026" — recent match cards. */
export function formatDashedDay(value: string | Date) {
  return format(toDate(value), 'MMM-dd-yyyy');
}

/** "07:00 PM". */
export function formatClock(value: string | Date) {
  return format(toDate(value), 'hh:mm a');
}

/** "Jan" — chart axis months. */
export function formatMonthShort(value: string | Date) {
  return format(toDate(value), 'MMM');
}

export type RelativeUnit = 'now' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

/**
 * Elapsed time split into a unit + count, so each screen words it in its own language
 * ("51m", "2 min ago", "১ ঘণ্টা আগে").
 */
export function relativeParts(value: string | Date, now = new Date()) {
  const seconds = Math.max(0, (now.getTime() - toDate(value).getTime()) / 1000);
  const steps: [RelativeUnit, number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [unit, size] of steps) {
    if (seconds >= size) return { unit, count: Math.floor(seconds / size) };
  }
  return { unit: 'now' as RelativeUnit, count: 0 };
}

/** Time until `value`: days, hours, minutes (all 0 once it has passed). */
export function countdownParts(value: string | Date, now = new Date()) {
  const total = Math.max(0, Math.floor((toDate(value).getTime() - now.getTime()) / 60_000));
  return {
    days: Math.floor(total / 1440),
    hours: Math.floor((total % 1440) / 60),
    minutes: total % 60,
  };
}
