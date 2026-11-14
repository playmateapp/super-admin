'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, ImagePlus, Loader2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormWrapper, SelectInput, TextInput } from '@/components/form';
import { Button, Modal } from '@/components/ui';
import { MATCH_FORMATS } from '@/lib/constants/match-formats';
import { TURF_ROLES, turfErrorMessage } from '@/lib/constants/turf';
import { useDistricts, useDivisions, useThanas } from '@/lib/hooks/use-locations';
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
 * Add / Edit Venue (Figma "All Venues || Add Venue" / "Edit venues" layout) with the fields of
 * the app's Turf Listing Interest Form, so admin venues and approved turf requests hold the same
 * data: cover + turf images (at least one), turf name, owner name, role, contact number,
 * Division / District / Thana, post code, full address, website, Facebook page and the
 * match-format chips — see docs/DISCUSSIONS.md D-017.
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

  const [photoError, setPhotoError] = useState(false);
  const divisionId = form.watch('division_id');
  const districtId = form.watch('district_id');
  const { data: divisions } = useDivisions();
  const { data: districts } = useDistricts(divisionId ? Number(divisionId) : null);
  const { data: thanas } = useThanas(districtId ? Number(districtId) : null);
  // Last location the form showed: a different division / district clears the levels below.
  const shown = useRef({ division: '', district: '' });

  // Load the venue (or a blank form) each time the modal opens.
  useEffect(() => {
    if (!open) return;
    const values = venue ? venueToForm(venue) : emptyVenueForm;
    shown.current = { division: values.division_id, district: values.district_id };
    form.reset(values);
    setCover(venue?.photo_url ?? '');
    setPhotos(venue?.photos ?? []);
    setPhotoError(false);
  }, [open, venue, form]);

  useEffect(() => {
    if (divisionId === shown.current.division) return;
    shown.current = { division: divisionId, district: '' };
    form.setValue('district_id', '');
    form.setValue('thana_id', '');
  }, [divisionId, form]);

  useEffect(() => {
    if (districtId === shown.current.district) return;
    shown.current = { ...shown.current, district: districtId };
    form.setValue('thana_id', '');
  }, [districtId, form]);

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
    if (url) {
      setCover(url);
      setPhotoError(false);
    }
    e.target.value = '';
  };

  const onGallery = async (e: ChangeEvent<HTMLInputElement>) => {
    const urls = await uploadFiles(e.target.files);
    setPhotos((prev) => [...prev, ...urls]);
    if (urls.length) setPhotoError(false);
    e.target.value = '';
  };

  const onSubmit = async (values: VenueFormValues) => {
    if (!cover && photos.length === 0) {
      setPhotoError(true);
      return;
    }
    try {
      const id = await save.mutateAsync({
        id: venue?.id ?? null,
        input: toVenueInput(values, cover || photos[0] || '', photos),
      });
      toast.success(venue ? m.form.updated : m.form.created);
      onSaved?.(id);
      onOpenChange(false);
    } catch (err) {
      toast.error(turfErrorMessage(getErrorMessage(err, ''), m.serverErrors, c.saveFailed));
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

        <TextInput<VenueFormValues>
          name="name"
          required
          label={f.name}
          placeholder={f.namePlaceholder}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput<VenueFormValues>
            name="owner_name"
            required
            label={f.owner}
            placeholder={f.ownerPlaceholder}
          />
          <SelectInput<VenueFormValues>
            name="owner_role"
            label={f.role}
            optionalLabel={f.optional}
            placeholder={f.rolePlaceholder}
          >
            {TURF_ROLES.map((r) => (
              <option key={r} value={r}>
                {m.roles[r]}
              </option>
            ))}
          </SelectInput>
        </div>
        <TextInput<VenueFormValues>
          name="phone"
          type="tel"
          dir="ltr"
          required
          label={f.phone}
          placeholder={f.phonePlaceholder}
        />

        <p className="font-display text-body-sm font-semibold text-content-primary">
          {f.locationTitle}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectInput<VenueFormValues>
            name="division_id"
            required
            label={f.division}
            placeholder={f.divisionPlaceholder}
          >
            {(divisions ?? []).map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name}
              </option>
            ))}
          </SelectInput>
          <SelectInput<VenueFormValues>
            name="district_id"
            required
            label={f.district}
            placeholder={f.districtPlaceholder}
            disabled={!divisionId}
          >
            {(districts ?? []).map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.name}
              </option>
            ))}
          </SelectInput>
          <SelectInput<VenueFormValues>
            name="thana_id"
            required
            label={f.thana}
            placeholder={f.thanaPlaceholder}
            disabled={!districtId}
          >
            {(thanas ?? []).map((t) => (
              <option key={t.id} value={String(t.id)}>
                {t.name}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
          <TextInput<VenueFormValues>
            name="post_code"
            required
            label={f.postCode}
            placeholder={f.postCodePlaceholder}
          />
          <TextInput<VenueFormValues>
            name="address"
            required
            label={f.address}
            placeholder={f.addressPlaceholder}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput<VenueFormValues>
            name="website"
            type="url"
            dir="ltr"
            label={f.website}
            optionalLabel={f.optional}
            placeholder={f.websitePlaceholder}
          />
          <TextInput<VenueFormValues>
            name="facebook"
            type="url"
            dir="ltr"
            label={f.facebook}
            optionalLabel={f.optional}
            placeholder={f.facebookPlaceholder}
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-display text-body-xs font-medium text-content-primary">
            {f.format} <span className="text-danger">*</span>
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
            {f.gallery} <span className="text-danger">*</span>
          </span>
          <span className="text-caption text-content-muted">{f.galleryHint}</span>
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
          {photoError ? (
            <p role="alert" className="text-body-xs text-danger">
              {f.photoRequired}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={save.isPending || upload.isPending}>
          {save.isPending ? f.saving : f.save}
          <Check />
        </Button>
      </FormWrapper>
    </Modal>
  );
}
