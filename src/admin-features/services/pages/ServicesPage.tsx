import { ClearFiltersButton } from '@/shared/components/ClearFiltersButton';
import { ErrorState } from '@/shared/components/ErrorState';
import { FilterBar } from '@/shared/components/FilterBar';
import { PageSizeSelect } from '@/shared/components/ui/PageSizeSelect';
import { Pagination } from '@/shared/components/ui/Pagination';
import { RangeText } from '@/shared/components/ui/RangeText';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { Select, type SelectOption } from '@/shared/components/ui/Select';
import { useListParams } from '@/shared/hooks/useListParams';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useServices } from '../api/services.queries';
import { ServicesTable } from '../components/ServicesTable';
import { serviceStatusBadge } from '../constants';
import {
  ServiceListParamsSchema,
  ServiceStatusSchema,
  type ServiceStatus,
} from '../schemas/service.schema';

const ALL = 'ALL';

const STATUS_OPTIONS: SelectOption<ServiceStatus | typeof ALL>[] = [
  { value: ALL, label: 'كل الحالات' },
  ...ServiceStatusSchema.options.map((status) => ({
    value: status,
    label: serviceStatusBadge[status].label,
  })),
];

/**
 * `/admin/services?q=&status=`: every service, newest first. Filters and page live in the URL.
 * The category filter waits for a categories list endpoint in the codebase; archive comes in 5.4.
 */
export function ServicesPage() {
  const { params, setParams, setPage, reset } = useListParams(ServiceListParamsSchema);
  const services = useServices(params);
  const isOnline = useOnlineStatus();
  const { data } = services;
  // Offline before the first load: the query is paused, so say why instead of a skeleton.
  const isPausedEmpty = services.isPending && services.fetchStatus === 'paused';
  const isFiltered = Boolean(params.q || params.status || params.categoryId || params.providerId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold">الخدمات</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            الأرشفة تخفي الخدمة نهائياً من السوق ولا يمكن التراجع عنها.
          </p>
        </div>
        <FilterBar label="فلترة الخدمات" className="flex-1 justify-end">
          <SearchInput
            label="بحث"
            placeholder="عنوان الخدمة أو اسم مقدمها"
            value={params.q}
            onChange={(q) => setParams({ q }, { replace: true })}
            className="sm:max-w-80 sm:flex-[1_1_16rem]"
          />
          <Select
            label="الحالة"
            hideLabel
            options={STATUS_OPTIONS}
            value={params.status ?? ALL}
            onChange={(value) => setParams({ status: value === ALL ? undefined : value })}
            className="sm:w-44"
          />
          <ClearFiltersButton schema={ServiceListParamsSchema} params={params} onClear={reset} />
        </FilterBar>
      </header>

      {(services.isError && !data) || isPausedEmpty ? (
        <ErrorState
          error={services.error}
          message={
            isPausedEmpty ? 'لا يوجد اتصال بالإنترنت. ستظهر الخدمات عند عودة الاتصال.' : undefined
          }
          onRetry={isOnline ? () => void services.refetch() : undefined}
          isRetrying={services.isRefetching}
          className="rounded-xl border bg-surface"
        />
      ) : (
        <ServicesTable
          data={data?.data}
          isLoading={services.isPending && !isPausedEmpty}
          isFiltered={isFiltered}
          onClearFilters={reset}
          footer={
            data &&
            data.meta.total > 0 && (
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
    </div>
  );
}
