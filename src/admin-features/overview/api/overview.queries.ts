import { useQuery } from '@tanstack/react-query';
import type { AdminCounters, AdminDashboard } from '../schemas/dashboard.schema';
import { getAdminDashboard } from './overview.api';
import { overviewKeys } from './overview.keys';

/** How often the dashboard numbers refresh while the tab is visible. */
export const DASHBOARD_REFETCH_INTERVAL = 60_000;

const dashboardQuery = {
  queryKey: overviewKeys.dashboard(),
  queryFn: getAdminDashboard,
  refetchInterval: DASHBOARD_REFETCH_INTERVAL,
  // Pause polling while the tab is hidden; it resumes (and refetches) when the tab is back.
  refetchIntervalInBackground: false,
} as const;

/** The admin dashboard numbers (`GET /admin/dashboard`), polled every 60 s while visible. */
export function useAdminDashboard() {
  return useQuery(dashboardQuery);
}

const selectCounters = ({ openDisputes, pendingSuggestions }: AdminDashboard): AdminCounters => ({
  openDisputes,
  pendingSuggestions,
});

/**
 * Sidebar badge counts. Shares the dashboard cache and polling, but re-renders only when one of
 * the two counts changes, and keeps the sidebar independent of the full dashboard shape.
 */
export function useAdminCounters() {
  return useQuery({ ...dashboardQuery, select: selectCounters });
}
