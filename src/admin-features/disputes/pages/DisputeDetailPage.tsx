import { Link, useParams } from 'react-router';
import { ApiRequestError } from '@/shared/api/client';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { ROUTES } from '@/shared/constants/routes';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useDispute } from '../api/disputes.queries';
import { DisputeDetail } from '../components/DisputeDetail';
import { DisputeDetailSkeleton } from '../components/DisputeDetailSkeleton';

/** `/admin/disputes/:id`: everything the admin needs to decide a dispute (read-only for now). */
export function DisputeDetailPage() {
  const { id } = useParams();
  const dispute = useDispute(id);
  const isOnline = useOnlineStatus();
  // Offline before the first load: the query is paused, so say why instead of a skeleton.
  const isPausedEmpty = dispute.isPending && dispute.fetchStatus === 'paused';
  const isNotFound = dispute.error instanceof ApiRequestError && dispute.error.status === 404;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-8">
      {dispute.data ? (
        <DisputeDetail dispute={dispute.data} now={dispute.dataUpdatedAt} />
      ) : isNotFound ? (
        <EmptyState
          title="غير موجود"
          description="هذا النزاع غير موجود أو أن الرابط غير صحيح."
          action={
            <Link
              to={ROUTES.admin.disputes}
              className="rounded-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              العودة إلى النزاعات
            </Link>
          }
          className="bg-surface"
        />
      ) : dispute.isError || isPausedEmpty ? (
        <ErrorState
          error={dispute.error}
          message={
            isPausedEmpty
              ? 'لا يوجد اتصال بالإنترنت. ستظهر تفاصيل النزاع عند عودة الاتصال.'
              : undefined
          }
          onRetry={isOnline ? () => void dispute.refetch() : undefined}
          isRetrying={dispute.isRefetching}
          className="rounded-xl border bg-surface"
        />
      ) : (
        <DisputeDetailSkeleton />
      )}
    </div>
  );
}
