---
name: add-module
description: Scaffold a new feature module (types, api, query keys, query/mutation hooks, zod schema, components, screen, barrel, route, nav) following the project's feature-first architecture. Use whenever the user asks to add a new feature, module, page backed by an API, CRUD screen, or sub-feature.
---

# Add Module

Creates a new feature under `src/features/<name>/` that looks exactly like every
other feature. Read `CLAUDE.md` first — this skill assumes its rules.

## 0. Gather inputs (ask only if not given / not inferable)

- **name** — kebab-case feature name (e.g. `invoices`). Singular noun for types (`Invoice`).
- **surface / route group** — `(panel)` for every signed-in panel page (guard + `AdminShell`
  come from its layout), `(auth)` for signed-out pages. One http client: `http`.
- **endpoints** — method + path + request/response shape for each. If the user gives
  none, ask; never invent a backend contract silently.
- **routes** — which pages (list, detail `[id]`, create, edit).
- **large feature?** — if it goes inside an existing split feature
  (e.g. `features/users/<sub>`), follow §9.

## 1. Look before writing

Open one existing feature and mirror it (naming, comments, imports order) — `src/features/auth`
(api + mocks + queries + mutations + schema + screen) is the starting reference; once the first
CRUD module exists, mirror that instead. The templates in §3 are the source of truth. Check:
- `src/lib/config/query-keys.ts` — namespace must not already exist.
- `src/lib/api/` — `http` is the only instance; wrap calls in `mocked()` (`lib/api/mock.ts`)
  with mock data in the feature's `data/<name>.mock.ts` until the endpoint exists.
- `src/components/ui/index.ts` and `src/components/form/index.ts` — reuse what exists.

## 2. Files to create

```text
src/features/<name>/
├── index.ts
├── types.ts
├── constants.ts                     (only if enums/option lists)
├── api/<name>.api.ts
├── hooks/queries.ts
├── hooks/mutations.ts               (only if writes)
├── validations/<name>.schema.ts     (only if forms)
├── store/<name>.store.ts            (only if UI state spans components)
├── data/<name>.mock.ts              (mock backend while NEXT_PUBLIC_API_MOCKS is on)
├── i18n/<name>.messages.ts          (ALL copy, `en` + `bn`)
├── components/index.ts
├── components/<name>-card.tsx ...   (widgets)
└── screen/<name>-list.screen.tsx, <name>-detail.screen.tsx, ...
```

Order: types → api → query keys → hooks → schema → components → screen → barrel → route → nav.

## 3. `types.ts`

```ts
/**
 * <Feature> types for `/<endpoint-root>`.
 * <One line on auth / scope / anything surprising about the payload.>
 */

export interface Item {
  id: string;
  name: string;
  status: ItemStatus;
  created_at: string;
}

export type ItemStatus = 'ACTIVE' | 'INACTIVE';

/** Query params for `GET /items`. */
export interface ItemListParams {
  page?: number;
  limit?: number;
  search?: string;
}

/** Response of `GET /items`. */
export interface ItemListResponse {
  total: number;
  data: Item[];
}

/** Response of `GET /items/{id}`. */
export interface ItemResponse {
  success: boolean;
  data: Item;
}

/** Body for `POST /items`. */
export interface CreateItemInput {
  name: string;
}

export type UpdateItemInput = Partial<CreateItemInput>;
```

Rules: keep backend `snake_case`; no `any`; document every response shape with its endpoint.

## 4. `api/<name>.api.ts`

```ts
import { http } from '@/lib/api/http';
import type { CreateItemInput, ItemListParams, ItemListResponse, ItemResponse, UpdateItemInput } from '../types';

/**
 * <Feature> request functions (`/items`). <Auth note: token attached by `http`.>
 */

/** GET /items — paginated list. */
export const getItems = (params: ItemListParams = {}) =>
  http.get<ItemListResponse>('/items', { params }).then((r) => r.data);

/** GET /items/{id} — single item. */
export const getItem = (id: string) =>
  http.get<ItemResponse>(`/items/${id}`).then((r) => r.data);

/** POST /items — create. */
export const createItem = (input: CreateItemInput) =>
  http.post<ItemResponse>('/items', input).then((r) => r.data);

/** PATCH /items/{id} — update. */
export const updateItem = (id: string, input: UpdateItemInput) =>
  http.patch<ItemResponse>(`/items/${id}`, input).then((r) => r.data);

/** DELETE /items/{id} — delete. */
export const deleteItem = (id: string) => http.delete(`/items/${id}`).then((r) => r.data);
```

No React, no toasts, no try/catch here. Use the http instance matching the surface.

## 5. Query keys — edit `src/lib/config/query-keys.ts`

Add a namespace (nested under the parent namespace for sub-features):

```ts
items: {
  all: () => ['items'] as const,
  list: (params: object = {}) => ['items', 'list', params] as const,
  detail: (id: string) => ['items', 'detail', id] as const,
},
```

`all()` must prefix every other key.

## 6. Hooks

`hooks/queries.ts`
```ts
'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';
import { getItem, getItems } from '../api/<name>.api';
import type { ItemListParams } from '../types';

/** GET /items — paginated list. */
export function useItems(params: ItemListParams = {}) {
  return useQuery({
    queryKey: queryKeys.items.list(params),
    queryFn: () => getItems(params),
    placeholderData: keepPreviousData,
  });
}

/** GET /items/{id} — single item. */
export function useItem(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.items.detail(id ?? ''),
    queryFn: () => getItem(id as string),
    enabled: !!id,
  });
}
```

