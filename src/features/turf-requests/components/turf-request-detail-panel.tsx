'use client';

import {
  BadgeCheck,
  CalendarDays,
  Check,
  Link2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';

import {
  Button,
  DesignIcon,
  EntityAvatar,
  InfoBox,
  InfoColumns,
  InfoDivider,
  InfoItem,
  Panel,
  PanelState,
  SectionLabel,
  StatusPill,
  type PillTone,
} from '@/components/ui';
import { TURF_ROLES } from '@/lib/constants/turf';
import { commonMessages } from '@/lib/i18n';
import { formatDate, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useTurfRequest } from '../hooks/queries';
import { turfRequestsMessages } from '../i18n/turf-requests.messages';
import type { TurfRequest, TurfRequestStatus } from '../types';

export const turfStatusTone: Record<TurfRequestStatus, PillTone> = {
  pending: 'warning',
  appealed: 'info',
  approved: 'success',
  rejected: 'danger',
};

function ExternalLink({ href }: { href: string }) {
  return (
    <a
      href={href.includes('://') ? href : `https://${href}`}
      target="_blank"
      rel="noreferrer"
      dir="ltr"
      className="break-all text-content-brand underline"
    >
      {href}
    </a>
  );
}

/** Right-hand panel of the Turf Requests screen: photos, the form fields, review actions. */
export function TurfRequestDetailPanel({
  requestId,
  version,
  onApprove,
  onReject,
  onDelete,
}: {
  requestId: string | null;
  /** The list row's `updated_at`: a newer one refetches the panel. */
  version?: string;
  onApprove: (r: TurfRequest) => void;
  onReject: (r: TurfRequest) => void;
  onDelete: (r: TurfRequest) => void;
}) {
  const m = useMessages(turfRequestsMessages);
  const c = useMessages(commonMessages);
  const { data: r, isLoading, isError, refetch } = useTurfRequest(requestId, version);

  if (!requestId) return <PanelState variant="empty" title={c.selectToView} />;
  if (isLoading) return <PanelState variant="loading" title={c.loading} />;
  if (isError || !r) {
    return (
      <PanelState variant="error" title={c.loadError} retryLabel={c.retry} onRetry={refetch} />
    );
  }

  const d = m.detail;
  const open = r.status === 'pending' || r.status === 'appealed';
  const role = (TURF_ROLES as readonly string[]).includes(r.owner_role) ? r.owner_role : '';

  return (
    <Panel className="flex flex-col gap-5 p-5">
      <div className="relative aspect-[429/260] overflow-hidden rounded-[10px] bg-surface-muted">
        {r.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL
          <img src={r.photos[0]} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <MapPin aria-hidden className="absolute inset-0 m-auto size-12 text-content-muted" />
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-navy/75 to-transparent p-3 pt-12">
          <h2 className="truncate font-display text-heading-md font-medium text-white">
            {r.turf_name}
          </h2>
          <StatusPill tone={turfStatusTone[r.status]} label={m.status[r.status]} />
        </div>
      </div>

      {r.user ? (
        <div className="flex items-center gap-3">
          <EntityAvatar src={r.user.avatar_url} name={r.user.full_name} size={40} />
          <div className="flex min-w-0 flex-col text-body-xs">
            <span className="text-content-muted">{d.applicant}</span>
            <span className="truncate font-medium text-content-primary">
              {r.user.full_name} · <span dir="ltr">{r.user.phone || r.user.player_code}</span>
            </span>
          </div>
        </div>
      ) : null}

      {r.status === 'appealed' && r.appeal_message ? (
        <InfoBox className="border-info/40 bg-info-soft">
          <p className="text-caption font-semibold text-info">
            {d.appeal}
            {r.appealed_at
              ? ` · ${interpolate(d.appealedOn, { date: formatDate(r.appealed_at) })}`
              : ''}
          </p>
          <p className="whitespace-pre-line text-body-xs text-content-primary">
            {r.appeal_message}
          </p>
        </InfoBox>
      ) : null}
      {r.reject_reason && r.status !== 'approved' ? (
        <InfoBox className="border-danger/30 bg-danger-soft">
          <p className="text-caption font-semibold text-danger">{d.rejectReason}</p>
          <p className="whitespace-pre-line text-body-xs text-content-primary">{r.reject_reason}</p>
        </InfoBox>
      ) : null}

      <div className="flex flex-col gap-2 px-1">
        <SectionLabel>{d.turfInfo}</SectionLabel>
        <InfoColumns
          left={
            <>
              <InfoItem icon={<User />} label={d.owner} value={r.owner_name || c.none} />
              <InfoItem
                icon={<BadgeCheck />}
                label={d.role}
                value={role ? m.roles[role as keyof typeof m.roles] : r.owner_role || c.none}
              />
              <InfoItem
                icon={<DesignIcon name="football" size={22} />}
                label={d.format}
                value={r.format || c.none}
              />
            </>
          }
          right={
            <>
              <InfoItem
                icon={<Phone />}
                label={d.contact}
                value={<span dir="ltr">{r.phone}</span>}
              />
              <InfoItem
                icon={<Globe />}
                label={d.website}
                value={r.website ? <ExternalLink href={r.website} /> : c.none}
              />
              <InfoItem
                icon={<Link2 />}
                label={d.facebook}
                value={r.facebook ? <ExternalLink href={r.facebook} /> : c.none}
              />
            </>
          }
        />
        <InfoDivider />
        <InfoItem
          icon={<MapPin />}
          label={d.location}
          value={[r.thana, r.district, r.division].filter(Boolean).join(', ') || c.none}
        />
        <InfoItem icon={<Mail />} label={d.postCode} value={r.post_code || c.none} />
        <InfoItem icon={<MapPin />} label={d.address} value={r.address || c.none} />
        <InfoItem icon={<CalendarDays />} label={d.submitted} value={formatDate(r.created_at)} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>{d.photos}</SectionLabel>
        {r.photos.length ? (
          <div className="grid grid-cols-3 gap-2">
            {r.photos.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL */}
                <img
                  src={url}
                  alt=""
                  className="aspect-[4/3] w-full rounded-[8px] border border-line object-cover"
                />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-body-xs text-content-muted">{d.noPhotos}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {open ? (
          <>
            <Button size="sm" onClick={() => onApprove(r)}>
              <Check />
              {m.actions.approve}
            </Button>
            <Button size="sm" variant="danger" onClick={() => onReject(r)}>
              <X />
              {m.actions.reject}
            </Button>
          </>
        ) : null}
        {r.status === 'approved' && r.venue_id ? (
          <Button size="sm" variant="outline" asChild>
            <Link href="/venues">
              <MapPin />
              {d.viewVenue}
            </Link>
          </Button>
        ) : null}
        <Button size="sm" variant="outline" className="ms-auto" onClick={() => onDelete(r)}>
          <Trash2 />
          {m.actions.delete}
        </Button>
      </div>
    </Panel>
  );
}
