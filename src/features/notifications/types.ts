/**
 * Admin activity feed (`admin_activity(limit)`): platform events derived from the app's tables
 * — new users, teams, subscriptions, matches, venues. Items carry a `kind` and raw values; the
 * sentence is written in the active language here.
 */

export type ActivityKind =
  | 'user_registered'
  | 'block_appeal'
  | 'team_block_appeal'
  | 'team_created'
  | 'subscription_activated'
  | 'subscription_expiring'
  | 'subscription_expired'
  | 'match_scheduled'
  | 'match_ready'
  | 'match_ongoing'
  | 'match_completed'
  | 'match_cancelled'
  | 'venue_added';

export interface ActivityItem {
  kind: ActivityKind;
  at: string;
  ref: string;
  unread: boolean;
  data: {
    image?: string;
    name?: string;
    team?: string;
    owner?: string;
    amount?: number;
    /** Subscription taken during the limited-time free offer. */
    free?: boolean;
    starts_at?: string;
    ends_at?: string;
    home?: string;
    away?: string;
    kick_off?: string;
    home_score?: number;
    away_score?: number;
    venue?: string;
  };
}

export interface ActivityFeed {
  unread: number;
  items: ActivityItem[];
}
