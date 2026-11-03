'use client';

import { commonMessages } from '@/lib/i18n';
import { useMessages } from '@/providers/i18n-provider';

import { StatusPill, type PillTone } from './status-pill';

export type StatusKey = keyof (typeof commonMessages)['en']['status'];

/** Pill colour per status word, as drawn in the Figma lists. */
const tone: Record<StatusKey, PillTone> = {
  active: 'success',
  complete: 'success',
  completed: 'success',
  paid: 'success',
  new: 'info',
  ready_to_start: 'cyan',
  pending: 'success',
  upcoming: 'warning',
  expired: 'warning',
  due: 'warning',
  blocked: 'danger',
  cancelled: 'danger',
  ongoing: 'danger',
  failed: 'danger',
  inactive: 'neutral',
  refunded: 'neutral',
};

/** Status pill from an API status word (`active`, `blocked`, `ready_to_start` …). */
export function StatusTag({ status, className }: { status: string; className?: string }) {
  const m = useMessages(commonMessages).status;
  const key = (status in tone ? status : 'inactive') as StatusKey;
  return <StatusPill tone={tone[key]} label={m[key] ?? status} className={className} />;
}
