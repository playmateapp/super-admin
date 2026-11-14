'use client';

import {
  Building2,
  Cake,
  Landmark,
  Map as MapIcon,
  CalendarDays,
  GraduationCap,
  MapPin,
  Phone,
  Shirt,
  UserRound,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import {
  ActionMenu,
  ActionToggle,
  Chip,
  DesignIcon,
  DetailHeader,
  EntityAvatar,
  InfoBox,
  InfoColumns,
  InfoDivider,
  InfoItem,
  Panel,
  PanelState,
  PillTabs,
  SectionLabel,
  StatRow,
  StatusState,
  StatusTag,
  VersusCard,
} from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { formatDashedDay, formatDate, formatMonthYear, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useUser } from '../hooks/queries';
import { usersMessages } from '../i18n/users.messages';
import type { BlockTarget } from './block-user-dialog';

type Tab = 'overview' | 'stats' | 'photos' | 'about';

/**
 * Right-hand panel of the Users screen (Figma "Dashboard || Details menu"): picture, name,
 * id, status + position chips, the ⋮ menu (Block User) and the four tabs.
 */
export function UserDetailPanel({
  userId,
  onToggleBlock,
}: {
  userId: string | null;
  onToggleBlock: (target: BlockTarget) => void;
}) {
  const m = useMessages(usersMessages);
  const c = useMessages(commonMessages);
  const [tab, setTab] = useState<Tab>('overview');
  const { data: user, isLoading, isError, refetch } = useUser(userId);

  if (!userId) return <PanelState variant="empty" title={c.selectToView} />;
  if (isLoading) return <PanelState variant="loading" title={c.loading} />;
  if (isError || !user) {
    return (
      <PanelState variant="error" title={c.loadError} retryLabel={c.retry} onRetry={refetch} />
    );
  }

  const d = m.detail;
  const statTiles = [
    {
      key: 'm',
      label: d.statMatch,
      value: user.stats.matches,
      icon: <DesignIcon name="jersey" size={22} />,
    },
    {
      key: 'g',
      label: d.statGoal,
      value: user.stats.goals,
      icon: <DesignIcon name="football" size={22} />,
    },
    {
      key: 'a',
      label: d.statAssists,
      value: user.stats.assists,
      icon: <DesignIcon name="assist" size={22} />,
    },
    {
      key: 'r',
      label: d.statRed,
      value: user.stats.red_cards,
      icon: <DesignIcon name="redCard" size={22} />,
    },
    {
      key: 'y',
      label: d.statYellow,
      value: user.stats.yellow_cards,
      icon: <DesignIcon name="yellowCard" size={22} />,
    },
    {
      key: 's',
      label: d.statShots,
      value: user.stats.shots,
      icon: <DesignIcon name="goal" size={22} />,
    },
  ];

  return (
    <Panel className="flex flex-col gap-[18px] p-5">
      <DetailHeader
        media={
          <EntityAvatar src={user.avatar_url} name={user.full_name} size={150} shape="square" />
        }
        title={user.full_name || c.none}
        subtitle={interpolate(c.id, { id: user.player_code })}
        badges={
          <>
            <StatusTag status={user.status} />
            {user.position ? <Chip label={user.position.toLowerCase()} /> : null}
          </>
        }
        menu={
          <ActionMenu label={interpolate(m.list.rowMenu, { name: user.full_name })}>
            <ActionToggle
              label={m.actions.block}
              checked={user.status === 'blocked'}
              onSelect={() =>
                onToggleBlock({
                  id: user.id,
                  name: user.full_name,
                  blocked: user.status === 'blocked',
                })
              }
            />
          </ActionMenu>
        }
      />

      <PillTabs
        label={d.tabs}
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'overview', label: d.overview },
          { key: 'stats', label: d.stats },
          { key: 'photos', label: d.photos },
          { key: 'about', label: d.about },
        ]}
      />

      {tab === 'overview' ? (
        <div className="flex flex-col gap-[13px]">
          <div className="flex flex-col gap-2">
            <SectionLabel>{d.info}</SectionLabel>
            <InfoBox>
              <InfoColumns
                left={
                  <>
                    <InfoItem
                      icon={<MapIcon />}
                      label={d.division}
                      value={user.division || c.none}
                    />
                    <InfoItem icon={<MapPin />} label={d.thana} value={user.thana || c.none} />
                  </>
                }
                right={
                  <>
                    <InfoItem
                      icon={<Building2 />}
                      label={d.district}
                      value={user.district || c.none}
                    />
                    <InfoItem
                      icon={<Landmark />}
                      label={d.postCode}
                      value={user.post_code ? <span dir="ltr">{user.post_code}</span> : c.none}
                    />
                  </>
                }
              />
              <InfoDivider />
              <InfoColumns
                left={
                  <>
                    <InfoItem
                      icon={<UserRound />}
                      label={d.gender}
                      value={user.gender ? (m.genders[user.gender] ?? user.gender) : c.none}
                    />
                    <InfoItem
                      icon={<CalendarDays />}
                      label={d.age}
                      value={user.age != null ? interpolate(d.ageValue, { age: user.age }) : c.none}
                    />
                    <InfoItem icon={<Shirt />} label={d.position} value={user.position || c.none} />
                  </>
                }
                right={
                  <>
                    <InfoItem
                      icon={<GraduationCap />}
                      label={d.profileType}
                      value={
                        user.profile_type
                          ? (m.profileTypes[user.profile_type] ?? user.profile_type)
                          : c.none
                      }
                    />
                    <InfoItem
                      icon={<Cake />}
                      label={d.dateOfBirth}
                      value={user.date_of_birth ? formatDate(user.date_of_birth) : c.none}
                    />
                    <InfoItem
                      icon={<Users />}
                      label={d.currentTeam}
                      value={user.team?.name ?? c.none}
                    />
                    <InfoItem
                      icon={<CalendarDays />}
                      label={d.joined}
                      value={formatMonthYear(user.created_at)}
                    />
                  </>
                }
              />
              {user.phone ? (
                <>
                  <InfoDivider />
                  <InfoItem
                    icon={<Phone />}
                    label={d.phone}
                    value={<span dir="ltr">+{user.phone}</span>}
                  />
                </>
              ) : null}
            </InfoBox>
          </div>
          <div className="flex flex-col gap-2">
            <SectionLabel>{d.recentMatches}</SectionLabel>
            {user.recent_matches.length ? (
              user.recent_matches.map((match) => (
                <VersusCard
                  key={match.id}
                  date={formatDashedDay(match.kick_off)}
                  caption={match.venue}
                  home={{
                    name: match.home.name,
                    score: match.home_score,
                    logo: (
                      <EntityAvatar src={match.home.logo_url} name={match.home.name} size={32} />
                    ),
                  }}
                  away={{
                    name: match.away.name,
                    score: match.away_score,
                    logo: (
                      <EntityAvatar src={match.away.logo_url} name={match.away.name} size={32} />
                    ),
                  }}
                  footer={
                    <StatRow
                      items={[
                        {
                          key: 'g',
                          label: d.statGoal,
                          value: match.player.goals,
                          icon: <DesignIcon name="goal" size={20} />,
                        },
                        {
                          key: 'a',
                          label: d.statAssists,
                          value: match.player.assists,
                          icon: <DesignIcon name="assist" size={20} />,
                        },
                        {
                          key: 'r',
                          label: d.statRed,
                          value: match.player.red_cards,
                          icon: <DesignIcon name="redCard" size={20} />,
                        },
                        {
                          key: 'y',
                          label: d.statYellow,
                          value: match.player.yellow_cards,
                          icon: <DesignIcon name="yellowCard" size={20} />,
                        },
                      ]}
                    />
                  }
                />
              ))
            ) : (
              <p className="rounded-card border border-line p-4 text-center text-body-xs text-content-muted">
                {d.noMatches}
              </p>
            )}
          </div>
        </div>
      ) : null}

      {tab === 'stats' ? (
        <div className="flex flex-col gap-2">
          <SectionLabel>{d.performance}</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {statTiles.map((t) => (
              <div
                key={t.key}
                className="flex flex-col items-center gap-1 rounded-[10px] bg-surface-card p-3 shadow-field"
              >
                {t.icon}
                <span className="font-display text-heading-sm font-semibold text-content-primary">
                  {t.value}
                </span>
                <span className="text-caption text-content-muted">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === 'photos' ? (
        user.photos.length ? (
          <div className="grid grid-cols-3 gap-2">
            {user.photos.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL
              <img
                key={url}
                src={url}
                alt=""
                className="aspect-square w-full rounded-[10px] border border-line object-cover"
              />
            ))}
          </div>
        ) : (
          <StatusState variant="empty" title={d.noPhotos} className="py-10" />
        )
      ) : null}

      {tab === 'about' ? (
        <div className="flex flex-col gap-2">
          <SectionLabel>{d.about}</SectionLabel>
          <p className="whitespace-pre-line text-body-xs text-content-secondary">
            {user.about || d.noAbout}
          </p>
        </div>
      ) : null}
    </Panel>
  );
}
