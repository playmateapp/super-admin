/** Unblock requests as `admin_block_appeals(...)` returns them (snake_case from the database). */

export type AppealStatus = 'pending' | 'approved' | 'rejected';

export interface Appeal {
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

export interface AppealsParams {
  status: AppealStatus | '';
  page: number;
  pageSize: number;
}

export interface AppealsResponse {
  total: number;
  stats: Record<AppealStatus, number>;
  rows: Appeal[];
}
