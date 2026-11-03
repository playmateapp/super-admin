'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, ImagePlus, Loader2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormWrapper, SelectInput, TextInput, TextareaInput } from '@/components/form';
import { Button, Modal } from '@/components/ui';
import { MATCH_FORMATS } from '@/lib/constants/match-formats';
import { useAreas } from '@/lib/hooks/use-areas';
import { commonMessages } from '@/lib/i18n';
import { cn, getErrorMessage } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useSaveVenue, useUploadVenuePhoto } from '../hooks/mutations';
import { venuesMessages } from '../i18n/venues.messages';
import type { Venue } from '../types';
import {
  emptyVenueForm,
  toVenueInput,
  venueSchema,
  venueToForm,
  type VenueFormValues,
} from '../validations/venue.schema';

/**
 * Add / Edit Venue (Figma "All Venues || Add Venue" / "Edit venues"): cover image, turf name,
 * surface, opening hours, phone, facilities, description and the match-format chips. Added to
 * the design: area + location (the app filters by area), owner and a photo gallery (the
 * detail panel shows them) — see docs/DISCUSSIONS.md D-007.
 */
export function VenueFormModal({
  open,
  onOpenChange,
  venue,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null` = add a new venue. */
  venue: Venue | null;
  onSaved?: (id: string) => void;
}) {
  const m = useMessages(venuesMessages);
  const c = useMessages(commonMessages);
  const { data: areas } = useAreas();
  const save = useSaveVenue();
  const upload = useUploadVenuePhoto();
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [cover, setCover] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const schema = useMemo(() => venueSchema(m.errors), [m.errors]);
  const form = useForm<VenueFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyVenueForm,
  });

  // Load the venue (or a blank form) each time the modal opens.
  useEffect(() => {
    if (!open) return;
    form.reset(venue ? venueToForm(venue) : emptyVenueForm);
    setCover(venue?.photo_url ?? '');
    setPhotos(venue?.photos ?? []);
  }, [open, venue, form]);

  const uploadFiles = async (files: FileList | null) => {
    const urls: string[] = [];
    for (const file of Array.from(files ?? [])) {
      try {
        urls.push(await upload.mutateAsync(file));
      } catch (err) {
        toast.error(getErrorMessage(err, m.form.uploadFailed));
      }
    }
    return urls;
  };

  const onCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const [url] = await uploadFiles(e.target.files);
    if (url) setCover(url);
    e.target.value = '';
  };

  const onGallery = async (e: ChangeEvent<HTMLInputElement>) => {
    const urls = await uploadFiles(e.target.files);
    setPhotos((prev) => [...prev, ...urls]);
    e.target.value = '';
  };

  const onSubmit = async (values: VenueFormValues) => {
    try {
      const id = await save.mutateAsync({
        id: venue?.id ?? null,
        input: toVenueInput(values, cover || photos[0] || '', photos),
      });
      toast.success(venue ? m.form.updated : m.form.created);
      onSaved?.(id);
      onOpenChange(false);
    } catch (err) {
      toast.error(getErrorMessage(err, c.saveFailed));
    }
  };

  const format = form.watch('format');
  const f = m.form;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={venue ? f.editTitle : f.addTitle}>
      <div className="relative mb-4 flex items-center justify-center">
        <button
          type="button"
          aria-label={f.back}
          onClick={() => onOpenChange(false)}
          className="absolute start-0 grid size-8 place-items-center rounded-input hover:bg-surface-muted"
        >
          <ArrowLeft className="size-5 rtl:-scale-x-100" />
        </button>
        <h2 className="font-display text-heading-md font-semibold text-content-primary">
          {venue ? f.editTitle : f.addTitle}
        </h2>
      </div>

      <FormWrapper form={form} onSubmit={onSubmit} className="gap-4">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => coverInput.current?.click()}
            className="relative grid size-[90px] place-items-center overflow-hidden rounded-full border border-dashed border-content-muted bg-surface-muted text-content-brand"
          >
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL
              <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
            ) : null}
            <span
              className={cn(
                'relative flex flex-col items-center gap-1 text-caption font-medium',
                cover && 'rounded-input bg-surface-card/80 px-1.5 py-1',
              )}
            >
              {upload.isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ImagePlus className="size-5" />
              )}
              {cover ? f.changeImage : f.upload}
            </span>
          </button>
          <input ref={coverInput} type="file" accept="image/*" hidden onChange={onCover} />
        </div>

        <TextInput<VenueFormValues> name="name" label={f.name} placeholder={f.namePlaceholder} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectInput<VenueFormValues> name="area" label={f.area} placeholder={f.areaPlaceholder}>
            {(areas ?? []).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </SelectInput>
          <TextInput<VenueFormValues>
            name="address"
            label={f.address}
            placeholder={f.addressPlaceholder}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectInput<VenueFormValues>
            name="surface"
            label={f.surface}
            placeholder={f.surfacePlaceholder}
          >
            {m.surfaces.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectInput>
          <TextInput<VenueFormValues>
            name="opening_hours"
            label={f.hours}
            placeholder={f.hoursPlaceholder}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput<VenueFormValues>
            name="phone"
            type="tel"
            dir="ltr"
            label={f.phone}
            placeholder={f.phonePlaceholder}
          />
          <TextInput<VenueFormValues>
            name="owner_name"
            label={f.owner}
            placeholder={f.ownerPlaceholder}
          />
        </div>
        <TextareaInput<VenueFormValues>
          name="facilities"
          label={f.facilities}
          optionalLabel={f.optional}
          placeholder={f.facilitiesPlaceholder}
        />
        <TextareaInput<VenueFormValues>
          name="description"
          label={f.description}
          optionalLabel={f.optional}
          placeholder={f.descriptionPlaceholder}
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-display text-body-xs font-medium text-content-primary">
            {f.format}
          </legend>
          <div className="flex flex-wrap gap-2 rounded-[10px] bg-surface-muted p-2">
            {MATCH_FORMATS.map((fmt) => (
              <button
                key={fmt}
                type="button"
                aria-pressed={format === fmt}
                onClick={() => form.setValue('format', fmt, { shouldDirty: true })}
                className={cn(
                  'h-[31px] rounded-[30px] border px-3 text-body-xs transition-colors',
                  format === fmt
                    ? 'border-brand-500 bg-brand-500 text-content-on-brand'
                    : 'border-line bg-surface-card text-content-primary hover:bg-surface-tint',
                )}
              >
                {fmt}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <span className="font-display text-body-xs font-medium text-content-primary">
            {f.gallery}
          </span>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((url) => (
              <div
                key={url}
                className="relative aspect-square overflow-hidden rounded-[8px] border border-line"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL */}
                <img src={url} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  aria-label={f.removePhoto}
                  onClick={() => setPhotos((prev) => prev.filter((p) => p !== url))}
                  className="absolute end-1 top-1 grid size-6 place-items-center rounded-full bg-surface-card/90 text-content-primary"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => galleryInput.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[8px] border border-dashed border-content-muted text-caption text-content-brand hover:bg-surface-tint"
            >
              {upload.isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ImagePlus className="size-5" />
              )}
              {upload.isPending ? f.uploading : f.addPhotos}
            </button>
          </div>
          <input
            ref={galleryInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onGallery}
          />
        </div>

        <Button type="submit" className="w-full" disabled={save.isPending || upload.isPending}>
          {save.isPending ? f.saving : f.save}
          <Check />
        </Button>
      </FormWrapper>
    </Modal>
  );
}
