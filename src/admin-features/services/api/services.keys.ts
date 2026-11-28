import type { ServiceListParams } from '../schemas/service.schema';

/** Query keys. Every admin key starts with `'admin'` so logout can drop them all at once. */
export const serviceKeys = {
  all: ['admin', 'services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (params: ServiceListParams) => [...serviceKeys.lists(), params] as const,
};

/** Dashboard counters (owned by the overview feature) — refreshed after an archive. */
export const adminDashboardKey = ['admin', 'dashboard'] as const;
