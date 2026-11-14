'use client';

import {
  Ban,
  Coins,
  Crown,
  LandPlot,
  ShieldAlert,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';
import { useState } from 'react';

import { DesignIcon } from '@/components/ui';
import { useProfile } from '@/features/auth';
import { commonMessages } from '@/lib/i18n';
import { formatCount, formatMonthShort, formatTaka, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { BarChart, DonutChart, LineChart } from '../components/charts';
import {
  DashCard,
  DivisionCard,
  PendingActions,
  RecentMatches,
  RecentPlayers,
  StatusSplit,
  TrendStats,
  WelcomeBanner,
  type TrendStat,
} from '../components/widgets';
import { useDashboard } from '../hooks/queries';
import { dashboardMessages } from '../i18n/dashboard.messages';
import type { DashboardRange } from '../types';

/**
 * DashboardScreen — `/dashboard` (PM dashboard mock, 2026-11-14): welcome banner + range,
 * six totals with 30-day trends, growth / revenue / subscription charts, player and team
 * status, players / teams / turfs by division, recent players and matches, pending actions.
 */
export function DashboardScreen() {
  const m = useMessages(dashboardMessages);
  const c = useMessages(commonMessages);
  const [range, setRange] = useState<DashboardRange>(6);
  const { data } = useDashboard(range);
  const { data: me } = useProfile();

  const s = data?.stats;
  const p = data?.previous;
  const v = (n: number | undefined, f: (n: number) => string = formatCount) =>
    n != null ? f(n) : '—';

  const stats: TrendStat[] = [
    {
      key: 'players',
      label: m.stats.players,
      tone: 'green',
      icon: <UsersRound />,
      value: v(s?.users),
      current: s?.users,
      previous: p?.users,
    },
    {
      key: 'teams',
      label: m.stats.teams,
      tone: 'blue',
      icon: <DesignIcon name="jersey" size={24} />,
      value: v(s?.teams),
      current: s?.teams,
      previous: p?.teams,
    },
    {
      key: 'turfs',
      label: m.stats.turfs,
      tone: 'violet',
      icon: <LandPlot />,
      value: v(s?.turfs),
      current: s?.turfs,
      previous: p?.turfs,
    },
    {
      key: 'matches',
      label: m.stats.matches,
      tone: 'orange',
      icon: <DesignIcon name="football" size={24} />,
      value: v(s?.matches),
      current: s?.matches,
      previous: p?.matches,
    },
    {
      key: 'subs',
      label: m.stats.subscriptions,
      tone: 'gold',
      icon: <Crown />,
      value: v(s?.active_subscriptions),
      current: s?.active_subscriptions,
      previous: p?.active_subscriptions,
    },
    {
      key: 'revenue',
      label: m.stats.revenue,
      tone: 'violet',
      icon: <Coins />,
      value: v(s?.revenue, formatTaka),
      current: s?.revenue,
      previous: p?.revenue,
    },
  ];

  const growth = data?.growth ?? [];
  const revenue = data?.revenue ?? [];
  const revenueTotal = revenue.reduce((sum, r) => sum + r.amount, 0);

  const status = data?.subscription_status;
  const slices = [
    {
      key: 'active',
      label: m.subscriptionStatus.active,
      value: status?.active ?? 0,
      stroke: 'stroke-success',
      swatch: 'bg-success',
    },
    {
      key: 'expiring',
      label: m.subscriptionStatus.expiring,
      value: status?.expiring ?? 0,
      stroke: 'stroke-gold',
      swatch: 'bg-gold',
    },
    {
      key: 'expired',
      label: m.subscriptionStatus.expired,
      value: status?.expired ?? 0,
      stroke: 'stroke-danger',
      swatch: 'bg-danger',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <WelcomeBanner
        name={me?.full_name?.trim() || m.banner.fallbackName}
        range={range}
        onRange={setRange}
      />

      <TrendStats items={stats} />

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DashCard title={m.growth.title}>
          <ul className="-mt-2 flex flex-wrap gap-4 text-caption text-content-secondary">
            {[
              [m.growth.players, 'bg-success'],
              [m.growth.teams, 'bg-info'],
              [m.growth.turfs, 'bg-violet'],
            ].map(([label, color]) => (
              <li key={label} className="flex items-center gap-1.5">
                <span aria-hidden className={`size-2.5 rounded-full ${color}`} />
                {label}
              </li>
            ))}
          </ul>
          <LineChart
            label={m.growth.chartLabel}
            format={formatCount}
            labels={growth.map((g) => formatMonthShort(g.month))}
            series={[
              {
                key: 'players',
                label: m.growth.players,
                values: growth.map((g) => g.players),
                stroke: 'stroke-success',
                fill: 'bg-success',
                area: true,
              },
              {
                key: 'teams',
                label: m.growth.teams,
                values: growth.map((g) => g.teams),
                stroke: 'stroke-info',
                fill: 'bg-info',
              },
              {
                key: 'turfs',
                label: m.growth.turfs,
                values: growth.map((g) => g.turfs),
                stroke: 'stroke-violet',
                fill: 'bg-violet',
              },
            ]}
          />
        </DashCard>

        <DashCard title={m.revenue.title}>
          <p className="-mt-2 flex items-center gap-2 font-display">
            <span className="text-heading-lg font-bold text-content-primary">
              {data ? formatTaka(revenueTotal) : '—'}
            </span>
            <span className="text-caption text-content-muted">{m.banner.range[range]}</span>
          </p>
          <BarChart
            label={m.revenue.chartLabel}
            format={formatTaka}
            data={revenue.map((r) => ({ label: formatMonthShort(r.month), value: r.amount }))}
          />
        </DashCard>

        <DashCard title={m.subscriptionStatus.title} className="lg:col-span-2 2xl:col-span-1">
          <DonutChart
            slices={slices}
            centreValue={status?.active ?? 0}
            centreLabel={m.subscriptionStatus.centre}
            label={interpolate(m.subscriptionStatus.chartLabel, {
              summary: slices.map((x) => `${x.label} ${x.value}`).join(', '),
            })}
          />
        </DashCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <StatusSplit
          title={m.playerStatus.title}
          icon={<UserRound />}
          href="/users"
          rows={[
            {
              key: 'active',
              label: m.playerStatus.active,
              value: data?.player_status?.active,
              icon: <UserRoundCheck />,
              tone: 'ok',
            },
            {
              key: 'blocked',
              label: m.playerStatus.blocked,
              value: data?.player_status?.blocked,
              icon: <Ban />,
              tone: 'bad',
            },
          ]}
        />
        <StatusSplit
          title={m.teamStatus.title}
          icon={<UsersRound />}
          href="/teams"
          rows={[
            {
              key: 'active',
              label: m.teamStatus.active,
              value: data?.team_status?.active,
              icon: <UsersRound />,
              tone: 'ok',
            },
            {
              key: 'blocked',
              label: m.teamStatus.blocked,
              value: data?.team_status?.blocked,
              icon: <Ban />,
              tone: 'bad',
            },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DivisionCard
          title={m.divisions.players}
          icon={<UserRound />}
          href="/users"
          data={data?.divisions?.players}
        />
        <DivisionCard
          title={m.divisions.teams}
          icon={<UsersRound />}
          href="/teams"
          data={data?.divisions?.teams}
        />
        <DivisionCard
          title={m.divisions.turfs}
          icon={<LandPlot />}
          href="/venues"
          data={data?.divisions?.turfs}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <RecentPlayers
          title={m.recentPlayers.title}
          href="/users"
          users={data?.recent_users}
          typeLabel={(t) => c.userType[t]}
        />
        <RecentMatches href="/matches" matches={data?.recent_matches} />
        <PendingActions
          rows={[
            {
              key: 'turfs',
              label: m.pending.turfRequests,
              count: data?.pending?.turf_requests,
              href: '/turf-requests',
              icon: <LandPlot />,
            },
            {
              key: 'players',
              label: m.pending.playerAppeals,
              count: data?.pending?.player_appeals,
              href: '/appeals',
              icon: <ShieldAlert />,
            },
            {
              key: 'teams',
              label: m.pending.teamAppeals,
              count: data?.pending?.team_appeals,
              href: '/appeals?kind=team',
              icon: <UsersRound />,
            },
          ]}
        />
      </div>
    </div>
  );
}
