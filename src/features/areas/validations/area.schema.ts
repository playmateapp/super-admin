import { z } from 'zod';

import type { AreasMessages } from '../i18n/areas.messages';
import type { Area, AreaInput } from '../types';

/** Add / Edit Area form (string values; `toAreaInput` builds the RPC body). */
export const areaSchema = (e: AreasMessages['errors']) =>
  z.object({
    name: z.string().trim().min(1, e.required).max(60, e.tooLong),
    sort: z
      .string()
      .trim()
      .refine((v) => v === '' || (/^\d+$/.test(v) && Number(v) <= 9999), e.order),
  });
export type AreaFormValues = z.infer<ReturnType<typeof areaSchema>>;

export const areaToForm = (a: Area | null): AreaFormValues => ({
  name: a?.name ?? '',
  sort: a ? String(a.sort) : '',
});

export const toAreaInput = (v: AreaFormValues): AreaInput => ({
  name: v.name.trim().replace(/\s+/g, ' '),
  sort: v.sort === '' ? null : Number(v.sort),
});
