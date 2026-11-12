# Discussions / decision log

ADR-style, newest last. Add an entry for any non-obvious decision or deviation from the design.

## D-001 — Reset the Moddhanno codebase into a blank starter (2026-11-03)
The user is starting a new admin panel (PlayMate) in this folder and asked to remove the old
code but keep the architecture. Kept: tooling, `lib/` plumbing (http, mock, query client, env,
i18n, errors, utils, hooks, validations), providers, shells, every generic `components/ui` and
`components/form` primitive, the auth feature, design tokens and the docs structure. Removed:
all domain features and routes, and the Supabase / SSLCommerz backend layer, which was
Moddhanno-specific — the data layer is back to the documented axios `http` + `mocked()` flow
(CLAUDE.md §5). The folder had no git repo, so a tarball backup was made one level up.

## D-002 — Bilingual EN + BN kept from the starter (2026-11-03)
`CLAUDE.md` requires English + Bangla; that rule was kept as-is. If PlayMate needs a different
second language, change `lib/i18n/config.ts` and every `bn` bundle in one change.

## D-003 — lucide icons only (2026-11-03)
Project rule carried over: `lucide-react` only; map any design icon set to the closest lucide one.

## D-004 — Supabase direct from the browser, admin RPCs, no REST layer (2026-11-03)
The admin panel must stay in sync with the mobile app, which runs on Supabase. Instead of a
separate API (or Next route handlers with the service-role key), the panel signs in to the
**same Supabase project** and calls `security definer` RPCs that start with `require_admin()`.
No secret key ships to the browser; one query per screen returns exactly the jsonb it needs. The
axios `http` + `mocked()` layer was removed. Trade-off: business rules live in SQL (app repo
migrations 014/015).

## D-005 — Admins have no player profile (2026-11-03)
`handle_new_user` skips auth users with `raw_app_meta_data.playmate_role = 'admin'`, so the
admin never appears in player lists or stats. The default admin was inserted straight into
`auth.users` + `auth.identities` (phone provider, bcrypt password) — the password lives only in
Supabase.

## D-006 — What "block" means (2026-11-03)
User: auth ban (`banned_until = infinity`) + sessions deleted + `profiles.blocked_at` (hidden from
`player_cards`). Team: `teams.blocked_at`, hidden from other players in `team_cards` (members
still see it, with `is_blocked`), and a trigger rejects new / accepted challenges and kick-off.
Blocking asks for confirmation in the panel (it isn't in the design); unblocking doesn't.

## D-007 — Venue catalogue on the existing `venues` table (2026-11-03)
The app's `venues` were a player's private list of ground names. The admin design needs a full
catalogue, so the table gained detail columns + `is_public` + `status` and `owner_id` became
nullable (admin venues). Admin-saved venues are public; RLS lets every player read public active
ones and the app's challenge picker now lists them after the player's own. The Figma Add Venue
form has no area / location / owner / gallery fields although the detail panel shows them — they
were added to the form. Its two "About You (Optional)" labels became "Facilities" and
"Description".

## D-008 — Copy fixes vs. Figma (2026-11-03)
Kept Figma copy except clear slips: "Incorrect Login Credentials" body ("Password is required.")
→ "The mobile number or password is incorrect."; "OTP Resent Successfully" body ("Mobile number
verified successfully.") → "A new code was sent to your number."; "Team Woner" → "Team Owner";
"Active  Subscription" → single space. "Inter Your Mobile Number" placeholder kept verbatim
(flag to design). Verify screen shows 6 boxes (Twilio Verify sends 6 digits; Figma shows 4).

## D-009 — Admin "Notifications" is a derived activity feed (2026-11-03)
`public.notifications` is per player. The admin page shows platform events derived from the
tables (`admin_activity`), with the sentence written client-side so it translates; the bell counts
items newer than `admins.activity_seen_at`, reset when the page opens.

## D-010 — Theme toggle + language switch kept in the top bar (2026-11-03)
The Figma top bar only has the bell and avatar. Project rules require light/dark + EN/BN, so the
switches sit before the bell (moved into the drawer below `sm`).

## D-011 — Limited-time free subscription offer (2026-11-03)
PlayMate is free for now, but the owner wants players to keep the subscription step ("take a
subscription, no payment, see that it's a limited-time offer"). Supabase `app_config.
subscription_free_offer = true` (app repo migration 017) makes `start_payment` record a ৳0
payment with method `free` and activate the month instantly; team creation still needs a
subscription. The app shows a "Limited-time offer" card instead of the payment methods. The
panel keeps Subscriptions visible and labels these as "Free offer" (detail, recent payments,
activity feed). Ending the offer = connect the gateway, then set the flag to `false`.
(Migration 016, a short-lived "skip subscriptions entirely" switch, was superseded by 017.)

## D-012 — Blocked players stay signed in, read-only (2026-11-06)
The auth ban (+ deleting sessions) signed players out with no way to learn why or appeal, and did
not actually stop them: an access token stays valid after its session is deleted, so a blocked
player could keep creating teams for up to an hour. `profiles.blocked_at` is now the only switch.
Trigger `guard_blocked_actor` rejects writes on every player table, so it holds for any client and
takes effect instantly. Blocked players stay hidden from others, get a notification and push, and
appeal from the app. Approving unblocks; rejecting needs a reason, which the player sees and may
appeal again. Unblocking from Users also closes an open request.

## D-013 — Privacy policy lives in the panel, as a public route (2026-11-07)
Play Console needs a public privacy policy URL and the panel is the only web app PlayMate has, so
`/privacy-policy` sits in a `(public)` group outside `AuthGuard`. Root metadata is noindex, so the
page sets `robots` itself. Copy was written from the app's schema and permissions, so it must change
when the data does. It only says the phone number is "not shown on your player profile" because
`profiles` RLS (`using (true)`) still lets any signed-in user read phone and date of birth by API.
Account deletion is by email until the app has an in-app option; 30 days is the stated limit.

## D-014 — Team unblock requests share the Appeals screen (2026-11-12)
A blocked team's members see the block on the team page in the app, but only the owner can send
a request (one open at a time, like player appeals). Requests live in their own table
(`team_block_appeals`) and RPCs, and the panel shows them under a Players / Teams switch on
`/appeals` rather than a new page, since the review flow is identical. The API maps both RPCs into
one `Appeal` row so the table and dialogs stay shared.

## D-015 — Teams reuses the Appeals review dialogs through the barrel (2026-11-12)
The admin asked to see and answer a team's unblock request from the team itself. Rather than copy
the approve / reject dialogs and mutation into `teams`, the `appeals` barrel exports
`ApproveAppealDialog` / `RejectAppealDialog` and the Teams detail panel maps `admin_team().appeal`
into an `Appeal`. One review flow, one cache invalidation; a narrow, documented exception to the
"barrel imports only for session concerns" rule.

