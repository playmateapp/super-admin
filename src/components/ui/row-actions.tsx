'use client';

import { Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { commonMessages } from '@/lib/i18n';
import { useMessages } from '@/providers/i18n-provider';

import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

/**
 * RowActions — the "⋮" button at the end of a table row. Shows "View" / "Edit" when the row
 * has those pages and "Delete" when the screen passes a delete handler (`deleteLabel` renames
 * it, e.g. "Remove from company").
 */
export function RowActions({
  viewHref,
  editHref,
  onDelete,
  deleteLabel,
}: {
  viewHref?: string;
  editHref?: string;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  const m = useMessages(commonMessages);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={m.rowActions}>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {viewHref ? (
          <DropdownMenuItem asChild>
            <Link href={viewHref}>
              <Eye />
              {m.view}
            </Link>
          </DropdownMenuItem>
        ) : null}
        {editHref ? (
          <DropdownMenuItem asChild>
            <Link href={editHref}>
              <Pencil />
              {m.edit}
            </Link>
          </DropdownMenuItem>
        ) : null}
        {onDelete ? (
          <DropdownMenuItem tone="danger" onSelect={onDelete}>
            <Trash2 />
            {deleteLabel ?? m.delete}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
