import { rpc } from '@/lib/api/supabase';

import type { MatchDetail, MatchesParams, MatchesResponse } from '../types';

/** Matches request functions (Supabase RPCs, admin-only). */

/** rpc admin_matches — paged, filtered match list + header totals. */
export const getMatches = (p: MatchesParams) =>
  rpc<MatchesResponse>('admin_matches', {
    p_search: p.search ?? '',
    p_format: p.format ?? '',
    p_status: p.status ?? '',
    p_from: p.from || null,
    p_to: p.to || null,
    p_area: p.area ?? '',
    p_page: p.page,
    p_page_size: p.pageSize,
  });

/** rpc admin_match — one match with both squads. */
export const getMatch = (id: string) => rpc<MatchDetail>('admin_match', { p_id: id });

/** rpc admin_cancel_match — admin override; both teams are notified by the match trigger. */
export const cancelMatch = (id: string) => rpc<void>('admin_cancel_match', { p_match: id });
