/**
 * @/components/ui — Admin design-system primitives. Import from this barrel only.
 * Generic building blocks; nothing here knows about any domain noun.
 */

// Actions
export { Button, buttonVariants, type ButtonProps } from './button';
export { RowActions } from './row-actions';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './dropdown-menu';
export { ConfirmDialog } from './confirm-dialog';
export { DeleteDialog } from './delete-dialog';
export { FormDialog } from './form-dialog';
export { DownloadButton } from './download-button';

// Forms
export { Input, Textarea, fieldBox } from './input';
export { NativeSelect, type NativeSelectProps } from './native-select';
export { Checkbox } from './checkbox';
export { SearchInput } from './search-input';
export { FilterSelect, type FilterOption } from './filter-select';
export { DateFilter } from './date-filter';

// Display
export { Badge, badgeVariants, type BadgeProps, type BadgeTone } from './badge';
export { Card } from './card';
export { Avatar } from './avatar';
export { StatCard, type StatTone } from './stat-card';
export { InfoTile } from './info-tile';
export { StatusState } from './status-state';
export {
  DataTable,
  downloadTable,
  type DataTableColumn,
  type DataTableSelection,
} from './data-table';

// Layout
export { PageHeader, type Crumb } from './page-header';
export { TableCard } from './table-card';
export { FormCard } from './form-card';
export { SegmentedNav } from './segmented-nav';

// PlayMate admin (Figma "dart me" admin frames)
export { Panel, PanelTitle } from './panel';
export { StatStrip, type StripItem, type StripTone } from './stat-strip';
export { StatusPill, Chip, type PillTone } from './status-pill';
export { PillTabs, UnderlineTabs } from './pill-tabs';
export { Pager } from './pager';
export { FilterMenu, type FilterMenuOption } from './filter-menu';
export { SearchBox } from './search-box';
export { DateRangeMenu, type DateRange } from './date-range-menu';
export { EntityAvatar } from './entity-avatar';
export { InfoItem, InfoBox, InfoColumns, InfoDivider } from './info-list';
export { ActionMenu, ActionView, ActionEdit, ActionToggle, ActionDelete } from './action-menu';
export { Modal, AlertModal } from './modal';
export { ListTable, IdentityCell, type ListColumn } from './list-table';
export { VersusCard, StatRow, type VersusSide } from './versus-card';
export { SplitLayout, DetailHeader, SectionLabel, PanelState } from './split-layout';
export { StatusTag, type StatusKey as StatusTagKey } from './status-tag';
export { DesignIcon, type DesignIconName } from './design-icon';
