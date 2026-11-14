/** Matches as `admin_matches(...)` / `admin_match(id)` return them. */

export type MatchStatus = 'upcoming' | 'ready_to_start' | 'ongoing' | 'complete' | 'cancelled';

export interface TeamRef {
  id: string;
  name: string;
  team_code: string;
  logo_url: string;
}

export interface MatchRow {
  id: string;
  kick_off: string;
  format: string;
  venue: string;
  home_score: number;
  away_score: number;
  created_at: string;
  status: MatchStatus;
  home: TeamRef;
  away: TeamRef;
}

export interface MatchesParams {
  search?: string;
  format?: string;
  status?: string;
  from?: string;
  to?: string;
  /** Venue name (matched with ilike on the match venue). */
  venue?: string;
  page: number;
  pageSize: number;
}

export interface MatchesResponse {
  total: number;
  stats: { total: number; upcoming: number; complete: number; cancelled: number };
  rows: MatchRow[];
}

export interface SquadPlayer {
  id: string;
  name: string;
  player_code: string;
  avatar_url: string;
  position: string;
  goals: number;
}

export interface MatchDetail extends MatchRow {
  duration_minutes: number;
  break_minutes: number;
  phase: string;
  finished_at: string | null;
  created_by_team: TeamRef | null;
  created_by: { id: string; name: string } | null;
  squads: { home: SquadPlayer[]; away: SquadPlayer[] };
}
