import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';

export type ActivityListProps = {
  /** The tab's list query (`useBookings` / `useServices`). */
  query: {
    isPending: boolean;
    isError: boolean;
    error: unknown;
    fetchStatus: string;
    isRefetching: boolean;
    refetch: () => unknown;
  };
  /** Rendered rows (`ActivityRow`s) once loaded. */
  rows: ReactNode[];
  emptyTitle: string;
  /** Full list page filtered to this member, shown when more rows exist than the tab holds. */
  viewAll?: { to: string; label: string };
};

/** One activity tab's body: skeleton rows, error + retry, empty, or the rows. */
export function ActivityList({ query, rows, emptyTitle, viewAll }: ActivityListProps) {
  const isOnline = useOnlineStatus();
  const isPausedEmpty = query.isPending && query.fetchStatus === 'paused';

  if (query.isError || isPausedEmpty) {
    return (
      <ErrorState
        error={query.error}
        message={isPausedEmpty ? 'لا يوجد اتصال بالإنترنت.' : undefined}
        onRetry={isOnline ? () => void query.refetch() : undefined}
        isRetrying={query.isRefetching}
      />
    );
  }
  if (query.isPending) {
    return (
      <div aria-busy="true" className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    );
  }
  if (rows.length === 0) return <EmptyState title={emptyTitle} className="border-0 py-8" />;

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">{rows}</ul>
      {viewAll && (
        <Link
          to={viewAll.to}
          className="w-fit rounded-sm text-[13px] font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {viewAll.label}
        </Link>
      )}
    </div>
  );
}
