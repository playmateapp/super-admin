# Build plan

Status: ✅ done · 🟡 in progress · ⬜ not started. Keep this current — move items, don't delete history.

Scope of this repo: the PlayMate **Super Admin** panel (Figma page "dart me", admin frames).

## Screens

| # | Module | Screen | Figma frame | Route | Status |
| - | --- | --- | --- | --- | --- |
| 0 | Setup | Reset from Moddhanno: skeleton, tokens, shell, primitives, docs | — | — | ✅ 2026-11-03 |
| 1 | Auth | Sign in + error popups | 18483:1430, 2664–2862 | `/login` | ✅ 2026-11-03 |
| 2 | Auth | Forgot password → SMS code → reset → success | 18483:1490–2414 | `/forgot-password` | ✅ 2026-11-03 |
| 3 | Dashboard | Totals, subscription donut, revenue, user growth, recents | 18483:1081 | `/dashboard` | ✅ 2026-11-03 |
| 4 | Users | List + filters, detail (overview / stats / photos / about), block | 18483:3014–5381 | `/users` | ✅ 2026-11-03 |
| 4b | Appeals | Unblock requests (players + teams): filter, approve, reject with reason | no design | `/appeals` | ✅ 2026-11-06, teams 2026-11-12 |
| 5 | Teams | List + filters, detail (overview / players / matches / about), block | 18483:5714–7487 | `/teams` | ✅ 2026-11-03 |
| 6 | Matches | List + 4 filters, detail (details / players), countdown, admin cancel | 18483:7849–9551 | `/matches` | ✅ 2026-11-03 |
| 7 | Venues | List + filters, detail (details / photos), add / edit modal, inactive | 18483:9939–10702 | `/venues` | ✅ 2026-11-03 |
| 7b | Areas | List with usage counts, add / edit (rename + order) / delete | no design | `/areas` | ✅ 2026-11-03 |
| 8 | Subscriptions | List + filters, detail (payment + team) | 18483:11491 | `/subscriptions` | ✅ 2026-11-03 |
| 9 | Notifications | Platform activity feed + top-bar bell | 18483:11348 | `/notifications` | ✅ 2026-11-03 |
| 10 | Settings | Change password | 18483:11465 | `/settings` | ✅ 2026-11-03 |
| 11 | Logout | Confirm dialog | 18483:11338 | sidebar | ✅ 2026-11-03 |

## Open TODOs

- [ ] Privacy policy: deploy the panel and put the public `/privacy-policy` URL in Play Console and
      the app's "Terms & Privacy" row. Update the "Deleting your account" section once the app has
      in-app account deletion.
- [ ] `profiles` RLS lets any signed-in user read every phone number and date of birth through the
      API. The policy only says the phone is not shown on the profile; close this gap (D-013).
- [ ] Re-initialise git (`git init`) — the folder is still not a repository.
- [ ] SMS reset codes go through the app's Twilio **trial** account: they only reach verified
      numbers until Twilio is upgraded (the default admin's +61 number may not receive codes).
- [ ] Payment gateway: PlayMate runs a **limited-time free subscription offer** (D-011) — every
      subscription is free (method `free`, ৳0). When bKash / Nagad / card are ready: connect the
      gateway, then `update app_config set value = 'false' where key = 'subscription_free_offer'`.
- [ ] Teams "Pending" tab / User "Pending" meaning: the design shows them, the backend has no
      approval step — "pending" users = profile not completed (no position / name). Confirm.
- [ ] Admin management screen (add / remove admins) — not in the design; done in SQL for now.
- [ ] Old Moddhanno primitives still in `components/ui` and unused (`DataTable`, `StatCard`,
      `PageHeader`, `FormCard`, `SegmentedNav` …) — delete once nothing needs them.

## Content / API to confirm

- Figma copy typos fixed in code (see DISCUSSIONS D-008): "Team Woner", "Active  Subscription",
  "Inter Your Mobile Number" kept as-is (placeholder), "Incorrect Login Credentials" message and
  "OTP Resent" message replaced, venue form labels "About You (Optional)" ×2.
- Verify code length: Figma shows 4 boxes; Supabase + Twilio Verify send 6 digits, so 6 boxes.
