'use client';

import {
  CalendarDays,
  ChevronRight,
  CircleX,
  Crown,
  Goal,
  Handshake,
  MapPin,
  Phone,
  Shield,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

import {
  ActionMenu,
  ActionToggle,
  DesignIcon,
  DetailHeader,
  EntityAvatar,
  InfoColumns,
  InfoDivider,
  InfoItem,
  Panel,
  PanelState,
  PillTabs,
  SectionLabel,
  StatusTag,
  VersusCard,
} from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { cn, formatDashedDay, formatDateMedium, formatMonthYear, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useTeam, useTeamContact } from '../hooks/queries';
import { teamsMessages } from '../i18n/teams.messages';
import type { BlockTarget } from './block-team-dialog';
import { TeamAppealCard } from './team-appeal-card';
import type { PersonRef } from '../types';

type Tab = 'overview' | 'players' | 'matches' | 'about';

function RecordCell({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span aria-hidden className="[&_svg]:size-6">
        {icon}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-body-xs font-semibold text-content-primary">
          {value}
        </span>
        <span className="text-caption text-content-muted">{label}</span>
      </span>
    </div>
  );
}

/**
 * Owner / captain row: avatar, role, name and phone. The whole row links to `/users?user=<id>`,
 * which opens that player's detail panel.
 */
function ContactRow({ person, role }: { person: PersonRef | null | undefined; role: string }) {
  const m = useMessages(teamsMessages);
  const c = useMessages(commonMessages);
  const { data: contact, isLoading } = useTeamContact(person?.id);

  if (!person) {
    return (
      <div className="flex items-center gap-3 rounded-[10px] bg-surface-muted px-3 py-2.5">
        <EntityAvatar src="" name="?" size={36} />
        <span className="flex flex-col leading-tight">
          <span className="text-caption text-content-muted">{role}</span>
          <span className="text-body-xs text-content-muted">{m.detail.noCaptain}</span>
        </span>
      </div>
    );
  }

  const phone = contact?.phone || (isLoading ? '…' : c.none);
  return (
    <Link
      href={`/users?user=${person.id}`}
      aria-label={interpolate(m.detail.openUser, { name: person.name })}
      className="group flex items-center gap-3 rounded-[10px] border border-transparent bg-surface-muted px-3 py-2.5 outline-none transition-colors hover:border-line-brand hover:bg-surface-tint focus-visible:ring-4 focus-visible:ring-brand-500/20"
    >
      <EntityAvatar src={person.avatar_url} name={person.name} size={36} />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="text-caption text-content-muted">{role}</span>
        <span className="truncate font-display text-body-xs font-semibold text-content-primary">
          {person.name || c.none}
        </span>
        <span className="flex items-center gap-1 text-caption text-content-secondary">
          <Phone aria-hidden className="size-3.5" />
          <span dir="ltr">{phone}</span>
        </span>
      </span>
      <ChevronRight
        aria-hidden
        className="size-4 shrink-0 text-content-muted transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
      />
    </Link>
  );
}

/**
 * Right-hand panel of the Teams screen (Figma "Teams" detail): logo, name, team id, status,
 * the played / win / draw / lost strip and four tabs.
 */
export function TeamDetailPanel({
  teamId,
  onToggleBlock,
}: {
  teamId: string | null;
  onToggleBlock: (target: BlockTarget) => void;
}) {
  const m = useMessages(teamsMessages);
  const c = useMessages(commonMessages);
  const [tab, setTab] = useState<Tab>('overview');
  const { data: team, isLoading, isError, refetch } = useTeam(teamId);

  if (!teamId) return <PanelState variant="empty" title={c.selectToView} />;
  if (isLoading) return <PanelState variant="loading" title={c.loading} />;
  if (isError || !team) {
    return (
      <PanelState variant="error" title={c.loadError} retryLabel={c.retry} onRetry={refetch} />
    );
  }

  const d = m.detail;
  const blocked = team.status === 'blocked';
  const captain = team.players.find((p) => p.role === 'captain');

  return (
    <Panel className="flex flex-col gap-[18px] p-5">
      <DetailHeader
        media={<EntityAvatar src={team.logo_url} name={team.name} size={150} shape="square" />}
        title={team.name}
        subtitle={interpolate(d.teamId, { id: team.team_code })}
        badges={<StatusTag status={team.status} />}
        menu={
          <ActionMenu label={interpolate(m.list.rowMenu, { name: team.name })}>
            <ActionToggle
              label={m.actions.block}
              checked={blocked}
              onSelect={() => onToggleBlock({ id: team.id, name: team.name, blocked })}
            />
          </ActionMenu>
        }
      />

      {team.appeal ? <TeamAppealCard team={team} /> : null}

      <div className="flex gap-2 rounded-[10px] bg-surface-muted p-2.5">
        <RecordCell
          icon={<Goal className="text-content-brand" />}
          value={team.record.played}
          label={d.played}
        />
        <RecordCell icon={<Trophy className="text-gold" />} value={team.record.won} label={d.win} />
        <RecordCell
          icon={<Handshake className="text-warning" />}
          value={team.record.drawn}
          label={d.draw}
        />
        <RecordCell
          icon={<CircleX className="text-danger" />}
          value={team.record.lost}
          label={d.lost}
        />
      </div>

      <PillTabs
        label={d.tabs}
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'overview', label: d.overview },
          { key: 'players', label: d.players },
          { key: 'matches', label: d.matches },
          { key: 'about', label: d.about },
        ]}
      />

      {tab === 'overview' ? (
        <div className="flex flex-col gap-2 px-2.5">
          <SectionLabel>{d.management}</SectionLabel>
          <div className="grid gap-2 sm:grid-cols-2">
            <ContactRow person={team.owner} role={d.owner} />
            <ContactRow person={captain} role={d.roleCaptain} />
          </div>
          <InfoDivider />
          <InfoItem icon={<MapPin />} label={d.homeGround} value={team.home_ground || c.none} />
          <InfoDivider />
          <InfoColumns
            left={
              <>
                <InfoItem
                  icon={<Users />}
                  label={d.teamSize}
                  value={interpolate(d.teamSizeValue, { count: team.player_count })}
                />
                <InfoItem
                  icon={<DesignIcon name="football" size={22} />}
                  label={d.format}
                  value={team.format}
                />
                <InfoItem icon={<User />} label={d.owner} value={team.owner?.name ?? c.none} />
              </>
            }
            right={
              <>
                <InfoItem
                  icon={<CalendarDays />}
                  label={d.founded}
                  value={formatMonthYear(team.founded_on)}
                />
                <InfoItem icon={<Shield />} label={d.skill} value={team.skill_level || c.none} />
                <InfoItem
                  icon={<Crown />}
                  label={d.subscription}
                  value={
                    team.subscription_ends_at
                      ? formatDateMedium(team.subscription_ends_at)
                      : d.noSubscription
                  }
                />
              </>
            }
          />
        </div>
      ) : null}

      {tab === 'players' ? (
        team.players.length ? (
          <ol className="flex flex-col">
            {team.players.map((p, i) => (
              <li
                key={p.id}
                className={cn(
                  'flex items-center gap-3 rounded-[8px] px-2.5 py-1.5',
                  i % 2 === 1 && 'bg-surface-muted',
                )}
              >
                <span className="w-5 text-body-xs text-content-secondary">{i + 1}</span>
                <EntityAvatar src={p.avatar_url} name={p.name} size={28} />
                <span className="min-w-0 flex-1 truncate font-display text-body-xs font-medium text-content-primary">
                  {p.name}
                  {p.role !== 'member' ? (
                    <span className="ms-1.5 text-caption font-normal text-content-muted">
                      ({p.role === 'owner' ? d.roleOwner : d.roleCaptain})
                    </span>
                  ) : null}
                </span>
                <span className="text-caption text-content-brand">{p.position}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="py-8 text-center text-body-xs text-content-muted">{d.noPlayers}</p>
        )
      ) : null}

      {tab === 'matches' ? (
        <div className="flex flex-col gap-2">
          <SectionLabel>{d.recentMatches}</SectionLabel>
          {team.recent_matches.length ? (
            team.recent_matches.map((match) => (
              <VersusCard
                key={match.id}
                date={formatDashedDay(match.kick_off)}
                caption={match.venue}
                home={{
                  name: match.home.name,
                  score: match.status === 'complete' ? match.home_score : null,
                  logo: <EntityAvatar src={match.home.logo_url} name={match.home.name} size={32} />,
                }}
                away={{
                  name: match.away.name,
                  score: match.status === 'complete' ? match.away_score : null,
                  logo: <EntityAvatar src={match.away.logo_url} name={match.away.name} size={32} />,
                }}
                footer={
                  match.status === 'complete' ? null : (
                    <div className="flex justify-center">
                      <StatusTag status={match.status} />
                    </div>
                  )
                }
              />
            ))
          ) : (
            <p className="py-8 text-center text-body-xs text-content-muted">{d.noMatches}</p>
          )}
        </div>
      ) : null}

      {tab === 'about' ? (
        <div className="flex flex-col gap-2 px-2.5">
          <InfoItem icon={<MapPin />} label={d.homeGround} value={team.home_ground || c.none} />
          <InfoDivider />
          <p className="whitespace-pre-line text-caption text-content-primary">
            {team.about || d.noAbout}
          </p>
        </div>
      ) : null}
    </Panel>
  );
}
