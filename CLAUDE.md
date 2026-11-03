# Project Architecture

> Claude: read this file before writing any code. It is the source of truth for
> structure, conventions and boundaries. When adding a new feature/module, use the
> `add-module` skill (`.claude/skills/add-module/SKILL.md`).

## 0. Project docs — MANDATORY (PlayMate admin)

`docs/` is the project memory. Every task follows this loop:

1. **Before coding** read `docs/README.md`, then `docs/BUILD_PLAN.md` (status + open TODOs) and
   whichever of `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `CODING_STANDARDS.md`, `DISCUSSIONS.md`
   touch the task. Design source: the Figma file listed in `docs/README.md` (Dashboard page → Admin section).
2. **While coding** follow `docs/CODING_STANDARDS.md` (tokens only, logical RTL classes,
   feature-owned `*.messages.ts` with `en` + `bn`, no string literals in components).
3. **Before calling a task done**, in the same change:
   - `docs/CHANGELOG.md` — add an entry (date, task, Added / Changed / Fixed / Notes). Always.
   - `docs/BUILD_PLAN.md` — update status, add/close TODOs and placeholders to confirm.
   - `docs/ARCHITECTURE.md` — if routes, features, providers or patterns changed.
   - `docs/DESIGN_SYSTEM.md` — if a token, primitive or visual rule changed.
   - `docs/DISCUSSIONS.md` — new entry for any non-obvious decision or design deviation.
   - `docs/CODING_STANDARDS.md` — if a new convention was agreed.
4. Quality gates (§9) + `npm run build` pass, and the UI was checked in EN/BN × light/dark at
   1440px and 360px.

Every UI must support **light + dark** (CSS-variable tokens) and **English + Bangla**. Keep
logical direction classes (`ms-/me-/ps-/pe-/start-/end-`) so an RTL locale can be added later.
Design tokens live only in `src/app/globals.css`; change them there and everything follows.

## 1. Stack (locked)

| Concern            | Choice                                                       |
| ------------------ | ------------------------------------------------------------ |
| Framework          | Next.js 14 (App Router), React 18, TypeScript (`strict`)     |
| Styling            | Tailwind CSS 3 + CSS variables, `tailwindcss-animate`        |
| UI primitives      | shadcn/ui (style `new-york`, Radix under the hood), lucide-react icons |
| Server state       | `@tanstack/react-query` v5                                   |
| Client/UI state    | `zustand`                                                    |
| Backend            | Supabase (`@supabase/supabase-js`): one client in `lib/api/supabase.ts`, admin RPCs via `rpc()` |
| Forms / validation | `react-hook-form` + `zod` + `@hookform/resolvers`            |
| Toasts             | `sonner`                                                     |
| Dates              | `date-fns`                                                   |
| Animation          | `framer-motion`                                              |
| Theme              | `next-themes` (`data-theme` on `<html>`, key `playmate-theme`)  |
| i18n               | cookie `playmate-locale` + `@/lib/i18n` + `useMessages` (EN / BN) |
| Tooling            | ESLint (`next/core-web-vitals`, `@tanstack/query`, `prettier`), Prettier, Husky + lint-staged |

Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `format`, `format:check`.

## 2. Guiding principles

1. **Feature-first.** Code that changes together lives together. A feature owns its
   api, hooks, components, screens, store, types, validations.
2. **Thin routing.** `src/app/**` only wires routes. A `page.tsx` imports one
   `*Screen` from a feature barrel and renders it. No logic, no fetching.
3. **One-way dependencies:** `app → features → components / lib`.
   - Features **never** import other features' internals. If two features need the
     same thing, move it to `components/` or `lib/` (if generic) — or, inside a
     large feature, to its `shared/` sub-module.
   - Importing another feature's **barrel** (`@/features/auth`) is allowed only for
     cross-cutting session concerns (auth flags, profile, billing gate). Keep it rare.
   - `components/` and `lib/` never import from `features/`
     (exception: `components/shared/*` guards/providers that read auth state).
4. **One public entry per feature.** Everything outside a feature imports it
   via `@/features/<name>` (its `index.ts`). Never deep-import
   `@/features/<name>/components/...` from outside.
5. **Shared means generic.** If it knows about a domain noun (jobs, coupons, CVs), it
   belongs to a feature, not `components/`.
6. **The one state rule.**
   - Server data → TanStack Query (never copy fetched data into Zustand).
   - Client/UI state (modal open, wizard step, draft, flags) → Zustand.
   - Local component state → `useState`.

## 3. Folder structure

```text
src/
├── app/                              # ROUTING ONLY
│   ├── layout.tsx                    # <html>, fonts, QueryProvider > ToastProvider > Providers
│   ├── globals.css                   # Tailwind layers + CSS variable tokens
│   ├── error.tsx / global-error.tsx / not-found.tsx
│   ├── page.tsx                      # `/` → redirect to /dashboard
│   ├── (auth)/                       # /login → layout = <AuthShell>
│   └── (panel)/                      # the whole panel → layout = <AuthGuard><AdminShell>
│
├── features/                         # DOMAIN CODE — one folder per feature
│   └── <feature>/
│       ├── index.ts                  # public barrel (the ONLY import path)
│       ├── types.ts                  # API request/response + domain types
│       ├── constants.ts              # (opt) enums, option lists, labels
│       ├── api/<name>.api.ts         # pure request functions (axios → data)
│       ├── hooks/queries.ts          # useQuery hooks
│       ├── hooks/mutations.ts        # useMutation hooks (+ invalidation)
│       ├── hooks/use-<thing>.ts      # (opt) other feature hooks
│       ├── components/               # feature widgets + components/index.ts barrel
│       ├── screen/<name>.screen.tsx  # route-level screens (one per page)
│       ├── validations/<name>.schema.ts  # zod schemas + inferred form types
│       ├── store/<name>.store.ts     # (opt) zustand UI store + selectors
│       └── data/                     # (opt) view-model mappers, static data, formatters
│
│   └── <large-feature>/              # EXCEPTION: domain sub-features
│       ├── index.ts                  # export * from './sub-a'; export * from './shared'; ...
│       ├── shared/                   # code shared between sub-features
│       ├── sub-a/ (same shape as a feature, own index.ts)
│       └── sub-b/
│
├── components/
│   ├── ui/                           # primitives + index.ts barrel (Button, Card, DataTable, PageHeader, FormCard, StatusState...)
│   ├── form/                         # RHF-bound inputs: FormWrapper, FormGrid, TextInput, SelectInput, TextareaInput, ImageDropInput
│   ├── layout/                       # AdminShell, AuthShell, sidebar, nav config (admin-nav.ts)
│   └── shared/                       # app-wide: AuthGuard, BrandLogo, ThemeToggle, LocaleSwitch
│
├── lib/
│   ├── api/supabase.ts               # the one Supabase client + rpc() helper (APIError)
│   ├── api/query-client.ts           # makeQueryClient() defaults
│   ├── auth/token-storage.ts         # the ONLY place tokens are read/written
│   ├── config/env.ts                 # zod-validated env (no raw process.env elsewhere)
│   ├── config/query-keys.ts          # central query-key factory
│   ├── hooks/                        # generic hooks (debounce, is-hydrated, row selection)
│   ├── i18n/                         # locales, defineMessages, commonMessages
│   ├── constants/                    # shared option lists (locations)
│   ├── utils/                        # cn(), errors, formatters, CSV export
│   └── validations/                  # generic zod pieces (fields.ts)
│
├── providers/                        # Query, Theme, I18n, Toast providers
└── types/                            # shared API envelope types (api.ts)
```

Small features stay **flat** (shape above). Split into sub-features only when a
feature clearly has several distinct areas (e.g. dashboard + job-management + company).

## 4. Path aliases (`tsconfig.json`)

```jsonc
"paths": {
  "@/*":            ["./src/*"],
  "@/app/*":        ["./src/app/*"],
  "@/features/*":   ["./src/features/*"],
  "@/components/*": ["./src/components/*"],
  "@/lib/*":        ["./src/lib/*"],
  "@/providers/*":  ["./src/providers/*"],
  "@/assets":       ["./src/assets"],
  "@/assets/*":     ["./src/assets/*"],
  "@/types/*":      ["./src/types/*"]
}
```

Inside a feature use **relative** imports (`../api/x.api`); across layers use aliases.

## 5. Data layer (the flow)

```
types.ts  →  api/*.api.ts  →  query-keys.ts  →  hooks/queries.ts | hooks/mutations.ts  →  screen / component
```

- **`api/*.api.ts`** — plain functions, no React. One function per Postgres RPC (or storage
  call), JSDoc naming the RPC, fully typed generics. `rpc()` throws `APIError` on failure.
  ```ts
  /** rpc admin_user — one player with stats. */
  export const getUser = (id: string) => rpc<UserDetail>('admin_user', { p_id: id });
  ```
- **`lib/config/query-keys.ts`** — every key is built here, per feature namespace:
  ```ts
  items: {
    all: () => ['items'] as const,
    list: (params: object = {}) => ['items', 'list', params] as const,
    detail: (id: string) => ['items', 'detail', id] as const,
  },
  ```
  `all()` must be a prefix of every other key in the namespace so one invalidation hits them all.
- **Queries** — `'use client'`, `useQuery({ queryKey, queryFn, enabled })`. Use
  `enabled: !!id` for id-dependent queries, `placeholderData: keepPreviousData` for paginated lists.
- **Mutations** — `useMutation` + `useQueryClient().invalidateQueries({ queryKey: queryKeys.x.all() })`
  in `onSuccess`. If the backend returns `{ success: false, message }` with HTTP 200,
  throw `new Error(message)` inside `mutationFn` so callers only use `onError`/`onSuccess`.
- **QueryClient defaults** — `staleTime: 60s`, `gcTime: 5m`, `retry: 1`,
  `refetchOnWindowFocus: false`, mutations `retry: 0`.
- **Errors** — show with `parseAPIError(err)` / `getErrorMessage(err, fallback)` from `@/lib/utils`.
  Never hand-parse axios errors in components.

## 6. Auth & access

- The session is read/written only via `lib/auth/token-storage.ts` (Supabase Auth uses its
  `supabaseStorage` adapter; the app asks `tokenStorage.hasSession()` / `clear()`).
- Supabase refreshes the session itself; a sign-out (expired / revoked) flips the auth store.
- Admin rights live in the database (`public.admins` + `require_admin()` in every admin RPC).
- Session flags (`isAuthenticated`, `isInitialized`) live in the auth feature's zustand store.
  The user object comes from the `useProfile` query, not the store.
- Route protection is done **once per route group** in `(panel)/layout.tsx` (`<AuthGuard>`),
  never per page.

## 7. UI conventions

- Use primitives from `@/components/ui` (barrel import) — do not re-create buttons, cards,
  dialogs, tables. Add new shadcn primitives into `components/ui` and export from its `index.ts`.
- Forms: `useForm({ resolver: zodResolver(schema), defaultValues })` + `<FormWrapper form onSubmit>`
  + `@/components/form` inputs (`TextInput name="..." label="..." required`). Every field
  has a default value (use `''` for optional strings).
- Loading / empty / error: use `<StatusState variant="loading|empty|error" ... />`.
- Class merging: `cn()` from `@/lib/utils`.
- Colors/typography: only design tokens from `tailwind.config.ts`
  (`bg-surface-*`, `text-content-primary|secondary|muted`, `brand-*`, `border-line`,
  `text-heading-*`, `text-body-*`). No raw hex, no arbitrary colors.
- Icons: `lucide-react` only.
- Navigation items live in `components/layout/*-nav.ts` config arrays — add a route there,
  not inside the sidebar component.
- Mobile first; every screen must work at 360px width.

## 8. Code style

- Prettier: `singleQuote`, `semi`, `trailingComma: all`, `printWidth: 100`, `tabWidth: 2`.
- File names: `kebab-case`. Suffixes: `*.api.ts`, `*.screen.tsx`, `*.schema.ts`, `*.store.ts`,
  `*.mapper.ts`. Components are `PascalCase` named exports (no default exports except
  Next route files).
- `'use client'` on every file using hooks/state/browser APIs. Route files stay server
  components unless they need otherwise.
- No `any`. API field names stay `snake_case` as the backend sends them; view models in
  `data/` may map to `camelCase`.
- Every file that is not obvious starts with a short JSDoc block explaining *why* it
  exists (endpoints it covers, what state it holds, what it must not hold).
- Barrels group exports under comments: `// Screens`, `// Components`,
  `// API request functions`, `// Hooks`, `// Store`, `// Validations`, `// Types`.
- Env vars only via `env` from `@/lib/config/env` (add new keys to its zod schema).

## 9. Quality gates

Before a task is done:

```bash
npm run typecheck && npm run lint && npm run format:check
```

Husky pre-commit runs `lint-staged` (eslint --fix + prettier on staged files).
`next build` ignores lint; CI runs it separately.

## 10. Do / Don't

- ✅ Add a feature by following `add-module` skill exactly.
- ✅ Put new query keys in `query-keys.ts` in the same change.
- ✅ Keep `page.tsx` ≤ ~10 lines.
- ❌ No fetching in `useEffect` — use a query hook.
- ❌ No server data in zustand.
- ❌ No deep imports into another feature.
- ❌ No new Supabase clients inside features (use `rpc()` / `supabase` from `@/lib/api/supabase`).
- ❌ No raw `process.env`, no raw `localStorage` for tokens.
- ❌ No giant files — split a screen once it passes ~300 lines into `components/`.
