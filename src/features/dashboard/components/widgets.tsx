'use client';

import { isToday, isTomorrow, isYesterday } from 'date-fns';
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarRange } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { EntityAvatar, NativeSelect, Panel, StatusPill, type PillTone } from '@/components/ui';
import {
  cn,
  formatClock,
  formatCount,
  formatDateMedium,
  interpolate,
  relativeParts,
} from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { dashboardMessages } from '../i18n/dashboard.messages';
import type { DashboardOverview, DashboardRange, DivisionCount } from '../types';

type Messages = (typeof dashboardMessages)['en'];

const pct = (part: number, total: number) => (total > 0 ? (part / total) * 100 : 0);
const pctLabel = (part: number, total: number) => `${pct(part, total).toFixed(1)}%`;

/* ------------------------------------------------------------------ banner */

export const RANGES: DashboardRange[] = [1, 3, 6, 12];

export function WelcomeBanner({
  name,
  range,
  onRange,
}: {
  name: string;
  range: DashboardRange;
  onRange: (r: DashboardRange) => void;
}) {
  const m = useMessages(dashboardMessages);
  return (
    <Panel className="strip-green relative flex flex-col gap-4 overflow-hidden p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span
          aria-hidden
          className="grid size-14 shrink-0 place-items-center rounded-full bg-surface-card shadow-card"
        >
          <span className="text-[28px] leading-none">⚽</span>
        </span>
        <div className="min-w-0 font-display">
          <h1 className="truncate text-heading-md font-semibold text-content-primary">
            {interpolate(m.banner.greeting, { name })} 👋
          </h1>
          <p className="text-body-xs text-content-secondary">{m.banner.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <CalendarRange aria-hidden className="size-5 shrink-0 text-content-brand" />
        <NativeSelect
          size="sm"
          aria-label={m.banner.rangeLabel}
          value={range}
          onChange={(e) => onRange(Number(e.target.value) as DashboardRange)}
          className="bg-surface-card text-content-primary"
          containerClassName="w-full sm:w-[180px]"
        >
          {RANGES.map((r) => (
            <option key={r} value={r}>
              {m.banner.range[r]}
            </option>
          ))}
        </NativeSelect>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ stat cards */

const tiles = {
  green: 'bg-success-soft text-success',
  blue: 'bg-info-soft text-info',
  violet: 'bg-violet-soft text-violet',
  orange: 'bg-warning-soft text-warning',
  gold: 'bg-warning-soft text-gold',
  cyan: 'bg-cyan-soft text-cyan',
} as const;

export interface TrendStat {
  key: string;
  label: string;
  value: string;
  current?: number;
  previous?: number;
  icon: ReactNode;
  tone: keyof typeof tiles;
}

function Trend({ current, previous, m }: { current?: number; previous?: number; m: Messages }) {
  if (current == null || previous == null || previous <= 0) return null;
  const change = ((current - previous) / previous) * 100;
  const up = change >= 0;
  const text = `${up ? '+' : ''}${Math.round(change)}%`;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <p
      className={cn('flex items-center gap-1 text-caption', up ? 'text-success' : 'text-danger')}
      aria-label={interpolate(m.stats.trendLabel, { change: text })}
    >
      <Icon aria-hidden className="size-3.5" />
      <span className="font-semibold">{text}</span>
      <span className="truncate text-content-muted">{m.stats.vs}</span>
    </p>
  );
}

export function TrendStats({ items }: { items: TrendStat[] }) {
  const m = useMessages(dashboardMessages);
  return (
    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
      {items.map((s) => (
        <Panel key={s.key} className="flex min-w-0 items-start gap-3 p-4">
          <span
            aria-hidden
            className={cn(
              'grid size-12 shrink-0 place-items-center rounded-tile [&_svg]:size-6',
              tiles[s.tone],
            )}
          >
            {s.icon}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5 font-display">
            <p className="truncate text-body-xs text-content-secondary">{s.label}</p>
            <p className="truncate text-heading-lg font-bold text-content-primary">{s.value}</p>
            <Trend current={s.current} previous={s.previous} m={m} />
          </div>
        </Panel>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ card shell */

export function DashCard({
  title,
  icon,
  href,
  aside,
  className,
  children,
}: {
  title: string;
  icon?: ReactNode;
  href?: string;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const m = useMessages(dashboardMessages);
  return (
    <Panel className={cn('flex min-w-0 flex-col gap-4 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 font-display text-heading-sm font-semibold text-content-primary">
          {icon ? (
            <span aria-hidden className="text-content-brand [&_svg]:size-5">
              {icon}
            </span>
          ) : null}
          <span className="truncate">{title}</span>
        </h2>
        {aside}
        {href ? (
          <Link
            href={href}
            className="flex shrink-0 items-center gap-1 rounded text-caption text-content-link hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-line-brand"
          >
            {m.viewAll}
            <ArrowRight aria-hidden className="size-3.5 rtl:rotate-180" />
          </Link>
        ) : null}
      </div>
      {children}
    </Panel>
  );
}

/* ------------------------------------------------------------------ status split */

export function StatusSplit({
  title,
  icon,
  href,
  rows,
}: {
  title: string;
  icon: ReactNode;
  href: string;
  rows: { key: string; label: string; value?: number; icon: ReactNode; tone: 'ok' | 'bad' }[];
}) {
  const total = rows.reduce((s, r) => s + (r.value ?? 0), 0);
  return (
    <DashCard title={title} icon={icon} href={href}>
      <ul className="flex flex-col">
        {rows.map((r) => (
          <li
            key={r.key}
            className="flex items-center gap-3 border-b border-line py-2.5 font-display last:border-b-0"
          >
            <span
              aria-hidden
              className={cn(
                'grid size-8 shrink-0 place-items-center rounded-full [&_svg]:size-4',
                r.tone === 'ok' ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
              )}
            >
              {r.icon}
            </span>
            <span className="min-w-0 flex-1 truncate text-body-xs text-content-primary">
              {r.label}
            </span>
            <span className="text-heading-sm font-semibold text-content-primary">
              {r.value == null ? '—' : formatCount(r.value)}
            </span>
            <span className="w-[60px] text-end text-caption text-content-muted">
              ({r.value == null ? '—' : pctLabel(r.value, total)})
            </span>
          </li>
        ))}
      </ul>
      <div aria-hidden className="flex h-2 overflow-hidden rounded-pill bg-surface-muted">
        {rows.map((r) => (
          <span
            key={r.key}
            className={r.tone === 'ok' ? 'bg-success' : 'bg-danger'}
            style={{ width: `${pct(r.value ?? 0, total)}%` }}
          />
        ))}
      </div>
    </DashCard>
  );
}

/* ------------------------------------------------------------------ divisions */

/** Top 3 named divisions + "Others" (every other division and people with none set). */
export function DivisionCard({
  title,
  icon,
  href,
  data,
}: {
  title: string;
  icon: ReactNode;
  href: string;
  data?: DivisionCount[];
}) {
  const m = useMessages(dashboardMessages);
  const total = (data ?? []).reduce((s, d) => s + d.count, 0);
  const top = (data ?? [])
    .filter((d) => d.division)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  const rest = total - top.reduce((s, d) => s + d.count, 0);
  const rows = [...top.map((d) => ({ label: d.division, count: d.count, main: true }))];
  if (rest > 0) rows.push({ label: m.divisions.others, count: rest, main: false });

  return (
    <DashCard title={title} icon={icon} href={href}>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-body-xs text-content-muted">
          {data ? m.divisions.empty : '—'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r, i) => (
            <li
              key={r.label}
              className="grid grid-cols-[96px_1fr_auto] items-center gap-3 font-display"
            >
              <span className="truncate text-body-xs text-content-primary">{r.label}</span>
              <span
                className="h-2 overflow-hidden rounded-pill bg-surface-muted"
                role="presentation"
              >
                <span
                  className={cn(
                    'block h-full rounded-pill',
                    !r.main ? 'bg-brand-300' : i === 0 ? 'bg-brand-500' : 'bg-success',
                  )}
                  style={{ width: `${Math.max(pct(r.count, total), r.count ? 2 : 0)}%` }}
                />
              </span>
              <span className="whitespace-nowrap text-end text-body-xs">
                <span className="font-semibold text-content-primary">{formatCount(r.count)}</span>{' '}
                <span className="text-content-muted">({pctLabel(r.count, total)})</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashCard>
  );
}

/* ------------------------------------------------------------------ recent players */

export function RecentPlayers({
  title,
  href,
  users,
  typeLabel,
}: {
  title: string;
  href: string;
  users?: DashboardOverview['recent_users'];
  typeLabel: (t: 'player' | 'team_owner') => string;
}) {
  const m = useMessages(dashboardMessages);
  return (
    <DashCard title={title} href={href}>
      {!users ? (
        <p className="py-6 text-center text-body-xs text-content-muted">—</p>
      ) : users.length === 0 ? (
        <p className="py-6 text-center text-body-xs text-content-muted">{m.recentPlayers.empty}</p>
      ) : (
        <ul className="flex flex-col">
          {users.slice(0, 4).map((u) => {
            const ago = relativeParts(u.created_at);
            const copy =
              ago.unit === 'now' ? m.ago.now : m.ago[ago.unit][ago.count === 1 ? 'one' : 'other'];
            return (
              <li
                key={u.id}
                className="flex items-center gap-3 border-b border-line py-2 last:border-b-0"
              >
                <EntityAvatar src={u.avatar_url} name={u.full_name} size={36} />
                <div className="min-w-0 flex-1 font-display">
                  <p className="truncate text-body-xs font-medium text-content-primary">
                    {u.full_name || '—'}
                  </p>
                  <p className="truncate text-caption text-content-muted">ID: {u.player_code}</p>
                </div>
                <span className="hidden whitespace-nowrap text-caption text-content-secondary sm:inline">
                  {interpolate(copy, { count: ago.count })}
                </span>
                <StatusPill
                  tone={u.type === 'team_owner' ? 'info' : 'success'}
                  label={typeLabel(u.type)}
                  className="min-w-[72px]"
                />
              </li>
            );
          })}
        </ul>
      )}
    </DashCard>
  );
}

/* ------------------------------------------------------------------ recent matches */

function whenLabel(iso: string, m: Messages) {
  const d = new Date(iso);
  const time = formatClock(d);
  if (isToday(d)) return interpolate(m.recentMatches.today, { time });
  if (isTomorrow(d)) return interpolate(m.recentMatches.tomorrow, { time });
  if (isYesterday(d)) return interpolate(m.recentMatches.yesterday, { time });
  return `${formatDateMedium(d)}, ${time}`;
}

export function RecentMatches({
  href,
  matches,
}: {
  href: string;
  matches?: NonNullable<DashboardOverview['recent_matches']>;
}) {
  const m = useMessages(dashboardMessages);
  return (
    <DashCard title={m.recentMatches.title} href={href}>
      {!matches || matches.length === 0 ? (
        <p className="py-6 text-center text-body-xs text-content-muted">
          {matches ? m.recentMatches.empty : '—'}
        </p>
      ) : (
        <ul className="flex flex-col">
          {matches.map((x) => {
            const state: { label: string; tone: PillTone } =
              x.phase === 'finished'
                ? { label: m.recentMatches.phase.finished, tone: 'success' }
                : x.phase === 'canceled'
                  ? { label: m.recentMatches.phase.canceled, tone: 'danger' }
                  : x.phase === 'not_started'
                    ? { label: m.recentMatches.phase.upcoming, tone: 'info' }
                    : { label: m.recentMatches.phase.live, tone: 'warning' };
            const showScore = x.phase !== 'not_started' && x.phase !== 'canceled';
            return (
              <li
                key={x.id}
                className="flex items-center gap-3 border-b border-line py-2.5 font-display last:border-b-0"
              >
                <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <EntityAvatar src={x.home?.logo_url} name={x.home?.name ?? ''} size={28} />
                    <span className="truncate text-body-xs text-content-primary">
                      {x.home?.name ?? '—'}
                    </span>
                  </span>
                  <span className="whitespace-nowrap text-body-xs font-semibold text-content-primary">
                    {showScore ? `${x.home_score} - ${x.away_score}` : m.recentMatches.vs}
                  </span>
                  <span className="flex min-w-0 items-center gap-2">
                    <EntityAvatar src={x.away?.logo_url} name={x.away?.name ?? ''} size={28} />
                    <span className="truncate text-body-xs text-content-primary">
                      {x.away?.name ?? '—'}
                    </span>
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusPill tone={state.tone} label={state.label} className="min-w-[84px]" />
                  <span className="whitespace-nowrap text-caption text-content-muted">
                    {whenLabel(x.kick_off, m)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashCard>
  );
}

/* ------------------------------------------------------------------ pending actions */

export function PendingActions({
  rows,
}: {
  rows: { key: string; label: string; count?: number; href: string; icon: ReactNode }[];
}) {
  const m = useMessages(dashboardMessages);
  const total = rows.reduce((s, r) => s + (r.count ?? 0), 0);
  return (
    <DashCard
      title={m.pending.title}
      aside={
        <span
          className={cn(
            'me-auto rounded-pill px-2 py-0.5 text-caption font-semibold',
            total ? 'bg-danger text-content-on-brand' : 'bg-surface-muted text-content-muted',
          )}
          aria-label={interpolate(m.pending.total, { count: total })}
        >
          {total}
        </span>
      }
    >
      <ul className="flex flex-col">
        {rows.map((r) => (
          <li key={r.key} className="border-b border-line last:border-b-0">
            <Link
              href={r.href}
              className="flex items-center gap-3 rounded py-3 font-display hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-line-brand"
            >
              <span aria-hidden className="text-content-brand [&_svg]:size-6">
                {r.icon}
              </span>
              <span className="min-w-0 flex-1 text-body-xs text-content-primary">{r.label}</span>
              <span
                className={cn(
                  'grid h-6 min-w-[32px] place-items-center rounded-pill px-2 text-caption font-semibold',
                  r.count ? 'bg-danger-soft text-danger' : 'bg-surface-muted text-content-muted',
                )}
              >
                {r.count ?? '—'}
              </span>
              <ArrowRight aria-hidden className="size-4 text-content-secondary rtl:rotate-180" />
            </Link>
          </li>
        ))}
      </ul>
    </DashCard>
  );
}
