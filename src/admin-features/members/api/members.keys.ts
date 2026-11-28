import type { MemberListParams } from '../schemas/member.schema';

/** Query keys. Every admin key starts with `'admin'` so logout can drop them all at once. */
export const memberKeys = {
  all: ['admin', 'members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (params: MemberListParams) => [...memberKeys.lists(), params] as const,
  detail: (id: string) => [...memberKeys.all, 'detail', id] as const,
};

/** Dashboard counters (owned by the overview feature) — refreshed after member mutations. */
export const adminDashboardKey = ['admin', 'dashboard'] as const;
