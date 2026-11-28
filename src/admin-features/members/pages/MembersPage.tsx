import { ClearFiltersButton } from '@/shared/components/ClearFiltersButton';
import { ErrorState } from '@/shared/components/ErrorState';
import { FilterBar } from '@/shared/components/FilterBar';
import { Ltr } from '@/shared/components/ui/Ltr';
import { PageSizeSelect } from '@/shared/components/ui/PageSizeSelect';
import { Pagination } from '@/shared/components/ui/Pagination';
import { RangeText } from '@/shared/components/ui/RangeText';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { Select, type SelectOption } from '@/shared/components/ui/Select';
import { useListParams } from '@/shared/hooks/useListParams';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { formatNumber } from '@/shared/lib/format';
import { useMembers } from '../api/members.queries';
import { MembersTable } from '../components/MembersTable';
import { memberStatusBadge } from '../constants';
import { MemberListUrlParamsSchema, type UserStatus } from '../schemas/member.schema';

const ALL = 'ALL';
const STATUS_OPTIONS: SelectOption<UserStatus | typeof ALL>[] = [
  { value: ALL, label: 'كل الحالات' },
  { value: 'ACTIVE', label: memberStatusBadge.ACTIVE.label },
  { value: 'SUSPENDED', label: memberStatusBadge.SUSPENDED.label },
];

/** `/admin/members?q=&status=`: searchable members list. Filters, page and size live in the URL. */
export function MembersPage() {
  const { params, setParams, setPage, reset } = useListParams(MemberListUrlParamsSchema);
  const members = useMembers({ ...params, q: params.q || undefined });
  const isOnline = useOnlineStatus();
  const { data } = members;
  const isFiltered = Boolean(params.q || params.status);
  // Offline before the first load: the query is paused, so say why instead of a skeleton.
  const isPausedEmpty = members.isPending && members.fetchStatus === 'paused';

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-8">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-[22px] font-bold">الأعضاء</h1>
          {data && data.meta.total > 0 && (
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              <Ltr>{formatNumber(data.meta.total)}</Ltr>{' '}
              {isFiltered ? 'نتيجة مطابقة' : 'عضواً مسجلاً'}
            </p>
          )}
        </div>
        <FilterBar label="فلترة الأعضاء">
          <SearchInput
            label="بحث"
            placeholder="الاسم أو الإيميل أو رقم الهاتف"
            value={params.q}
            onChange={(q) => setParams({ q }, { replace: true })}
            className="sm:max-w-115 sm:flex-[1_1_20rem]"
          />
          <Select
            label="الحالة"
            hideLabel
            options={STATUS_OPTIONS}
            value={params.status ?? ALL}
            onChange={(v) => setParams({ status: v === ALL ? undefined : v })}
            className="sm:w-47.5"
          />
          <ClearFiltersButton schema={MemberListUrlParamsSchema} params={params} onClear={reset} />
        </FilterBar>
      </header>

      {/* A failed filter change must not leave the previous filter's rows on screen. */}
      {(members.isError && (!data || members.isPlaceholderData)) || isPausedEmpty ? (
        <ErrorState
          error={members.error}
          message={
            isPausedEmpty ? 'لا يوجد اتصال بالإنترنت. سيظهر الأعضاء عند عودة الاتصال.' : undefined
          }
          onRetry={isOnline ? () => void members.refetch() : undefined}
          isRetrying={members.isRefetching}
          className="rounded-xl border bg-surface"
        />
      ) : (
        <MembersTable
          data={data?.data}
          isLoading={members.isPending && !isPausedEmpty}
          isFiltered={isFiltered}
          onClearFilters={reset}
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
    </div>
  );
}
