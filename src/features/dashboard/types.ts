/**
 * `admin_dashboard(p_months)` (migration 028) — totals + the same totals 30 days ago, status
 * splits, revenue and growth for the chosen range, per-division counts, recents, pending work.
 * Fields added by 028 are optional so the screen still renders against the older RPC.
 */

export type DashboardRange = 1 | 3 | 6 | 12;

export interface DashboardTotals {
  users: number;
  teams: number;
  turfs?: number;
  matches: number;
  active_subscriptions: number;
  revenue: number;
}

export interface DivisionCount {
  /** '' = no division set. */
  division: string;
  count: number;
}

export type MatchPhase =
  | 'not_started'
  | 'first_half'
  | 'half_time'
  | 'second_half'
  | 'extra_time'
  | 'finished'
  | 'canceled';

export interface TeamRef {
  id: string;
  name: string;
  team_code: string;
  logo_url: string;
}

export interface DashboardOverview {
  stats: DashboardTotals;
  /** The same totals as they were 30 days ago (for the trend arrows). */
  previous?: DashboardTotals;
  subscription_status: { active: number; expiring: number; expired: number };
  revenue: { month: string; amount: number }[];
  growth?: { month: string; players: number; teams: number; turfs: number }[];
  player_status?: { active: number; blocked: number };
  team_status?: { active: number; blocked: number };
  divisions?: { players: DivisionCount[]; teams: DivisionCount[]; turfs: DivisionCount[] };
  recent_users: {
    id: string;
    full_name: string;
    player_code: string;
    avatar_url: string;
    created_at: string;
    type: 'player' | 'team_owner';
    status: string;
  }[];
  recent_matches?: {
    id: string;
    kick_off: string;
    phase: MatchPhase;
    home_score: number;
    away_score: number;
    home: TeamRef | null;
    away: TeamRef | null;
  }[];
  pending?: { turf_requests: number; player_appeals: number; team_appeals: number };
}
