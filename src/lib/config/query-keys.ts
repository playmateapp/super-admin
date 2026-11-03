/**
 * Central TanStack Query key factory. Every feature namespace lives here; `all()` must be
 * a prefix of every other key in its namespace so one invalidation refreshes all of them.
 */
export const queryKeys = {
  auth: {
    all: () => ['auth'] as const,
    profile: () => ['auth', 'profile'] as const,
  },
  reference: {
    all: () => ['reference'] as const,
    areas: () => ['reference', 'areas'] as const,
  },
  dashboard: {
    all: () => ['dashboard'] as const,
    overview: () => ['dashboard', 'overview'] as const,
  },
  users: {
    all: () => ['users'] as const,
    list: (params: object = {}) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
  teams: {
    all: () => ['teams'] as const,
    list: (params: object = {}) => ['teams', 'list', params] as const,
    detail: (id: string) => ['teams', 'detail', id] as const,
  },
  matches: {
    all: () => ['matches'] as const,
    list: (params: object = {}) => ['matches', 'list', params] as const,
    detail: (id: string) => ['matches', 'detail', id] as const,
  },
  venues: {
    all: () => ['venues'] as const,
    list: (params: object = {}) => ['venues', 'list', params] as const,
    detail: (id: string) => ['venues', 'detail', id] as const,
  },
  subscriptions: {
    all: () => ['subscriptions'] as const,
    list: (params: object = {}) => ['subscriptions', 'list', params] as const,
    detail: (id: string) => ['subscriptions', 'detail', id] as const,
  },
  areas: {
    all: () => ['areas'] as const,
    list: (params: object = {}) => ['areas', 'list', params] as const,
  },
  activity: {
    all: () => ['activity'] as const,
    feed: () => ['activity', 'feed'] as const,
  },
} as const;
