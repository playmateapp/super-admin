/**
 * Users (players) as the admin RPCs return them — `admin_users(...)`, `admin_user(id)`.
 * Field names stay snake_case as the database sends them.
 */

export type UserType = 'player' | 'team_owner';
export type UserStatus = 'active' | 'new' | 'pending' | 'blocked';

export interface TeamRef {
  id: string;
  name: string;
  team_code: string;
  logo_url: string;
}

export interface UserRow {
  id: string;
  player_code: string;
  full_name: string;
  avatar_url: string;
  phone: string;
  position: string;
  created_at: string;
  type: UserType;
  status: UserStatus;
  team: TeamRef | null;
}

export interface UsersParams {
  search?: string;
  type?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export interface UsersResponse {
  total: number;
  stats: { users: number; teams: number };
  rows: UserRow[];
}

export interface UserRecentMatch {
  id: string;
  kick_off: string;
  venue: string;
  home_score: number;
  away_score: number;
  home: TeamRef;
  away: TeamRef;
  player: { goals: number; assists: number; red_cards: number; yellow_cards: number };
}

export interface UserDetail {
  id: string;
  player_code: string;
  full_name: string;
  avatar_url: string;
  phone: string;
  area: string;
  position: string;
  about: string;
  date_of_birth: string | null;
  age: number | null;
  created_at: string;
  blocked_at: string | null;
  status: UserStatus;
  type: UserType;
  team: TeamRef | null;
  stats: {
    matches: number;
    goals: number;
    assists: number;
    shots: number;
    red_cards: number;
    yellow_cards: number;
  };
  photos: string[];
  recent_matches: UserRecentMatch[];
}
