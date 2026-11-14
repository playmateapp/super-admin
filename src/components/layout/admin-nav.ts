import {
  Bell,
  CalendarDays,
  House,
  Map as MapIcon,
  MapPin,
  MapPinned,
  Settings,
  ShieldAlert,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';

import type { NavLabelKey } from './layout.messages';
import { SubscriptionNavIcon } from './nav-icons';

/**
 * Sidebar navigation of the admin panel, in Figma sidebar order ("Frame 26080876").
 * Add a route here — never inside the sidebar component. `labelKey` points into
 * `layoutMessages.nav`; `crumbKey` (optional) is the breadcrumb wording when it differs
 * ("Users" in the sidebar, "All Users" in the breadcrumb).
 */
export type NavIcon = LucideIcon | ComponentType<{ className?: string; strokeWidth?: number }>;

export interface AdminNavLink {
  key: string;
  labelKey: NavLabelKey;
  crumbKey?: NavLabelKey;
  href: string;
  icon: NavIcon;
}

export const adminNav: AdminNavLink[] = [
  { key: 'dashboard', labelKey: 'dashboard', icon: House, href: '/dashboard' },
  { key: 'users', labelKey: 'users', crumbKey: 'allUsers', icon: User, href: '/users' },
  { key: 'appeals', labelKey: 'appeals', icon: ShieldAlert, href: '/appeals' },
  { key: 'teams', labelKey: 'teams', icon: Users, href: '/teams' },
  { key: 'matches', labelKey: 'matches', icon: CalendarDays, href: '/matches' },
  { key: 'venues', labelKey: 'venues', icon: MapPin, href: '/venues' },
  { key: 'turfRequests', labelKey: 'turfRequests', icon: MapIcon, href: '/turf-requests' },
  { key: 'locations', labelKey: 'locations', icon: MapPinned, href: '/locations' },
  {
    key: 'subscriptions',
    labelKey: 'subscriptions',
    icon: SubscriptionNavIcon,
    href: '/subscriptions',
  },
  {
    key: 'notifications',
    labelKey: 'notifications',
    crumbKey: 'notification',
    icon: Bell,
    href: '/notifications',
  },
  { key: 'settings', labelKey: 'settings', icon: Settings, href: '/settings' },
];

/** A link is active on its own page and on any page below it (`/items/new`). */
export const isNavActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

/** The nav entry the current page belongs to (breadcrumb). */
export const activeNavLink = (pathname: string) =>
  adminNav.find((item) => isNavActive(pathname, item.href));
