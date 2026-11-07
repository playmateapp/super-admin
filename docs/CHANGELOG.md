# Changelog

Newest first. One entry per task: date, task, then Added / Changed / Fixed / Notes.

## 2026-11-07 — Public privacy policy

**Added**
- `/privacy-policy` (feature `legal`, route group `(public)`): the PlayMate app's privacy policy in
  EN + BN, open with no sign-in and indexable, for the Play Console privacy policy URL.

**Notes**
- Contact: `support.playmate@gmail.com`. Keep the copy in step with what the app collects (D-013).

## 2026-11-06 — Unblock requests (Appeals)

**Added**
- `/appeals` (feature `appeals`): list of unblock requests with status tabs, approve, reject with
  a required reason. Sidebar entry and a `block_appeal` item in the activity feed / bell.

**Changed**
- Blocking no longer bans the auth user or signs them out: the player stays signed in, read-only,
  is notified and can appeal (D-012). Block dialog copy updated.

**Notes**
- Backend: app repo migration `20261106000019_block_appeals.sql`. The screen needs it applied.

## 2026-11-03 — Areas module

**Added**
- `/areas` (sidebar after Venues): every area with how many venues / players use it, search,
  "+ Add Area" modal (name + optional display order), Edit, Delete with confirmation.
- `ActionDelete` menu item primitive; `queryKeys.areas`.
- Backend (app repo migration 018): `admin_areas`, `admin_save_area` (case-insensitive unique,
  rename carries to venues + player profiles), `admin_delete_area` (blocked while venues use it).

**Notes**
- No Figma frame; built from the Venues screen pattern. New areas appear in the venue form, all
  area filters and the app's area pickers straight away.

## 2026-11-03 — Limited-time free subscription offer

**Changed**
- Subscriptions stay visible. Free ones (payment method `free`, ৳0) show as "Free offer" in the
  subscription detail, "Free" in Recent Payments and get their own activity-feed sentence.

**Notes**
- Backend: app repo migration 017 (`subscription_free_offer`), see D-011. Revenue stays ৳0 while
  the offer runs.

## 2026-11-03 — Super admin panel (all Figma admin screens) on the app's Supabase

**Added**
- Screens: sign in, forgot password (SMS code) + reset, dashboard, users, teams, matches, venues
  (add / edit / inactive, photo uploads), subscriptions, notifications feed, settings (change
  password), logout dialog — EN + BN, light + dark, 360px → 1600px.
- Primitives: `Panel`, `StatStrip`, `StatusPill`/`StatusTag`/`Chip`, `PillTabs`/`UnderlineTabs`,
  `Pager`, `FilterMenu`, `SearchBox`, `DateRangeMenu`, `EntityAvatar`, `InfoItem`/`InfoBox`,
  `ActionMenu` (+ View / Edit / Toggle), `Modal`/`AlertModal`, `ListTable`, `VersusCard`/`StatRow`,
  `SplitLayout`/`DetailHeader`/`PanelState`, `DesignIcon`.
- `lib/api/supabase.ts` (`rpc`, `APIError`), `use-list-state`, `use-areas`, phone + date helpers.
- Figma assets: logo marks, sign-in photo, coloured icons (`public/brand`, `public/icons`).
- Backend (app repo migrations 014/015): `admins`, block flags + triggers, venue catalogue,
  `venue-photos` bucket, 20 admin RPCs. Default super admin created.

**Changed**
- Tokens retuned to the PlayMate Figma variables (green #14653C, Outfit + Inter, 16px cards).
- Auth: phone + password via Supabase; session stored through `token-storage`.
- `Button` variants (primary / outline-brand / outline / muted / ghost / danger), inputs 44px.

**Removed**
- axios, `lib/api/http.ts`, `lib/api/mock.ts`, `StatusBadge`, page search, placeholder favicon.

**Notes**
- Mobile app changes: challenge venue picker includes published venues; banned users see a
  "blocked" message.

## 2026-11-03 — Reset to a blank PlayMate admin starter

**Removed**
- Every Moddhanno feature (companies, sbus, users, menus, platters, orders, payments, wallets,
  payouts, kitchen, company-bills, settings, items, vouchers) and their routes.
- Supabase (`lib/supabase`, `app/api/*` route handlers, `lib/api/admin-route.ts`,
  `lib/config/server-env.ts`, `RealtimeSync`, `supabase/` migrations + seed, `.mcp.json`,
  `.codex/config.toml`, `@supabase/supabase-js`, `server-only`).
- SSLCommerz (`lib/payments`), `lib/constants/locations.ts`, `formatTaka`, e2e scripts,
  `claude-kit/`, `_backup/`, `docs/manual`, `docs/TESTING_GUIDE.md`, Moddhanno logo.

**Changed**
- Auth now uses the shared axios `http` + `mocked()` (mocks on by default), session flag read
  from `tokenStorage`.
- Branding / storage keys: `playmate-theme`, `playmate-locale`, `playmate.admin.*`; package name
  `playmate-admin`; metadata title "PlayMate Admin".
- `query-keys.ts`, `admin-nav.ts`, `layout.messages.ts` reduced to auth + dashboard.
- `add-module` skill points at `features/auth` as the starting reference.
- Docs reset to a fresh-project baseline.

**Added**
- Placeholder `dashboard` feature (`/dashboard`, empty state).

**Notes**
- Full backup of the previous project: `../PlayMateAdmin-moddhanno-backup-2026-11-03.tar.gz`.
