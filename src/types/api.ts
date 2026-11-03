/**
 * API envelope shapes shared by every feature. PROVISIONAL — there is no backend contract yet
 * (docs/BUILD_PLAN.md → "Content / API to confirm"); change them here once it exists.
 */

/** Response of a list endpoint (`GET /companies`, `GET /orders`, ...). */
export interface ListResponse<T> {
  data: T[];
  total: number;
}

/** Response of a single-resource endpoint (`GET /companies/{id}`, `POST /companies`, ...). */
export interface ItemResponse<T> {
  data: T;
}

/** Lifecycle status shared by companies, SBUs, users, menus and platters. */
export type EntityStatus = 'active' | 'inactive';

/** Query params every list endpoint accepts. */
export interface ListParams {
  search?: string;
}
