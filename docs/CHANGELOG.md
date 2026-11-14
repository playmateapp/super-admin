# Changelog

Newest first. One entry per task: date, task, then Added / Changed / Fixed / Notes.

## 2026-11-14 — Notifications: date / read filters + read / unread

**Added**
- `/notifications` toolbar: Date filter (Any time, Today, Yesterday, Last 7 days, Custom date →
  from/to range picker) and Status filter (All, Unread, Read). Filtering is server-side.
- Per-row read / unread toggle (envelope button) and a green dot on unread rows.
- "Mark all as read" / "Mark all as unread" buttons with success/error toasts.
- "Showing X of Y" footer when more than 200 items match.
- App migration `20261114000031_admin_activity_read_state.sql` (applied): table
  `admin_activity_reads` (per-admin overrides keyed by kind + ref), `admin_activity(p_limit,
  p_from, p_to, p_status)` now returns `total` too, new RPCs `admin_set_activity_read` and
  `admin_mark_all_activity`.
- EN + BN copy for all of the above.

**Changed**
- Opening the page no longer marks everything as seen; the bell count only drops when the admin
  marks items read (D-019). `admin_mark_activity_seen()` kept as an alias of mark-all-read.
- `queryKeys.activity.feed(params)` now takes the filters.

## 2026-11-14 — Teams: owner / captain contacts on the detail panel

**Added**
- Teams detail → Over View: "Team Management" block with the owner and captain (avatar, name,
  phone). Each row links to `/users?user=<id>`, which opens that player's detail panel.
- Users screen reads `?user=<id>` on load (same pattern as `/teams?team=<id>`).
- EN + BN copy: `management`, `noCaptain`, `openUser`.

**Notes**
- No DB change: captain = first `players` entry with role `captain`; phone comes from
  `admin_user(id)` cached under `queryKeys.users.detail(id)`, so opening the user is instant.
- Found live DB is missing app migration `20261112000025_admin_team_appeal_flags.sql`
  (`admin_team.appeal`, `admin_teams.appeal_pending` / `stats.appeals`). Apply it so the team
  unblock-request card and "Appeal requested" filter work.

## 2026-11-14 — Users: new profile fields (gender, profile type, location)

**Added**
- Users list: second filter row — Gender, Profile Type, Division. Profile type and division
  options come from the database (`options` in the `admin_users` response).
- Users list: the name cell's sub line shows the profile type next to the ID.
- Users list: Location column ("Thana, District" over "Division · Post code"); search also
  matches location names (migration `20261114000030_admin_users_location_parts.sql`, applied —
  rows now carry `division`, `district`, `thana`).
- Users detail → Player Information: Division, District, Thana / Upazila and Post Code as
  separate rows, plus Gender, Profile Type, Date of Birth.
- EN + BN copy for the new labels and for gender / profile type values.

**Changed**
- `admin_users` now takes `p_gender`, `p_profile_type`, `p_division` (old 5-arg signature
  dropped) and returns `gender`, `profile_type`, `location`, `post_code` per row; search also
  matches post code. `admin_user` adds `division`, `district`, `thana`, `post_code`. App repo
  migration `20261114000029_admin_users_profile_fields.sql` (applied).

## 2026-11-14 — Dashboard v2 (PM feedback)

**Added**
- Welcome banner with the admin's name and a range picker (30 days / 3 / 6 / 12 months) that
  drives the revenue and growth charts.
- Six totals with "vs last 30 days" trends: Players, Teams, Turfs, Matches, Active
  Subscriptions, Revenue (trend hidden while the 30-days-ago value is 0).
- "User, Team & Turf Growth" 3-series line chart (cumulative per month); revenue card shows the
  range total.
