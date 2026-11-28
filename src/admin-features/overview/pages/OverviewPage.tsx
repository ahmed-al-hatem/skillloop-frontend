import { ErrorState } from '@/shared/components/ErrorState';
import { Button } from '@/shared/components/ui/Button';
import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useAdminDashboard } from '../api/overview.queries';
import { AttentionAlert } from '../components/AttentionAlert';
import { BookingsByStatusCard } from '../components/BookingsByStatusCard';
import { OldestDisputesCard } from '../components/OldestDisputesCard';
import { OverviewStats } from '../components/OverviewStats';

/** `/admin`: platform health at a glance. Offline, the last loaded numbers stay on screen. */
export function OverviewPage() {
  const dashboard = useAdminDashboard();
  const isOnline = useOnlineStatus();
  const { data } = dashboard;
  // Offline before the first load: the query is paused, so show why instead of a skeleton.
  const isPausedEmpty = dashboard.isPending && dashboard.fetchStatus === 'paused';
  const isLoading = dashboard.isPending && !isPausedEmpty;
  const updatedAt =
    data?.generatedAt ??
    (dashboard.dataUpdatedAt ? new Date(dashboard.dataUpdatedAt).toISOString() : undefined);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold">نظرة عامة على المنصة</h1>
          {updatedAt && (
            <p className="mt-1 text-[13px] text-muted-foreground">
              أرقام لحظية من الباكند · آخر تحديث <RelativeTime value={updatedAt} />
            </p>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => void dashboard.refetch()}
          isLoading={dashboard.isFetching && !isLoading}
          disabled={!isOnline || isLoading}
          title={isOnline ? undefined : 'غير متاح بدون اتصال'}
          className="h-11 rounded-[10px] font-semibold"
        >
          تحديث
        </Button>
      </header>

      {(dashboard.isError && !data) || isPausedEmpty ? (
        <ErrorState
          error={dashboard.error}
          message={
            isPausedEmpty ? 'لا يوجد اتصال بالإنترنت. ستظهر الأرقام عند عودة الاتصال.' : undefined
          }
          onRetry={isOnline ? () => void dashboard.refetch() : undefined}
          isRetrying={dashboard.isRefetching}
          className="rounded-xl border bg-surface"
        />
      ) : (
        <>
          {data && <AttentionAlert data={data} />}
          <OverviewStats data={data} isLoading={isLoading} />
          <div className="grid gap-4 lg:grid-cols-3">
            <BookingsByStatusCard counts={data?.bookingsByStatus} isLoading={isLoading} />
            <OldestDisputesCard />
          </div>
        </>
      )}
    </div>
  );
}
