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
  stats: { total: number; active: number; blocked: number };
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
  players: TeamPlayer[];
  recent_matches: TeamMatch[];
}
