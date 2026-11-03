/** `admin_dashboard()` — totals, subscription split, 6-month revenue + user growth, recents. */

export interface DashboardOverview {
  stats: {
    users: number;
    teams: number;
    matches: number;
    active_subscriptions: number;
    revenue: number;
  };
  subscription_status: { active: number; expiring: number; expired: number };
  revenue: { month: string; amount: number }[];
  user_growth: { month: string; users: number }[];
  recent_users: {
    id: string;
    full_name: string;
    player_code: string;
    avatar_url: string;
    created_at: string;
    type: 'player' | 'team_owner';
    status: string;
  }[];
  recent_payments: {
    id: string;
    amount: number;
    status: string;
    date: string;
    team: { id: string; name: string; team_code: string; logo_url: string } | null;
    payer: { id: string; name: string; player_code: string; avatar_url: string } | null;
  }[];
}
