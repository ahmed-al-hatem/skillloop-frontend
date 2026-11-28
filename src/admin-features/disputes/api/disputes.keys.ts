import type { DisputeListParams } from '../schemas/dispute.schema';

/** Every admin key starts with `'admin'`, so logout can remove them all at once. */
export const disputeKeys = {
  all: ['admin', 'disputes'] as const,
  lists: () => [...disputeKeys.all, 'list'] as const,
  list: (params: DisputeListParams) => [...disputeKeys.lists(), params] as const,
  details: () => [...disputeKeys.all, 'detail'] as const,
  detail: (id: string) => [...disputeKeys.details(), id] as const,
};

/** Owned by the overview feature (dashboard counters, sidebar badges). */
export const adminDashboardKey = ['admin', 'dashboard'] as const;
