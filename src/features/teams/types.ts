/** Teams as `admin_teams(...)` / `admin_team(id)` return them (snake_case from the DB). */

export type TeamStatus = 'active' | 'inactive' | 'blocked';

export interface TeamRef {
  id: string;
  name: string;
  team_code: string;
  logo_url: string;
}

export interface PersonRef {
  id: string;
  name: string;
  player_code: string;
  avatar_url: string;
}

export interface TeamRow {
  id: string;
  team_code: string;
  name: string;
  logo_url: string;
  format: string;
  created_at: string;
  status: TeamStatus;
  owner: PersonRef;
  /** The owner asked for the block to be reviewed and no admin has answered yet. */
  appeal_pending?: boolean;
}

export interface TeamsParams {
  search?: string;
  format?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export interface TeamsResponse {
  total: number;
  stats: { total: number; active: number; blocked: number; appeals?: number };
  rows: TeamRow[];
}

export interface TeamPlayer {
  id: string;
  name: string;
  player_code: string;
  avatar_url: string;
  position: string;
  role: 'owner' | 'captain' | 'member';
}

export interface TeamMatch {
  id: string;
  kick_off: string;
  venue: string;
  home_score: number;
  away_score: number;
  status: string;
  home: TeamRef;
  away: TeamRef;
}

/** Latest unblock request for the team's current block (`team_block_appeals`). */
export interface TeamAppeal {
  id: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_reason: string;
  created_at: string;
  reviewed_at: string | null;
  sender: PersonRef | null;
}

export interface TeamDetail {
  id: string;
  team_code: string;
  name: string;
  logo_url: string;
  cover_url: string;
  format: string;
  category: string;
  home_ground: string;
  about: string;
  skill_level: string;
  founded_on: string;
  created_at: string;
  blocked_at: string | null;
  status: TeamStatus;
  owner: PersonRef;
  player_count: number;
  record: { played: number; won: number; drawn: number; lost: number };
  subscription_ends_at: string | null;
  appeal?: TeamAppeal | null;
  players: TeamPlayer[];
  recent_matches: TeamMatch[];
}

/** The slice of `admin_user(id)` the team panel shows for the owner / captain. */
export interface TeamContact {
  id: string;
  full_name: string;
  phone: string;
}
