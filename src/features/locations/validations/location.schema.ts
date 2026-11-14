import { z } from 'zod';

import { parseCsv } from '@/lib/utils';

import type { LocationsMessages } from '../i18n/locations.messages';
import type { LocationImportRow, LocationInput, LocationLevel, LocationRow } from '../types';

/**
 * Add / Edit Location form (string values; `toLocationInput` builds the RPC body). `division`
 * is the parent of a district and only narrows the district list for a thana; `district` is
 * the parent of a thana.
 */
export const locationSchema = (e: LocationsMessages['errors'], level: LocationLevel) =>
  z
    .object({
      name: z.string().trim().min(1, e.required).max(60, e.tooLong),
      division: z.string(),
      district: z.string(),
      sort: z
        .string()
        .trim()
        .refine((v) => v === '' || (/^\d+$/.test(v) && Number(v) <= 9999), e.order),
    })
    .superRefine((v, ctx) => {
      if (level !== 'division' && v.division === '') {
        ctx.addIssue({ code: 'custom', path: ['division'], message: e.parent });
      }
      if (level === 'thana' && v.district === '') {
        ctx.addIssue({ code: 'custom', path: ['district'], message: e.parent });
      }
    });
export type LocationFormValues = z.infer<ReturnType<typeof locationSchema>>;

export const locationToForm = (
  level: LocationLevel,
  row: LocationRow | null,
  defaults: { division: string; district: string },
): LocationFormValues => ({
  name: row?.name ?? '',
  // A thana row only knows its district id; its division comes from the list filter.
  division: level === 'district' && row ? String(row.parent_id) : defaults.division,
  district: level === 'thana' && row ? String(row.parent_id) : defaults.district,
  sort: row ? String(row.sort) : '',
});

export const toLocationInput = (level: LocationLevel, v: LocationFormValues): LocationInput => ({
  name: v.name.trim().replace(/\s+/g, ' '),
  parent:
    level === 'division' ? null : Number(level === 'district' ? v.division : v.district) || null,
  sort: v.sort === '' ? null : Number(v.sort),
});

/** Template + example rows offered by the bulk upload. */
export const IMPORT_HEADERS = ['Division', 'District', 'Thana'];
export const IMPORT_EXAMPLE = [
  ['Dhaka', 'Gazipur', 'Tongi'],
  ['Dhaka', 'Gazipur', 'Kaliakair'],
  ['Chattogram', 'Chattogram', 'Pahartali'],
];

/**
 * CSV text → import rows. The header row decides the columns (any order, any case;
 * "Thana / Upazila" and "Upazila" also work). `null` = no "Division" column.
 */
export function parseLocationCsv(text: string): LocationImportRow[] | null {
  const [header, ...rest] = parseCsv(text);
  if (!header) return [];
  const keys = header.map((h) => h.trim().toLowerCase());
  const col = (...names: string[]) => keys.findIndex((k) => names.some((n) => k.startsWith(n)));
  const dv = col('division');
  const dt = col('district', 'zila', 'zilla');
  const th = col('thana', 'upazila', 'upozila');
  if (dv < 0) return null;
  const cell = (row: string[], i: number) => (i < 0 ? '' : (row[i] ?? '').trim());
  return rest
    .map((r) => ({ division: cell(r, dv), district: cell(r, dt), thana: cell(r, th) }))
    .filter((r) => r.division || r.district || r.thana);
}
