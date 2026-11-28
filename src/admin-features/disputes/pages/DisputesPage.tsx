import { ErrorState } from '@/shared/components/ErrorState';
import { PageSizeSelect } from '@/shared/components/ui/PageSizeSelect';
import { Pagination } from '@/shared/components/ui/Pagination';
import { RangeText } from '@/shared/components/ui/RangeText';
import { Tabs } from '@/shared/components/ui/Tabs';
import { useListParams } from '@/shared/hooks/useListParams';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useDisputes } from '../api/disputes.queries';
import { DisputesTable } from '../components/DisputesTable';
import { DISPUTE_STATUS_LABELS } from '../constants';
import { DisputeListParamsSchema, type DisputeStatus } from '../schemas/dispute.schema';

const STATUSES = ['OPEN', 'RESOLVED'] as const satisfies readonly DisputeStatus[];

/** `/admin/disputes?status=`: the dispute queue, oldest first. Tab, page and size live in the URL. */
export function DisputesPage() {
  const { params, setParams, setPage } = useListParams(DisputeListParamsSchema);
  const disputes = useDisputes(params);
  const isOnline = useOnlineStatus();
  const { data } = disputes;
  // Offline before the first load: the query is paused, so say why instead of a skeleton.
  const isPausedEmpty = disputes.isPending && disputes.fetchStatus === 'paused';
  // `keepPreviousData` keeps the old page on screen while the next loads (no flash), but rows of
  // the other tab must not show under this one: skeleton until the new tab arrives.
  const isOtherTab =
    disputes.isPlaceholderData && Boolean(data?.data.some((d) => d.status !== params.status));
  const isLoading = (disputes.isPending && !isPausedEmpty) || isOtherTab;

  const tabs = STATUSES.map((status) => ({
    value: status,
    label: DISPUTE_STATUS_LABELS[status],
    count: status === params.status && data && !isLoading ? data.meta.total : undefined,
  }));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold">النزاعات</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            مرتبة من الأقدم إلى الأحدث. الحل نهائي ويحرّك النقاط المحجوزة.
          </p>
        </div>
        <Tabs
          variant="segmented"
          label="حالة النزاع"
          items={tabs}
          value={params.status}
          onValueChange={(status) => setParams({ status }, { replace: true })}
        />
      </header>

      {(disputes.isError && !data) || isPausedEmpty ? (
        <ErrorState
          error={disputes.error}
          message={
            isPausedEmpty ? 'لا يوجد اتصال بالإنترنت. ستظهر النزاعات عند عودة الاتصال.' : undefined
          }
          onRetry={isOnline ? () => void disputes.refetch() : undefined}
          isRetrying={disputes.isRefetching}
          className="rounded-xl border bg-surface"
        />
      ) : (
        <DisputesTable
          status={params.status}
          data={data?.data}
          isLoading={isLoading}
          now={disputes.dataUpdatedAt}
          footer={
            data && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  <PageSizeSelect
                    value={params.pageSize}
                    onChange={(pageSize) => setParams({ pageSize })}
                  />
                  <RangeText meta={data.meta} />
                </div>
                <Pagination meta={data.meta} onPageChange={setPage} />
              </div>
            )
          }
        />
      )}

      {params.status === 'OPEN' && data && data.meta.total > 0 && (
        <p className="text-xs text-muted-foreground">
          العمر بالأحمر = انتهت مهلة رد مقدم الخدمة (48 ساعة).
        </p>
      )}
    </div>
  );
}
