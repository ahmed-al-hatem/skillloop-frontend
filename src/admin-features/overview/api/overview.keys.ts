/**
 * Query keys of the overview feature. Every admin key starts with `'admin'`, so logout can drop
 * all admin data with `removeQueries({ queryKey: ['admin'] })`. Mutations that change the
 * counters (resolve a dispute, review a suggestion) invalidate `overviewKeys.dashboard()`.
 */
export const overviewKeys = {
  all: ['admin', 'dashboard'] as const,
  dashboard: () => overviewKeys.all,
};
