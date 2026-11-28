import { Link, useParams } from 'react-router';
import { ApiRequestError } from '@/shared/api/client';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { ROUTES } from '@/shared/constants/routes';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useMember } from '../api/members.queries';
import { MemberDetail } from '../components/MemberDetail';
import { MemberDetailSkeleton } from '../components/MemberDetailSkeleton';

/** `/admin/members/:id`: profile, wallet, recent transactions and the member's activity. */
export function MemberDetailPage() {
  const { id } = useParams();
  const member = useMember(id);
  const isOnline = useOnlineStatus();
  // Offline before the first load: the query is paused, so say why instead of a skeleton.
  const isPausedEmpty = member.isPending && member.fetchStatus === 'paused';
  const isNotFound = member.error instanceof ApiRequestError && member.error.status === 404;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-8">
      {member.data ? (
        <MemberDetail member={member.data} />
      ) : isNotFound ? (
        <EmptyState
          title="غير موجود"
          description="هذا العضو غير موجود أو أن الرابط غير صحيح."
          action={
            <Link
              to={ROUTES.admin.members}
              className="rounded-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              العودة إلى الأعضاء
            </Link>
          }
          className="bg-surface"
        />
      ) : member.isError || isPausedEmpty ? (
        <ErrorState
          error={member.error}
          message={
            isPausedEmpty
              ? 'لا يوجد اتصال بالإنترنت. ستظهر بيانات العضو عند عودة الاتصال.'
              : undefined
          }
          onRetry={isOnline ? () => void member.refetch() : undefined}
          isRetrying={member.isRefetching}
          className="rounded-xl border bg-surface"
        />
      ) : (
        <MemberDetailSkeleton />
      )}
    </div>
  );
}
