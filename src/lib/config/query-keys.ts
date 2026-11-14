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
    divisions: () => ['reference', 'divisions'] as const,
    districts: (divisionId: number) => ['reference', 'districts', divisionId] as const,
    thanas: (districtId: number) => ['reference', 'thanas', districtId] as const,
    venueNames: () => ['reference', 'venue-names'] as const,
  },
  dashboard: {
    all: () => ['dashboard'] as const,
    overview: (months: number = 6) => ['dashboard', 'overview', months] as const,
  },
  users: {
    all: () => ['users'] as const,
    list: (params: object = {}) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
  appeals: {
    all: () => ['appeals'] as const,
    list: (params: object = {}) => ['appeals', 'list', params] as const,
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
  turfRequests: {
    all: () => ['turf-requests'] as const,
    list: (params: object = {}) => ['turf-requests', 'list', params] as const,
    detail: (id: string) => ['turf-requests', 'detail', id] as const,
  },
  locations: {
    all: () => ['locations'] as const,
    list: (params: object = {}) => ['locations', 'list', params] as const,
  },
  activity: {
    all: () => ['activity'] as const,
    feed: (params: object = {}) => ['activity', 'feed', params] as const,
  },
} as const;
