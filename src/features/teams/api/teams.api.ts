import { rpc } from '@/lib/api/supabase';

import type { TeamContact, TeamDetail, TeamsParams, TeamsResponse } from '../types';

/** Teams request functions (Supabase RPCs, admin-only). */

/** rpc admin_teams — paged, filtered team list + header totals. */
export const getTeams = (p: TeamsParams) =>
  rpc<TeamsResponse>('admin_teams', {
    p_search: p.search ?? '',
    p_format: p.format ?? '',
    p_status: p.status ?? '',
    p_page: p.page,
    p_page_size: p.pageSize,
  });

/** rpc admin_team — one team with record, players and matches. */
export const getTeam = (id: string) => rpc<TeamDetail>('admin_team', { p_id: id });

/** rpc admin_set_team_blocked — suspends / restores a team (its managers are notified). */
export const setTeamBlocked = (id: string, blocked: boolean) =>
  rpc<void>('admin_set_team_blocked', { p_team: id, p_blocked: blocked });

/** rpc admin_user — read only for the owner / captain contact (name + phone) on the team panel. */
export const getTeamContact = (userId: string) => rpc<TeamContact>('admin_user', { p_id: userId });
