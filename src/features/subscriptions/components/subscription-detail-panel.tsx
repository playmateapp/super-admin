'use client';

import { CalendarDays, CreditCard, FileText, Users } from 'lucide-react';

import {
  Chip,
  DesignIcon,
  DetailHeader,
  EntityAvatar,
  InfoBox,
  InfoColumns,
  InfoItem,
  Panel,
  PanelState,
  SectionLabel,
  StatusTag,
} from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { formatDateMedium, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useSubscription } from '../hooks/queries';
import { subscriptionsMessages } from '../i18n/subscriptions.messages';

/**
 * Right-hand panel of the Subscriptions screen (Figma "Subscriptions" detail): the team owner
 * who paid, the payment facts and the subscribed team card.
 */
export function SubscriptionDetailPanel({ subscriptionId }: { subscriptionId: string | null }) {
  const m = useMessages(subscriptionsMessages);
  const c = useMessages(commonMessages);
  const { data: sub, isLoading, isError, refetch } = useSubscription(subscriptionId);

  if (!subscriptionId) return <PanelState variant="empty" title={c.selectToView} />;
  if (isLoading) return <PanelState variant="loading" title={c.loading} />;
  if (isError || !sub) {
    return (
      <PanelState variant="error" title={c.loadError} retryLabel={c.retry} onRetry={refetch} />
    );
  }

  const d = m.detail;
  const period =
    sub.plan.duration_days === 30 ? d.month : interpolate(d.days, { days: sub.plan.duration_days });
  const amount = sub.payment?.amount ?? sub.plan.price;

  return (
    <Panel className="flex flex-col gap-[18px] p-5">
      <DetailHeader
        media={
          <EntityAvatar
            src={sub.owner.avatar_url}
            name={sub.owner.name}
            size={150}
            shape="square"
          />
        }
        title={sub.owner.name || c.none}
        subtitle={interpolate(c.id, { id: sub.owner.player_code })}
        badges={
          <>
            <StatusTag status={sub.status} />
            {sub.owner.position ? <Chip label={sub.owner.position.toLowerCase()} /> : null}
          </>
        }
      />

      <div className="flex flex-col gap-2">
        <SectionLabel>{d.details}</SectionLabel>
        <InfoBox>
          <InfoColumns
            left={
              <>
                <InfoItem
                  icon={<FileText />}
                  label={d.txn}
                  value={
                    sub.payment?.provider_txn_id ||
                    sub.payment?.id.slice(0, 18).toUpperCase() ||
                    d.noPayment
                  }
                />
                <InfoItem
                  icon={<DesignIcon name="crown" size={22} />}
                  label={d.plan}
                  value={sub.plan.name}
                />
                <InfoItem
                  icon={<CalendarDays />}
                  label={d.start}
                  value={formatDateMedium(sub.starts_at)}
                />
              </>
            }
            right={
              <>
                <InfoItem
                  icon={<CreditCard />}
                  label={d.method}
                  value={sub.payment ? d.methods[sub.payment.method] : c.none}
                />
                <InfoItem
                  icon={<Users />}
                  label={d.amount}
                  value={
                    sub.payment?.method === 'free'
                      ? d.freeAmount
                      : interpolate(d.amountValue, { amount, period })
                  }
                />
                <InfoItem
                  icon={<CalendarDays />}
                  label={d.end}
                  value={formatDateMedium(sub.ends_at)}
                />
              </>
            }
          />
        </InfoBox>
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>{d.team}</SectionLabel>
        {sub.team ? (
          <div className="flex items-center gap-3 rounded-[10px] bg-surface-muted p-3">
            <EntityAvatar src={sub.team.logo_url} name={sub.team.name} size={64} />
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="truncate font-display text-body-xs font-semibold text-content-primary">
                {sub.team.name}
              </p>
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-content-muted">
                <span>{interpolate(d.teamId, { id: sub.team.team_code })}</span>
                <span>{sub.team.format}</span>
                <span>{interpolate(d.members, { count: sub.team.player_count })}</span>
              </p>
              {sub.team.home_ground ? (
                <p className="text-caption text-content-primary">{sub.team.home_ground}</p>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="rounded-[10px] bg-surface-muted p-3 text-caption text-content-muted">
            {d.noTeam}
          </p>
        )}
      </div>
    </Panel>
  );
}