- Player Status / Team Status (active vs blocked, with share bars).
- Players / Teams / Turfs by Division (top 3 divisions + Others; a team's division is its
  owner's; Others includes people/turfs with no division set).
- Recently Joined (4), Recent Matches (live → latest finished → next upcoming, score or "vs",
  status pill, Today/Tomorrow time), Pending Actions (turf requests pending + appealed, player
  appeals, team appeals) with links.

**Changed**
- `admin_dashboard()` → `admin_dashboard(p_months int default 6)` (app repo migration
  `20261114000028_admin_dashboard_v2.sql`): adds `stats.turfs`, `previous`, `growth`,
  `player_status`, `team_status`, `divisions`, `recent_matches`, `pending`. Old keys kept.
- `queryKeys.dashboard.overview(months)`. Recent Payments table removed from the dashboard
  (still under Subscriptions).

**Removed**
- `AreaChart` (replaced by `LineChart`).

## 2026-11-14 — Turfs: turf requests, venue = turf, areas retired

**Added**
- `/turf-requests` (sidebar "Turf Requests", after Venues): status tabs (Pending / Appealed /
  Approved / Rejected / All), search, stat strip, list + detail panel (photos, all form fields,
  applicant, the owner's appeal, the rejection reason). Approve publishes the request as a venue
  and notifies the owner; Reject needs a reason (the owner reads it in the app and can appeal
  once); Delete removes the request so the owner can apply again (an approved turf stays listed).
  `?request=<id>` opens one request (linked from the venue panel).
- `lib/hooks/use-locations.ts` (divisions / districts / thanas), `use-venue-names.ts`
  (`venue_cards`), `lib/constants/turf.ts` (owner roles, turf RPC error codes → messages).

**Changed**
- Venues = turfs. Add / Edit Venue has the app's Turf Listing Interest Form fields: turf name,
  owner name, role, contact number, Division / District / Thana, post code, full address,
  website, Facebook page, match format and turf images (at least one, required). Surface,
  opening hours, facilities and description are no longer edited (columns kept).
- Venues list filters: Division / District / Thana instead of Area; the detail panel shows the
  new fields and links to the source turf request.
- Matches: the "All Location" (area) filter is now "All Venues" (published venue names).
- Users detail "Location" shows Thana, District, Division, Post Code (`admin_user.area` now
  carries that label).

**Removed**
- The Areas module (`/areas`, `features/areas`, `use-areas.ts`) — the app no longer uses areas.

**Notes**
- Backend: app repo migration `20261114000027_turfs.sql` (`turf_requests`, `venue_cards`,
  `my_turf_request`, `submit_turf_request`, `appeal_turf_request`, `admin_turf_requests`,
  `admin_turf_request`, `admin_approve_turf_request`, `admin_reject_turf_request`,
  `admin_delete_turf_request`; new `admin_venues` signature with location filters; venues get
  location / role / website / facebook columns; players can no longer write venues; `areas` and
  the area RPCs dropped).

## 2026-11-14 — Locations (Division → District → Thana) with CSV bulk upload

**Added**
- `/locations` (sidebar "Locations", after Areas): tabs for Divisions / Districts / Thanas /
  Upazilas, search, division + district filters, stat strip (totals), per-row child and player
  counts, add / edit modal (districts pick a division; thanas pick a division, then a district),
  delete (refused while players use it: `location_in_use:<n>`).
- Bulk Upload modal: download a `Division,District,Thana` CSV template, choose a file, see the
  row count, upload. Missing rows are added (case-insensitive match), nothing is deleted; large
  files go up in 5000-row batches.
- `parseCsv()` in `lib/utils/csv.ts` (RFC 4180, BOM, CRLF).

**Notes**
- Backend: app repo migration `20261114000026_profile_type_location.sql` (applied 2026-11-14):
  `profile_types` (fixed: School / College / University Student, Job Holder), `divisions`,
  `districts`, `thanas` (seeded: 8 divisions, 64 districts, Dhaka district's 53 thanas),
  profile columns `gender`, `profile_type`, `division_id`, `district_id`, `thana_id`, `post_code`,
  and the admin RPCs `admin_locations`, `admin_save_location`, `admin_delete_location`,
  `admin_import_locations`. Post codes are typed by players, so they are not managed here.

## 2026-11-12 — Team unblock requests on the Teams screen

**Added**
- Teams list: "Appeal requested" pill under the status of a team whose owner is waiting for a
  review, an "Unblock requests" counter in the header strip and an "Appeal requested" status
  filter. Teams with an open request sort first.
- Team detail panel: "Unblock request" card (sender, date, message, status, rejection reason)
  with Approve / Reject in place and a link to all team requests.
- Appeals → Teams rows: "View team" opens `/teams?team=<id>` with that team selected;
  `/appeals?kind=team` opens the Teams tab.

**Notes**
- Backend: app repo migration `20261112000025_admin_team_appeal_flags.sql` (`admin_teams` adds
  `appeal_pending`, `stats.appeals`, `p_status = 'appeal'`; `admin_team` adds `appeal`). Until it
  is applied the badge, counter and card stay hidden (fields are optional).
- The Teams feature imports the review dialogs from the `@/features/appeals` barrel (D-015).

## 2026-11-12 — Team unblock requests

**Added**
- `/appeals` now has a Players / Teams switch. Teams lists requests from owners of blocked
  teams (team, owner, request, date, status) with the same Approve / Reject-with-reason flow.
  Approving unblocks the team; rejecting sends the reason to the owner in the app.
- `team_block_appeal` item in the activity feed / bell.

**Changed**
- Blocking / unblocking a user or a team also refreshes the appeals list (unblocking answers an
  open request). Repeating a team's current block state no longer re-notifies.

**Notes**
- Backend: app repo migration `20261112000023_team_block_appeals.sql` (`team_block_appeals`,
  `team_block_info`, `submit_team_block_appeal`, `admin_team_block_appeals`,
  `admin_review_team_block_appeal`, updated `admin_set_team_blocked` + `admin_activity`).
  The Teams tab needs it applied.

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
