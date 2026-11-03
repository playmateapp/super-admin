'use client';

import { TrendingUp, Users } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';

import {
  DesignIcon,
  EntityAvatar,
  IdentityCell,
  ListTable,
  Panel,
  PanelTitle,
  StatStrip,
  StatusTag,
  type ListColumn,
  type StripItem,
} from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import {
  cn,
  formatCount,
  formatDateMedium,
  formatMonthShort,
  formatTaka,
  interpolate,
  relativeParts,
} from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { AreaChart, BarChart, DonutChart } from '../components/charts';
import { useDashboard } from '../hooks/queries';
import { dashboardMessages } from '../i18n/dashboard.messages';
import type { DashboardOverview } from '../types';

type RecentUser = DashboardOverview['recent_users'][number];
type RecentPayment = DashboardOverview['recent_payments'][number];

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Panel className="flex min-w-0 flex-col gap-4 p-6">
      <div className="flex flex-col gap-1 border-b border-line pb-4">
        <PanelTitle>{title}</PanelTitle>
        <p className="font-display text-heading-sm text-content-secondary">{subtitle}</p>
      </div>
      {children}
    </Panel>
  );
}

/**
 * DashboardScreen — `/dashboard` (Figma "Dashboard"): platform totals, subscription split,
 * 6-month revenue and user growth, the newest users and the newest payments.
 */
