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
  /** 'Male' | 'Female' | '' (not set). */
  gender: string;
  /** One of `public.profile_types` names, or ''. */
  profile_type: string;
  /** "Thana, District, Division, Post code" — '' when not set. */
  location: string;
  division: string;
  district: string;
  thana: string;
  post_code: string;
  created_at: string;
  type: UserType;
  status: UserStatus;
  team: TeamRef | null;
}

export interface UsersParams {
  search?: string;
  type?: string;
  status?: string;
  gender?: string;
  profileType?: string;
  /** Division id as a string ('' = all). */
  division?: string;
  page: number;
  pageSize: number;
}

export interface UsersResponse {
  total: number;
  stats: { users: number; teams: number };
  /** Filter options straight from the database. */
  options: { profile_types: string[]; divisions: { id: number; name: string }[] };
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
  location: string;
  division: string;
  district: string;
  thana: string;
  post_code: string;
  gender: string;
  profile_type: string;
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
