'use client';

import { CalendarDays, Clock, FileText, MapPin, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  ActionMenu,
  ActionToggle,
  DesignIcon,
  EntityAvatar,
  InfoColumns,
  InfoDivider,
  InfoItem,
  Panel,
  PanelState,
  PillTabs,
  StatusTag,
  UnderlineTabs,
} from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { countdownParts, formatClock, formatDateMedium, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useMatch } from '../hooks/queries';
import { matchesMessages } from '../i18n/matches.messages';
import type { MatchDetail, SquadPlayer, TeamRef } from '../types';
import type { CancelTarget } from './cancel-match-dialog';

type Tab = 'details' | 'players';

function TeamColumn({ team, label }: { team: TeamRef; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
      <EntityAvatar src={team.logo_url} name={team.name} size={40} shape="square" />
      <span className="text-caption text-content-muted">
        {interpolate(label, { id: team.team_code })}
      </span>
      <span className="font-display text-heading-md font-medium leading-tight text-content-primary">
        {team.name}
      </span>
    </div>
  );
}

/** "5d . 11h . 36m" until kick-off, ticking every 30 s. */
function Countdown({ kickOff, template }: { kickOff: string; template: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const p = countdownParts(kickOff, now);
  return <>{interpolate(template, { d: p.days, h: p.hours, m: p.minutes })}</>;
}

function SquadList({ players, m }: { players: SquadPlayer[]; m: (typeof matchesMessages)['en'] }) {
  if (!players.length) {
    return <p className="py-8 text-center text-body-xs text-content-muted">{m.detail.noSquad}</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {players.map((p) => (
        <li
          key={p.id}
          className="flex items-center gap-3 rounded-[10px] border border-line bg-surface-card p-2.5"
        >
          <EntityAvatar src={p.avatar_url} name={p.name} size={48} shape="square" />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate font-display text-body-xs font-medium text-content-primary">
              {p.name}
            </span>
            <span className="flex flex-wrap items-center gap-2 text-caption text-content-muted">
              {p.position ? (
                <span className="rounded-[6px] bg-surface-tint px-1.5 py-0.5 text-content-brand">
                  {p.position}
                </span>
              ) : null}
              {interpolate(m.detail.playerId, { id: p.player_code })}
            </span>
            <span className="flex items-center gap-1 text-caption text-content-primary">
              <DesignIcon name="goal" size={14} />
              {interpolate(m.detail.totalGoal, { count: String(p.goals).padStart(2, '0') })}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Right-hand panel of the Matches screen (Figma "Matches || Match details"). */
export function MatchDetailPanel({
  matchId,
  onCancel,
}: {
  matchId: string | null;
  onCancel: (target: CancelTarget) => void;
}) {
  const m = useMessages(matchesMessages);
  const c = useMessages(commonMessages);
  const [tab, setTab] = useState<Tab>('details');
  const [side, setSide] = useState<'home' | 'away'>('home');
  const { data: match, isLoading, isError, refetch } = useMatch(matchId);

  if (!matchId) return <PanelState variant="empty" title={c.selectToView} />;
  if (isLoading) return <PanelState variant="loading" title={c.loading} />;
  if (isError || !match) {
    return (
      <PanelState variant="error" title={c.loadError} retryLabel={c.retry} onRetry={refetch} />
    );
  }

  const d = m.detail;
  const showCountdown = match.status === 'upcoming' || match.status === 'ready_to_start';
  const canCancel = match.status !== 'complete' && match.status !== 'cancelled';

  return (
    <Panel className="flex flex-col gap-5 p-5">
      <div className="flex justify-end">
        <ActionMenu
          label={interpolate(m.list.rowMenu, { home: match.home.name, away: match.away.name })}
        >
          <ActionToggle
            label={m.actions.cancel}
            checked={match.status === 'cancelled'}
            disabled={!canCancel}
            onSelect={() =>
              onCancel({ id: match.id, home: match.home.name, away: match.away.name })
            }
          />
        </ActionMenu>
      </div>
      <div className="flex items-start gap-2">
        <TeamColumn team={match.home} label={d.teamId} />
        <div className="flex shrink-0 flex-col items-center gap-0.5 pt-1">
          <span className="font-display text-[28px] font-semibold leading-none text-content-brand">
            {match.home_score}-{match.away_score}
          </span>
          <span className="text-caption text-content-muted">{d.score}</span>
          <StatusTag status={match.status} className="min-w-0" />
        </div>
        <TeamColumn team={match.away} label={d.teamId} />
      </div>

      {showCountdown ? (
        <p className="rounded-[4px] bg-surface-sunken py-1.5 text-center font-display text-heading-sm text-content-primary">
          {d.countdown}{' '}
          <span className="font-semibold text-content-brand">
            <Countdown kickOff={match.kick_off} template={d.countdownValue} />
          </span>
        </p>
      ) : null}

      <PillTabs
        label={d.tabs}
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'details', label: d.details },
          { key: 'players', label: d.players },
        ]}
      />

      {tab === 'details' ? <MatchFacts match={match} m={m} none={c.none} /> : null}

      {tab === 'players' ? (
        <div className="flex flex-col gap-3">
          <UnderlineTabs
            label={d.players}
            value={side}
            onChange={setSide}
            tabs={[
              { key: 'home', label: match.home.name },
              { key: 'away', label: match.away.name },
            ]}
          />
          <SquadList players={match.squads[side]} m={m} />
        </div>
      ) : null}
    </Panel>
  );
}

function MatchFacts({
  match,
  m,
  none,
}: {
  match: MatchDetail;
  m: (typeof matchesMessages)['en'];
  none: string;
}) {
  const d = m.detail;
  return (
    <div className="flex flex-col gap-2 px-2.5">
      <InfoItem icon={<MapPin />} label={d.location} value={match.venue || none} />
      <InfoDivider />
      <InfoColumns
        left={
          <>
            <InfoItem
              icon={<CalendarDays />}
              label={d.matchDate}
              value={formatDateMedium(match.kick_off)}
            />
            <InfoItem
              icon={<Clock />}
              label={interpolate(d.duration, { minutes: match.duration_minutes })}
              value={formatClock(match.kick_off)}
            />
            <InfoItem
              icon={<DesignIcon name="football" size={22} />}
              label={d.format}
              value={match.format}
            />
          </>
        }
        right={
          <>
            <InfoItem
              icon={<CalendarDays />}
              label={d.createdAt}
              value={formatDateMedium(match.created_at)}
            />
            <InfoItem
              icon={<FileText />}
              label={d.createdBy}
              value={match.created_by_team?.name ?? match.created_by?.name ?? none}
            />
            <InfoItem icon={<Users />} label={d.awayTeam} value={match.away.name} />
          </>
        }
      />
    </div>
  );
}