export function DashboardScreen() {
  const m = useMessages(dashboardMessages);
  const c = useMessages(commonMessages);
  const { data, isLoading, isError, refetch } = useDashboard();
  const v = (n: number | undefined, f: (n: number) => string = formatCount) =>
    data && n != null ? f(n) : '—';

  const userColumns = useMemo<ListColumn<RecentUser>[]>(
    () => [
      {
        key: 'name',
        header: m.recentUsers.name,
        className: 'w-[200px]',
        cell: (u) => (
          <IdentityCell
            avatar={<EntityAvatar src={u.avatar_url} name={u.full_name} />}
            name={u.full_name || c.none}
            sub={interpolate(c.id, { id: u.player_code })}
          />
        ),
      },
      {
        key: 'type',
        header: m.recentUsers.type,
        className: 'text-center',
        cell: (u) => (
          <span
            className={cn(
              'whitespace-nowrap text-body-md',
              u.type === 'team_owner' ? 'text-violet' : 'text-content-link',
            )}
          >
            {c.userType[u.type]}
          </span>
        ),
      },
      {
        key: 'status',
        header: m.recentUsers.status,
        className: 'w-[100px] text-center',
        cell: (u) => <StatusTag status={u.status} className="w-full" />,
      },
      {
        key: 'joined',
        header: m.recentUsers.joined,
        className: 'text-center',
        cell: (u) => {
          const ago = relativeParts(u.created_at);
          const copy =
            ago.unit === 'now' ? m.ago.now : m.ago[ago.unit][ago.count === 1 ? 'one' : 'other'];
          return (
            <span className="font-display text-body-md text-content-secondary">
              {interpolate(copy, { count: ago.count })}
            </span>
          );
        },
      },
    ],
    [m, c],
  );

  const paymentColumns = useMemo<ListColumn<RecentPayment>[]>(
    () => [
      {
        key: 'team',
        header: m.recentPayments.team,
        className: 'w-[200px]',
        cell: (p) => {
          const name = p.team?.name ?? p.payer?.name ?? c.none;
          return (
            <IdentityCell
              avatar={<EntityAvatar src={p.team?.logo_url ?? p.payer?.avatar_url} name={name} />}
              name={name}
              sub={interpolate(c.id, { id: p.team?.team_code ?? p.payer?.player_code ?? '' })}
            />
          );
        },
      },
      {
        key: 'amount',
        header: m.recentPayments.amount,
        className: 'text-center',
        cell: (p) => (
          <span className="font-display text-body-md">
            {p.amount === 0 ? m.recentPayments.free : formatTaka(p.amount)}
          </span>
        ),
      },
      {
        key: 'status',
        header: m.recentPayments.status,
        className: 'w-[100px] text-center',
        cell: (p) => <StatusTag status={p.status} className="w-full" />,
      },
      {
        key: 'date',
        header: m.recentPayments.date,
        className: 'text-center',
        cell: (p) => (
          <span className="font-display text-body-md text-content-secondary">
            {formatDateMedium(p.date)}
          </span>
        ),
      },
    ],
    [m, c],
  );

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
      stroke: 'stroke-warning',
      swatch: 'bg-warning',
    },
    {
      key: 'expired',
      label: m.subscriptionStatus.expired,
      value: status?.expired ?? 0,
      stroke: 'stroke-danger',
      swatch: 'bg-danger',
    },
  ];

  const growthCard = (
    <ChartCard title={m.growth.title} subtitle={m.growth.subtitle}>
      <AreaChart
        label={m.growth.chartLabel}
        format={(n) => interpolate(m.growth.users, { count: formatCount(n) })}
        data={(data?.user_growth ?? []).map((g) => ({
          label: formatMonthShort(g.month),
          value: g.users,
        }))}
      />
    </ChartCard>
  );

  const recentUsers = (
    <Panel className="flex min-w-0 flex-col gap-4 p-4">
      <PanelTitle>{m.recentUsers.title}</PanelTitle>
      <ListTable
        columns={userColumns}
        rows={data?.recent_users}
        getRowId={(u) => u.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        minWidth={540}
      />
    </Panel>
  );

  const baseStats: StripItem[] = [
    {
      key: 'users',
      label: m.stats.users,
      tone: 'green',
      icon: <Users className="text-content-brand" strokeWidth={1.75} />,
      value: v(data?.stats.users),
    },
    {
      key: 'teams',
      label: m.stats.teams,
      tone: 'blue',
      icon: <DesignIcon name="jersey" size={23} />,
      value: v(data?.stats.teams),
    },
    {
      key: 'matches',
      label: m.stats.matches,
      tone: 'cyan',
      icon: <DesignIcon name="football" size={24} />,
      value: v(data?.stats.matches),
    },
  ];
  const paymentStats: StripItem[] = [
    {
      key: 'subs',
      label: m.stats.subscriptions,
      tone: 'gold',
      icon: <DesignIcon name="crown" size={24} />,
      value: v(data?.stats.active_subscriptions),
    },
    {
      key: 'revenue',
      label: m.stats.revenue,
      tone: 'indigo',
      icon: <TrendingUp className="text-violet" strokeWidth={1.75} />,
      value: v(data?.stats.revenue, formatTaka),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <StatStrip items={[...baseStats, ...paymentStats]} />

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title={m.subscriptionStatus.title} subtitle={m.subscriptionStatus.subtitle}>
          <DonutChart
            slices={slices}
            centreValue={status?.active ?? 0}
            centreLabel={m.subscriptionStatus.centre}
            label={interpolate(m.subscriptionStatus.chartLabel, {
              summary: slices.map((s) => `${s.label} ${s.value}`).join(', '),
            })}
          />
        </ChartCard>
        <ChartCard title={m.revenue.title} subtitle={m.revenue.subtitle}>
          <BarChart
            label={m.revenue.chartLabel}
            format={formatTaka}
            data={(data?.revenue ?? []).map((r) => ({
              label: formatMonthShort(r.month),
              value: r.amount,
            }))}
          />
        </ChartCard>
        {growthCard}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {recentUsers}
        <Panel className="flex min-w-0 flex-col gap-4 p-4">
          <PanelTitle>{m.recentPayments.title}</PanelTitle>
          <ListTable
            columns={paymentColumns}
            rows={data?.recent_payments}
            getRowId={(p) => p.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            minWidth={540}
          />
        </Panel>
      </div>
    </div>
  );
}
