/**
 * Unblock requests. Players appeal their account (`admin_block_appeals`), team owners appeal
 * their team (`admin_team_block_appeals`); the API maps both into one `Appeal` row.
 */

export type AppealStatus = 'pending' | 'approved' | 'rejected';

/** Whose block the request is about. */
export type AppealKind = 'user' | 'team';

/** `admin_block_appeals(...)` row (snake_case from the database). */
export interface UserAppealRow {
  id: string;
  message: string;
  status: AppealStatus;
  admin_reason: string;
  created_at: string;
  reviewed_at: string | null;
  user_id: string;
  full_name: string;
  player_code: string;
  avatar_url: string;
  phone: string;
  blocked_at: string | null;
}

/** `admin_team_block_appeals(...)` row. */
export interface TeamAppealRow {
  id: string;
  message: string;
  status: AppealStatus;
  admin_reason: string;
  created_at: string;
  reviewed_at: string | null;
  team_id: string;
  team_name: string;
  team_code: string;
  logo_url: string;
  blocked_at: string | null;
  owner_id: string;
  owner_name: string;
  owner_phone: string;
}

/** One request as the screen shows it, whichever kind. */
export interface Appeal {
  id: string;
  kind: AppealKind;
  message: string;
  status: AppealStatus;
  admin_reason: string;
  created_at: string;
  /** Player name, or team name. */
  name: string;
  /** Player phone / id, or team id. */
  sub: string;
  avatar_url: string;
  /** Team requests: the owner who sent it. */
  owner_name: string;
  owner_phone: string;
}

export interface AppealsParams {
  kind: AppealKind;
  status: AppealStatus | '';
  page: number;
  pageSize: number;
}

export interface AppealsResponse<Row = Appeal> {
  total: number;
  stats: Record<AppealStatus, number>;
  rows: Row[];
}
