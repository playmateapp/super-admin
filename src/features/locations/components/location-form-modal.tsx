'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormWrapper, SelectInput, TextInput } from '@/components/form';
import { Button, Modal } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { getErrorMessage } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useSaveLocation } from '../hooks/mutations';
import { useLocationOptions } from '../hooks/queries';
import { locationsMessages } from '../i18n/locations.messages';
import type { LocationLevel, LocationRow } from '../types';
import {
  locationSchema,
  locationToForm,
  toLocationInput,
  type LocationFormValues,
} from '../validations/location.schema';

/**
 * Add / Edit Division, District or Thana (same frame as Add Area). Districts pick their
 * division; thanas pick a division, then one of its districts.
 */
export function LocationFormModal({
  open,
  onOpenChange,
  level,
  row,
  defaults,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: LocationLevel;
  /** `null` = add a new one. */
  row: LocationRow | null;
  /** The list's current filters, pre-selected when adding. */
  defaults: { division: string; district: string };
}) {
  const m = useMessages(locationsMessages);
  const c = useMessages(commonMessages);
  const save = useSaveLocation();
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(useMemo(() => locationSchema(m.errors, level), [m.errors, level])),
    defaultValues: locationToForm(level, null, defaults),
  });
  const division = form.watch('division');
  const divisions = useLocationOptions('division', null);
  const districts = useLocationOptions('district', division ? Number(division) : null);

  useEffect(() => {
    if (open) form.reset(locationToForm(level, row, defaults));
    // `defaults` is a fresh object each render; the open/row/level change is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, row, level, form]);

  const onSubmit = async (values: LocationFormValues) => {
    try {
      await save.mutateAsync({
        level,
        id: row?.id ?? null,
        input: toLocationInput(level, values),
      });
      toast.success(row ? m.form.updated : m.form.created);
      onOpenChange(false);
    } catch (err) {
      const message = getErrorMessage(err, c.saveFailed);
      if (message.includes('already exists')) {
        form.setError('name', { message: m.errors.duplicate });
      } else {
        toast.error(message);
      }
    }
  };

  const f = m.form;
  const title = row ? f.editTitle[level] : f.addTitle[level];
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      <div className="relative mb-4 flex items-center justify-center">
        <button
          type="button"
          aria-label={f.back}
          onClick={() => onOpenChange(false)}
          className="absolute start-0 grid size-8 place-items-center rounded-input hover:bg-surface-muted"
        >
          <ArrowLeft className="size-5 rtl:-scale-x-100" />
        </button>
        <h2 className="font-display text-heading-md font-semibold text-content-primary">{title}</h2>
      </div>
      <FormWrapper form={form} onSubmit={onSubmit} className="gap-4">
        {level !== 'division' ? (
          <SelectInput<LocationFormValues>
            name="division"
            label={f.division}
            placeholder={f.select}
            onChange={(e) => {
              form.setValue('division', e.target.value, { shouldValidate: true });
              form.setValue('district', '');
            }}
          >
            {(divisions.data ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectInput>
        ) : null}
        {level === 'thana' ? (
          <SelectInput<LocationFormValues>
            name="district"
            label={f.district}
            placeholder={f.select}
            disabled={!division}
          >
            {(districts.data ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectInput>
        ) : null}
        <TextInput<LocationFormValues>
          name="name"
          label={f.name}
          placeholder={f.namePlaceholder[level]}
          autoFocus
        />
        <TextInput<LocationFormValues>
          name="sort"
          inputMode="numeric"
          label={f.order}
          optionalLabel={c.optional}
          hint={f.orderHint}
          dir="ltr"
        />
        <Button type="submit" className="w-full" disabled={save.isPending}>
          {save.isPending ? f.saving : f.save}
          <Check />
        </Button>
      </FormWrapper>
    </Modal>
  );
}
