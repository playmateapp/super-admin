# PlayMate admin — docs index

Living project docs. **Read the relevant file before starting a task; update it in the same
change as the code.** These files are how the next session (human or Claude) gets full context
without re-deriving it.

| File | What it holds | Update when |
| --- | --- | --- |
| [CHANGELOG.md](CHANGELOG.md) | Every change, newest first, grouped by date | Every task, no exceptions |
| [BUILD_PLAN.md](BUILD_PLAN.md) | Roadmap, task status, open TODOs, content/API to confirm | A task starts, finishes, or a TODO is found |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Project-specific architecture: routes, features, i18n, theming, data flow | A route, feature, provider or cross-cutting pattern is added/changed |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Tokens, type scale, components, how to change the look | A token, primitive or visual rule changes |
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | Project-specific coding rules on top of `CLAUDE.md` | A new convention is agreed |
| [DISCUSSIONS.md](DISCUSSIONS.md) | Decision log (ADR-style): what we chose and why | A non-obvious decision is made or reversed |

`CLAUDE.md` (repo root, mirrored in `AGENTS.md`) is the architecture contract. These docs
extend it for PlayMate; if they ever disagree, fix one of them in the same change.

## What this app is

The **super admin panel** of PlayMate — a football app where players find teams, team owners
pay a monthly subscription per team, and teams challenge each other to matches. Admins watch the
platform (dashboard, activity feed) and moderate it: block / unblock players and teams, cancel
matches, run the venue catalogue that players pick from in the app, and review subscriptions.

## Sources of truth outside the repo

- Figma: <https://www.figma.com/design/6K0Cw1jMEaTQlBO4fA3M1A/Moddhano_UBD-Updated?node-id=18438-8315>
  — page **"dart me"**, admin frames `18483:*` (Sign in + reset flow, Dashboard, All Users, Teams,
  Matches, Venues, Subscriptions, Notifications, Settings, Logout). The file's "Dashboard" page is
  the old Moddhanno design — not PlayMate.
- Backend: the **same Supabase project as the mobile app** (`uyvabgprakeefucsuqld`). Admin SQL
  lives in the app repo: `Team-Mate-App/supabase/migrations/20261103000014_admin_core.sql` and
  `…015_admin_rpcs.sql` (applied). Every admin RPC checks `public.admins`.
- Mobile app: `~/AndroidStudioProjects/Team-Mate-App` (Flutter). Its `docs/backend_plan.md`
  describes the shared schema.

## Accounts

- Default super admin: created directly in Supabase Auth (phone `+61 420 423 143`; the password
  was given by the owner and is not stored in any repo). Add more admins by inserting their
  `auth.users.id` into `public.admins` (an admin auth user needs
  `raw_app_meta_data.playmate_role = 'admin'` so no player profile is created).

## History

Started on 2026-11-03 from the Moddhanno admin codebase (same architecture). All Moddhanno
features, Supabase/SSLCommerz code, migrations and e2e scripts were removed (D-001). A full copy
of the old project is at `../PlayMateAdmin-moddhanno-backup-2026-11-03.tar.gz`.
