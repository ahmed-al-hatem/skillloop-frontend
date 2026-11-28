import { Link } from 'react-router';
import { useDisputes, type AdminDispute } from '@/admin-features/disputes';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';
import { formatRelative } from '@/shared/lib/format';
import { OLDEST_DISPUTES_COUNT } from '../constants';

const RESPONSE_LABELS = {
  responded: 'ردّ مقدم الخدمة · جاهز للحل',
  overdue: 'مقدم الخدمة لم يرد بعد · المهلة انتهت',
  waiting: 'بانتظار رد مقدم الخدمة',
} as const;

/** Where the dispute stands, from the backend's fields (🟡 `providerResponseDueAt` when sent). */
function responseState(dispute: AdminDispute, now: number): keyof typeof RESPONSE_LABELS {
  if (dispute.providerRespondedAt) return 'responded';
  const due = dispute.providerResponseDueAt;
  return due && new Date(due).getTime() <= now ? 'overdue' : 'waiting';
}

export function OldestDisputesCard() {
  const disputes = useDisputes({ status: 'OPEN', page: 1, pageSize: OLDEST_DISPUTES_COUNT });
  const items = disputes.data?.data ?? [];
  const now = disputes.dataUpdatedAt;

  return (
    <section
      aria-labelledby="oldest-disputes-title"
      aria-busy={disputes.isPending || undefined}
      className="flex min-w-0 flex-col gap-3 rounded-xl border bg-surface p-5"
    >
      <div className="flex items-center justify-between">
        <h2 id="oldest-disputes-title" className="font-bold">
          أقدم النزاعات المفتوحة
        </h2>
        <Link
          to={ROUTES.admin.disputes}
          className="text-[13px] font-semibold text-primary hover:underline"
        >
          الكل
        </Link>
      </div>

      {disputes.isPending ? (
        ['a', 'b', 'c'].map((key) => <Skeleton key={key} className="h-21 rounded-xl" />)
      ) : disputes.isError && !disputes.data ? (
        <ErrorState
          error={disputes.error}
          onRetry={() => void disputes.refetch()}
          isRetrying={disputes.isRefetching}
          className="p-4"
        />
      ) : items.length === 0 ? (
        <EmptyState variant="success" title="لا توجد نزاعات مفتوحة. كل شيء تحت السيطرة." />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((dispute) => {
            const state = responseState(dispute, now);
            const isOverdue = state === 'overdue';
            return (
              <li key={dispute.id}>
                <Link
                  to={ROUTES.admin.dispute(dispute.id)}
                  className={cn(
                    'flex flex-col gap-1.5 rounded-xl border p-3 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    isOverdue && 'border-warning/40 bg-warning-muted',
                  )}
                >
                  <span className="flex items-center justify-between gap-2 text-xs font-semibold">
                    <span dir="ltr" className="font-latin text-[13px]">
                      {dispute.code ? `#${dispute.code}` : null}
                    </span>
                    <time
                      dateTime={dispute.createdAt}
                      className={isOverdue ? 'text-danger' : 'text-muted-foreground'}
                    >
                      {formatRelative(dispute.createdAt)}
                    </time>
                  </span>
                  <span className="text-sm">{dispute.booking.serviceTitle}</span>
                  <span className="text-xs text-muted-foreground">{RESPONSE_LABELS[state]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
