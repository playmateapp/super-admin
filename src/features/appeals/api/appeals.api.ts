import { rpc } from '@/lib/api/supabase';

import type { AppealsParams, AppealsResponse } from '../types';

/** Appeals request functions (Supabase RPCs, admin-only). */

/** rpc admin_block_appeals — paged requests, open ones first, plus totals per status. */
export const getAppeals = (p: AppealsParams) =>
  rpc<AppealsResponse>('admin_block_appeals', {
    p_status: p.status,
    p_page: p.page,
    p_page_size: p.pageSize,
  });

/** rpc admin_review_block_appeal — approve (unblocks) or reject (reason goes to the player). */
export const reviewAppeal = (id: string, approve: boolean, reason = '') =>
  rpc<void>('admin_review_block_appeal', {
    p_appeal: id,
    p_approve: approve,
    p_reason: reason,
  });
