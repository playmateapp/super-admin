/** Team subscriptions as `admin_subscriptions(...)` / `admin_subscription(id)` return them. */

export type SubscriptionStatus = 'active' | 'expired' | 'blocked';

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

export interface SubscriptionRow {
  id: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
  status: SubscriptionStatus;
  /** `null` while the owner's paid credit hasn't been used to create a team yet. */
  team: TeamRef | null;
  owner: PersonRef;
  amount: number;
  method: string;
}

export interface SubscriptionsParams {
  search?: string;
  status?: string;
  from?: string;
  to?: string;
  page: number;
  pageSize: number;
}

export interface SubscriptionsResponse {
  total: number;
  stats: { total: number; active: number; expiring: number; inactive: number };
  rows: SubscriptionRow[];
}

export interface SubscriptionDetail {
  id: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
  status: SubscriptionStatus;
  plan: { name: string; price: number; duration_days: number };
  payment: {
    id: string;
    amount: number;
    method: 'bkash' | 'nagad' | 'card' | 'free';
    status: string;
    provider_txn_id: string;
    paid_at: string | null;
  } | null;
  owner: PersonRef & { position: string; status: string };
  team: (TeamRef & { format: string; home_ground: string; player_count: number }) | null;
}
