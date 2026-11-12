import { rpc } from '@/lib/api/supabase';

import type {
  Appeal,
  AppealKind,
  AppealsParams,
  AppealsResponse,
  TeamAppealRow,
  UserAppealRow,
} from '../types';

/** Appeals request functions (Supabase RPCs, admin-only). */

const fromUser = (r: UserAppealRow): Appeal => ({
  id: r.id,
  kind: 'user',
  message: r.message,
  status: r.status,
  admin_reason: r.admin_reason,
  created_at: r.created_at,
  name: r.full_name,
  sub: r.phone || r.player_code,
  avatar_url: r.avatar_url,
  owner_name: '',
  owner_phone: '',
});

const fromTeam = (r: TeamAppealRow): Appeal => ({
  id: r.id,
  kind: 'team',
  message: r.message,
  status: r.status,
  admin_reason: r.admin_reason,
  created_at: r.created_at,
  name: r.team_name,
  sub: r.team_code ? `#${r.team_code}` : '',
  avatar_url: r.logo_url,
  owner_name: r.owner_name,
  owner_phone: r.owner_phone,
});

/**
 * rpc admin_block_appeals / admin_team_block_appeals — paged requests, open ones first, plus
 * totals per status.
 */
export async function getAppeals(p: AppealsParams): Promise<AppealsResponse> {
  const args = { p_status: p.status, p_page: p.page, p_page_size: p.pageSize };
  if (p.kind === 'team') {
    const res = await rpc<AppealsResponse<TeamAppealRow>>('admin_team_block_appeals', args);
    return { ...res, rows: res.rows.map(fromTeam) };
  }
  const res = await rpc<AppealsResponse<UserAppealRow>>('admin_block_appeals', args);
  return { ...res, rows: res.rows.map(fromUser) };
}

/**
 * rpc admin_review_block_appeal / admin_review_team_block_appeal — approve (unblocks) or
 * reject (the reason goes to the player / team owner).
 */
export const reviewAppeal = (kind: AppealKind, id: string, approve: boolean, reason = '') =>
  rpc<void>(kind === 'team' ? 'admin_review_team_block_appeal' : 'admin_review_block_appeal', {
    p_appeal: id,
    p_approve: approve,
    p_reason: reason,
  });
