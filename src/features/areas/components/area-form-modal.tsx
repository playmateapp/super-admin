'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormWrapper, TextInput } from '@/components/form';
import { Button, Modal } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { getErrorMessage } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { useSaveArea } from '../hooks/mutations';
import { areasMessages } from '../i18n/areas.messages';
import type { Area } from '../types';
import {
  areaSchema,
  areaToForm,
  toAreaInput,
  type AreaFormValues,
} from '../validations/area.schema';

/** Add / Edit Area modal (same frame as Add Venue): name + optional display order. */
export function AreaFormModal({
  open,
  onOpenChange,
  area,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null` = add a new area. */
  area: Area | null;
}) {
  const m = useMessages(areasMessages);
  const c = useMessages(commonMessages);
  const save = useSaveArea();
  const form = useForm<AreaFormValues>({
    resolver: zodResolver(useMemo(() => areaSchema(m.errors), [m.errors])),
    defaultValues: areaToForm(null),
  });

  useEffect(() => {
    if (open) form.reset(areaToForm(area));
  }, [open, area, form]);

  const onSubmit = async (values: AreaFormValues) => {
    try {
      await save.mutateAsync({ id: area?.id ?? null, input: toAreaInput(values) });
      toast.success(area ? m.form.updated : m.form.created);
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
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={area ? f.editTitle : f.addTitle}>
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
          {area ? f.editTitle : f.addTitle}
        </h2>
      </div>
      <FormWrapper form={form} onSubmit={onSubmit} className="gap-4">
        <TextInput<AreaFormValues>
          name="name"
          label={f.name}
          placeholder={f.namePlaceholder}
          hint={area ? f.renameHint : undefined}
          autoFocus
        />
        <TextInput<AreaFormValues>
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
