import { z } from 'zod';

import type { CommonMessages } from '@/lib/i18n';

/**
 * Generic zod pieces for the create forms. Form values are strings (what inputs hold);
 * each feature maps them to its API input in `data/*.mapper.ts`. Pass the active
 * language's `commonMessages.errors` so messages are already localised.
 */
type E = CommonMessages['errors'];

export const requiredText = (e: E) => z.string().trim().min(1, e.required);

export const optionalText = () => z.string().trim();

export const requiredEmail = (e: E) => z.string().trim().min(1, e.required).email(e.email);

/** Bangladeshi numbers as typed in the design (`01683568475`), with optional `+88`. */
export const requiredPhone = (e: E) =>
  z
    .string()
    .trim()
    .min(1, e.required)
    .refine((v) => /^(\+?88)?01[3-9]\d{8}$/.test(v.replace(/[\s-]/g, '')), e.phone);

/** A number typed into a text box; `min` defaults to 0 (amounts, counts). */
export const requiredNumber = (e: E, { min = 0 }: { min?: number } = {}) =>
  z
    .string()
    .trim()
    .min(1, e.required)
    .refine((v) => Number.isFinite(Number(v)), e.number)
    .refine((v) => Number(v) >= min, min > 0 ? e.positive : e.number);

/**
 * A `<select>` whose empty option means "nothing chosen". The value stays a `string` in the
 * form type (it starts as `''`); the feature's mapper casts it to the union.
 */
export const requiredChoice = (values: readonly string[], e: E) =>
  z
    .string()
    .min(1, e.required)
    .refine((v) => values.includes(v), e.required);

/** `yyyy-MM-dd` from a date input. */
export const requiredDate = (e: E) =>
  z
    .string()
    .min(1, e.required)
    .regex(/^\d{4}-\d{2}-\d{2}$/, e.required);

export const ENTITY_STATUSES = ['active', 'inactive'] as const;
