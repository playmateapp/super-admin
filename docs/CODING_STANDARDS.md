# Coding standards (PlayMate admin)

`/CLAUDE.md` §7–§10 are the base rules. These are the project-specific additions.

## Styling
- Token classes only (see DESIGN_SYSTEM.md). No hex / rgb literals in TSX. A token may be
  referenced inside an arbitrary value when a utility cannot express it
  (`bg-[linear-gradient(rgb(var(--surface-inverse))_44px,transparent_44px)]`).
- Use `cn()` from `@/lib/utils` for every conditional class list.
- Logical direction utilities only: `ms-* me-* ps-* pe-* start-* end-* text-start`. No
  `ml-/mr-/left-/right-` for layout that should mirror. Directional icons get `rtl:-scale-x-100`.
- Base `<a>` is unstyled (inherits colour). Colour links explicitly (`text-content-link`).
- Buttons that navigate: `<Button asChild><Link href>…</Link></Button>`.

## i18n
- No user-facing string literals in components. Put copy in the owner's `*.messages.ts`
  (`defineMessages({ en, bn })`, `bn: typeof en`) and read it with `useMessages(bundle)`.
  Shared words (Create, Cancel, Search, statuses, validation errors) come from `commonMessages`.
- Exception: server-only root files without providers' hooks (`not-found.tsx`,
  `global-error.tsx`) carry a short bilingual inline string.
- Dynamic values via `interpolate(template, vars)`; numbers and dates via `lib/utils/format.ts`
  (Western digits in both languages).
- Seed / API data (names, categories) is not translated.
- Every screen must be checked in EN + BN and light + dark before a task is done.

## Hydration
- Anything read from `localStorage` (theme, session) must be gated (`useIsHydrated()` or the
  auth store's `isInitialized`) before it changes markup.

## Accessibility
- Icon-only buttons need `aria-label` (from messages). Toggles use `aria-pressed` /
  `aria-checked`. Tables use `<th scope>`; the actions column header is `sr-only`.
- A control without a visible label (toolbar filters, drop zone) gets `aria-label`.

## Barrels
- Large-feature root barrels (`features/users/index.ts`) re-export sub-feature **screens by
  name**, not with `export *` — chained star re-exports of 'use client' screens can resolve to
  `undefined` in server route files.

## Lists
- Columns are `DataTableColumn<T>[]` in a `useMemo`; give each exportable column a `value`.
- Filters: `useState` per filter, empty string = no filter, `undefined` in the params object.
- Never render your own loading / empty / error for a table — pass the flags to `DataTable`.

## Forms
- `useForm({ resolver: zodResolver(useMemo(() => xSchema(c.errors), [c.errors])), defaultValues })`
  + `<FormWrapper>` + `@/components/form` inputs. Schemas are factories that take localised
  error messages and are built from `lib/validations/fields.ts`.
- Form values are strings; `to<X>Input(values)` beside the schema converts to the API body.
- A `<select>` value stays `string` in the form type (starts as `''`); cast in the mapper.
- Phone / email inputs get `dir="ltr"`.

## API calls (Supabase)
- One function per RPC in `api/*.api.ts`: `rpc<T>('admin_x', { p_arg })`. Params are snake_case
  `p_*` as in SQL. New admin RPCs must call `public.require_admin()` first and be granted to
  `authenticated` only; add them to the app repo's `supabase/migrations/`.
- Status words come from SQL; show them with `<StatusTag status>` (labels in `commonMessages.status`).
- User-uploaded images are plain `<img>` with an eslint-disable comment (Supabase Storage URLs).

## Placeholders
- Mock data is allowed only in a feature's `data/` folder, marked in its JSDoc and listed in
  BUILD_PLAN → "Content / API to confirm". Never invent an API contract silently.

## Shell scripts
- zsh: never name a loop variable `path` (it is tied to `PATH`).

## Definition of done
1. `npm run typecheck && npm run lint && npm run format:check` pass; `npm run build` passes.
2. Checked in browser: EN/BN × light/dark, 1440px and 360px, no console errors.
3. `docs/CHANGELOG.md` + `docs/BUILD_PLAN.md` updated (and ARCHITECTURE / DESIGN_SYSTEM /
   DISCUSSIONS if affected).
