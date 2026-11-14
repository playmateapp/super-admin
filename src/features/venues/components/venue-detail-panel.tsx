'use client';

import { BadgeCheck, CalendarDays, Globe, Link2, Mail, MapPin, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  ActionEdit,
  ActionMenu,
  ActionToggle,
  DesignIcon,
  InfoColumns,
  InfoDivider,
  InfoItem,
  Panel,
  PanelState,
  PillTabs,
  StatusTag,
} from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useVenue } from '../hooks/queries';
import { venuesMessages } from '../i18n/venues.messages';
import type { Venue } from '../types';

type Tab = 'details' | 'photos';

/**
 * Right-hand panel of the Venues screen (Figma "All Venues || Details" / "Photos"): cover
 * photo with the name over it and the ⋮ menu, Details / Photos tabs.
 */
export function VenueDetailPanel({
  venueId,
  onEdit,
  onToggleStatus,
}: {
  venueId: string | null;
  onEdit: (venue: Venue) => void;
  onToggleStatus: (venue: Venue) => void;
}) {
  const m = useMessages(venuesMessages);
  const c = useMessages(commonMessages);
  const [tab, setTab] = useState<Tab>('details');
  const { data: venue, isLoading, isError, refetch } = useVenue(venueId);

  if (!venueId) return <PanelState variant="empty" title={c.selectToView} />;
  if (isLoading) return <PanelState variant="loading" title={c.loading} />;
  if (isError || !venue) {
    return (
      <PanelState variant="error" title={c.loadError} retryLabel={c.retry} onRetry={refetch} />
    );
  }

  const d = m.detail;
  const gallery = venue.photos.length ? venue.photos : venue.photo_url ? [venue.photo_url] : [];

  return (
    <Panel className="flex flex-col gap-5 p-5">
      <div className="relative aspect-[429/321] overflow-hidden rounded-[10px] bg-surface-muted">
        {venue.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL
          <img src={venue.photo_url} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <MapPin aria-hidden className="absolute inset-0 m-auto size-12 text-content-muted" />
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-navy/70 to-transparent p-2.5 pt-10">
          <span className="grid size-9 shrink-0 place-items-center rounded-[6px] bg-surface-card">
            <MapPin aria-hidden className="size-5 text-content-primary" />
          </span>
          <h2 className="truncate font-display text-heading-md font-medium text-white">
            {venue.name}
          </h2>
        </div>
        <div className="absolute end-2.5 top-2.5 rounded-[6px] bg-navy/60 text-white">
          <ActionMenu
            label={interpolate(m.list.rowMenu, { name: venue.name })}
            triggerClassName="text-white hover:bg-white/10"
          >
            <ActionEdit label={m.actions.edit} onSelect={() => onEdit(venue)} />
            <ActionToggle
              label={m.actions.inactive}
              checked={venue.status === 'inactive'}
              onSelect={() => onToggleStatus(venue)}
            />
          </ActionMenu>
        </div>
      </div>

      <PillTabs
        label={d.tabs}
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'details', label: d.details },
          { key: 'photos', label: d.photos },
        ]}
      />

      {tab === 'details' ? (
        <div className="flex flex-col gap-2 px-2.5">
          <InfoItem
            icon={<MapPin />}
            label={d.location}
            value={
              [venue.thana, venue.district, venue.division].filter(Boolean).join(', ') || c.none
            }
          />
          <InfoItem icon={<MapPin />} label={d.address} value={venue.address || c.none} />
          <InfoDivider />
          <InfoColumns
            left={
              <>
                <InfoItem
                  icon={<DesignIcon name="football" size={22} />}
                  label={d.format}
                  value={venue.format || c.none}
                />
                <InfoItem icon={<Mail />} label={d.postCode} value={venue.post_code || c.none} />
                <InfoItem icon={<User />} label={d.owner} value={venue.owner_name || c.none} />
                <InfoItem
                  icon={<BadgeCheck />}
                  label={d.role}
                  value={
                    venue.owner_role
                      ? (m.roles[venue.owner_role as keyof typeof m.roles] ?? venue.owner_role)
                      : c.none
                  }
                />
              </>
            }
            right={
              <>
                <InfoItem
                  icon={<CalendarDays />}
                  label={d.status}
                  value={<StatusTag status={venue.status} className="min-w-0" />}
                />
                <InfoItem
                  icon={<Phone />}
                  label={d.contact}
                  value={venue.phone ? <span dir="ltr">{venue.phone}</span> : c.none}
                />
                <InfoItem
                  icon={<Globe />}
                  label={d.website}
                  value={
                    venue.website ? (
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noreferrer"
                        dir="ltr"
                        className="break-all text-content-brand underline"
                      >
                        {venue.website}
                      </a>
                    ) : (
                      c.none
                    )
                  }
                />
                <InfoItem
                  icon={<Link2 />}
                  label={d.facebook}
                  value={
                    venue.facebook ? (
                      <a
                        href={venue.facebook}
                        target="_blank"
                        rel="noreferrer"
                        dir="ltr"
                        className="break-all text-content-brand underline"
                      >
                        {venue.facebook}
                      </a>
                    ) : (
                      c.none
                    )
                  }
                />
              </>
            }
          />
          {venue.request_id ? (
            <p className="text-caption text-content-muted">
              {d.fromRequest}{' '}
              <Link
                href={`/turf-requests?request=${venue.request_id}`}
                className="text-content-brand underline"
              >
                {d.viewRequest}
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {tab === 'photos' ? (
        gallery.length ? (
          <div className="grid grid-cols-2 gap-2">
            {gallery.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL
              <img
                key={url}
                src={url}
                alt=""
                className="aspect-[4/3] w-full rounded-[10px] border border-line object-cover"
              />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-body-xs text-content-muted">{d.noPhotos}</p>
        )
      ) : null}
    </Panel>
  );
}