`hooks/mutations.ts`
```ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/query-keys';
import * as itemApi from '../api/<name>.api';
import type { CreateItemInput, UpdateItemInput } from '../types';

/** Item mutations (`/items`). Each refreshes cached items on success. */

/** POST /items — create. */
export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateItemInput) => itemApi.createItem(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.items.all() });
    },
  });
}

/** PATCH /items/{id} — update. */
export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateItemInput }) =>
      itemApi.updateItem(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.items.all() });
    },
  });
}
```

If the backend replies `{ success: false, message }` with HTTP 200, throw inside
`mutationFn`: `if (!res.success) throw new Error(res.message || '<fallback>');`.

## 7. Validation — `validations/<name>.schema.ts`

```ts
import { z } from 'zod';

/** Item form schema — mirrors the `POST /items` body. */
export const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  website: z.string().url('Enter a valid URL (https://…)').optional().or(z.literal('')),
});
export type ItemFormValues = z.infer<typeof itemSchema>;
```

Optional strings use `.optional().or(z.literal(''))`; strip empty strings before sending
(a small `to<X>Input(values)` mapper in the screen or `data/`).

## 8. UI

**Component** (`components/item-card.tsx`) — `'use client'` only if it needs hooks; named
export; props typed; tokens only (`bg-surface-*`, `text-content-*`, `brand-*`, `border-line`);
`cn()` for conditional classes; primitives from `@/components/ui`. Export it from
`components/index.ts`.

**Screen** (`screen/item-list.screen.tsx`)
```tsx
'use client';

import { RefreshCw } from 'lucide-react';

import { Button, StatusState } from '@/components/ui';

import { ItemCard } from '../components';
import { useItems } from '../hooks/queries';

/** ItemListScreen — lists the user's items from `GET /items`. */
export function ItemListScreen() {
  const { data, isLoading, isError, refetch } = useItems();

  if (isLoading) {
    return (
      <StatusState
        variant="loading"
        title="Loading items"
        icon={<RefreshCw className="size-9 animate-spin text-brand-500" />}
      />
    );
  }

  if (isError) {
    return (
      <StatusState
        variant="error"
        title="Couldn’t load items"
        actions={
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!data?.data.length) {
    return <StatusState variant="empty" title="No items yet" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-heading-lg font-bold text-content-primary sm:text-heading-xl">Items</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

**Form screen** — `useForm<ItemFormValues>({ resolver: zodResolver(itemSchema), defaultValues })`,
`<FormWrapper form={form} onSubmit={onSubmit}>` + `@/components/form` inputs, submit via
`mutateAsync` in try/catch, show `parseAPIError(err)` (or `toast.error(getErrorMessage(err))`),
on success `toast.success(...)` and `router.push(...)`.

**Store** (only if needed) — UI flags only:
```ts
import { create } from 'zustand';

/** <Feature> UI store — client state only; server data comes from queries. */
interface ItemUIState {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useItemStore = create<ItemUIState>((set) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));

// Selectors
export const useIsItemDrawerOpen = () => useItemStore((s) => s.isDrawerOpen);
```

## 9. Barrel — `index.ts`

```ts
/**
 * @/features/<name> — <one line purpose>. Import this feature only through this barrel.
 */

// Screens (route-level)
export { ItemListScreen } from './screen/item-list.screen';
export { ItemDetailScreen } from './screen/item-detail.screen';

// API request functions
export * as itemApi from './api/<name>.api';

// Hooks
export { useItems, useItem } from './hooks/queries';
export { useCreateItem, useUpdateItem } from './hooks/mutations';

// Validations
export { itemSchema, type ItemFormValues } from './validations/<name>.schema';

// Types
export type { Item, ItemListParams, ItemListResponse, ItemResponse, CreateItemInput } from './types';
```

Export only what outside code needs (screens always; hooks/types if reused).

**Sub-feature of a large feature:** create `features/<parent>/<name>/` with the same shape
and its own `index.ts`, then add `export * from './<name>';` to `features/<parent>/index.ts`.
Never import a sibling sub-feature — move shared code to `features/<parent>/shared/`.
Routes still import from `@/features/<parent>`.

## 10. Routes — `src/app/<group>/<path>/page.tsx`

```tsx
import { ItemListScreen } from '@/features/<name>';

export default function Page() {
  return <ItemListScreen />;
}
```

Dynamic: `export default function Page({ params }: { params: { id: string } }) { return <ItemDetailScreen itemId={params.id} />; }`

- Put the page in the correct route group — guard + shell come from the group `layout.tsx`.
  Do not add guards in the page.
- Add `export const metadata` only in server route files when the page needs its own title.

## 11. Navigation

If the page should appear in the sidebar, add one entry to `adminNav` in
`src/components/layout/admin-nav.ts` (`{ key, labelKey, href, icon }`, lucide icon) and its
label to `layoutMessages.nav` (`en` + `bn`). Do not edit the sidebar component.

## 12. Verify

```bash
npm run typecheck && npm run lint && npm run format:check
```

Then check:
- [ ] Nothing outside the feature deep-imports it.
- [ ] Feature does not import another feature's internals.
- [ ] New keys exist in `query-keys.ts`; every mutation invalidates `<ns>.all()`.
- [ ] No `useEffect` fetching, no server data in zustand, no `any`, no raw `process.env`.
- [ ] Loading / empty / error states handled with `StatusState`.
- [ ] Only design tokens used; layout works at 360px.
- [ ] `page.tsx` only renders a screen.

Report to the user: files created, files edited (`query-keys.ts`, parent barrel, nav config),
routes added, and any assumed API shapes that need confirming.
