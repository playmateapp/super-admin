# Architecture (PlayMate admin)

`/CLAUDE.md` is the base contract (feature-first, thin routing, one-way dependencies). This
file records how it is applied here.

## Backend: shared Supabase project

The panel and the PlayMate mobile app use the **same Supabase project**, so admin actions are
what players see immediately ("synced"). The browser uses the publishable key; admin rights are
enforced in Postgres:

- `public.admins(user_id, full_name, role, activity_seen_at)` — who may use the panel.
- `require_admin()` — called first by every `admin_*` RPC (raises `42501` otherwise).
- Admin RPCs (`security definer`, `jsonb` out): `admin_me`, `admin_dashboard`, `admin_users`,
  `admin_user`, `admin_set_user_blocked`, `admin_teams`, `admin_team`, `admin_set_team_blocked`,
  `admin_matches`, `admin_match`, `admin_cancel_match`, `admin_venues`, `admin_venue`,
  `admin_save_venue`, `admin_set_venue_status`, `admin_subscriptions`, `admin_subscription`,
  `admin_activity`, `admin_mark_activity_seen`, `admin_areas`, `admin_save_area`,
  `admin_delete_area`; `admin_phone_exists` (anon, forgot password).
- SQL source: `Team-Mate-App/supabase/migrations/20261103000014_admin_core.sql`,
  `…015_admin_rpcs.sql`, `…017_subscription_free_offer.sql`, `…018_admin_areas.sql`.

### How admin actions reach the app

| Admin action | Effect in the mobile app |
| --- | --- |
| Block user | `profiles.blocked_at` + `auth.users.banned_until = infinity` + sessions deleted → signed out, can't log in (app shows "Your account has been blocked…"); hidden from `player_cards` |
| Block team | `teams.blocked_at` → hidden from other players (`team_cards`), challenges / kick-off rejected by trigger, managers get a push notification |
| Cancel match | `matches.phase = canceled` → existing match trigger notifies both teams |
| Add / edit venue | `venues.is_public` + `status = active` → appears in the app's challenge venue picker (RLS policy "published venues are readable") |
| Venue inactive | disappears from the picker |
| Add / rename / delete area | the app's profile area picker and venue fallback list update; a rename rewrites `venues.area` + `profiles.area`; an area used by venues can't be deleted |

Derived statuses (single source in SQL helpers `admin_*_status`): user blocked / new (< 7 days)
/ pending (no position or name) / active · team blocked / active (running subscription) /
inactive · match cancelled / complete / ongoing / ready_to_start (< 30 min) / upcoming ·
subscription blocked / active / expired.

## Routes

| Route group | Layout | Pages |
| --- | --- | --- |
| root | `app/layout.tsx` (fonts, `Providers`) | `/` → redirect `/dashboard` |
| `(auth)` | `<AuthShell>` (stadium photo + form card) | `/login`, `/forgot-password` |
| `(panel)` | `<AuthGuard><AdminShell topbarEnd={<NotificationBell/><AccountMenu/>} sidebarFooter={<LogoutButton/>}>` | `/dashboard`, `/users`, `/teams`, `/matches`, `/venues`, `/areas`, `/subscriptions`, `/notifications`, `/settings` |

Every `page.tsx` renders one screen from a feature barrel and sets `metadata.title`.

## Features

| Feature | Owns |
| --- | --- |
| `auth` | login, forgot-password (SMS code), settings (change password), `AccountMenu`, `LogoutButton`, session store, `useProfile` (`admin_me`) |
| `dashboard` | overview screen + SVG charts (donut, bars, area) |
| `users` | list, detail panel, block dialog |
| `teams` | list, detail panel, block dialog |
| `matches` | list (+ date range, location), detail panel with countdown + squads, cancel dialog |
| `venues` | list, detail panel, add / edit modal with uploads to storage `venue-photos` |
| `areas` | area list (`public.areas`) with venue / player counts, add / edit / delete modal |
| `subscriptions` | list, detail panel (read-only) |
| `notifications` | activity feed screen + `NotificationBell` |

Features never import each other. Each list screen = `StatStrip` → `SplitLayout(list Panel,
detail panel)`; the first row is selected by default; the detail panel fetches its own RPC.

## Shared layers

- `components/ui` — design-system primitives (see DESIGN_SYSTEM.md).
- `components/form` — RHF-bound inputs (`FormWrapper` now takes `onInvalid`).
- `components/layout` — `AdminShell` (breadcrumb from `admin-nav.ts`), `AdminSidebar`,
  `AuthShell`, `admin-nav.ts` (the only place sidebar routes are listed).
- `lib/api/supabase.ts` — the Supabase client + `rpc()` / `APIError`.
- `lib/auth/token-storage.ts` — Supabase session storage adapter (`playmate.admin.session`).
- `lib/hooks/use-list-state.ts` (search / filters / page / selection), `use-areas.ts`
  (`public.areas`), `lib/constants/match-formats.ts`, `lib/utils/phone.ts` (E.164).

## Data flow

```
types.ts → api/*.api.ts (rpc) → query-keys.ts → hooks/queries.ts | hooks/mutations.ts → screen
```

- Lists use `placeholderData: keepPreviousData`; filters live in `useListState`.
- Mutations invalidate their namespace (+ `dashboard` where totals change).
- Feed / bell refresh every 60 s; match detail every 60 s; dashboard every 2 min.

## Auth

- Sign in: `auth.signInWithPassword({ phone })` then `rpc('admin_me')`; non-admins are signed
  out again with the "Not an Admin Account" popup.
- Forgot password: `admin_phone_exists` → `auth.signInWithOtp({ shouldCreateUser: false })` →
  `auth.verifyOtp` → `auth.updateUser({ password })` → sign out → log in again.
- Change password re-checks the old password with `signInWithPassword` first.
- `AuthGuard` redirects guests to `/login?next=<path>`.

## i18n / theming

Unchanged from the starter: EN + BN (`*.messages.ts`, `bn: typeof en`), cookie `playmate-locale`,
`next-themes` `data-theme`. Activity-feed sentences are built in the panel from raw values so
they translate.
