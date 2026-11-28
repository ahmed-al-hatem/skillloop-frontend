import { Outlet, useLocation, useNavigate } from 'react-router';
import { ClearFiltersButton } from '@/shared/components/ClearFiltersButton';
import { ErrorState } from '@/shared/components/ErrorState';
import { FilterBar } from '@/shared/components/FilterBar';
import { PageSizeSelect } from '@/shared/components/ui/PageSizeSelect';
import { Pagination } from '@/shared/components/ui/Pagination';
import { RangeText } from '@/shared/components/ui/RangeText';
import { Select, type SelectOption } from '@/shared/components/ui/Select';
import { ROUTES } from '@/shared/constants/routes';
import { useListParams } from '@/shared/hooks/useListParams';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useBookings } from '../api/bookings.queries';
import { BookingsTable } from '../components/BookingsTable';
import { BOOKING_STATUS_LABELS, BOOKING_STATUSES } from '../constants';
import { BookingListParamsSchema, type BookingStatus } from '../schemas/booking.schema';

const ALL = 'ALL';

const STATUS_OPTIONS: SelectOption<BookingStatus | typeof ALL>[] = [
  { value: ALL, label: `كل الحالات (${BOOKING_STATUSES.length})` },
  ...BOOKING_STATUSES.map((status) => ({ value: status, label: BOOKING_STATUS_LABELS[status] })),
];

/**
 * `/admin/bookings?status=`: every booking, newest first, read-only. Filter and page live in the
 * URL. `/admin/bookings/:id` opens the detail drawer (the `Outlet`) over the list.
 */
export function BookingsPage() {
  const { params, setParams, setPage, reset } = useListParams(BookingListParamsSchema);
  const bookings = useBookings(params);
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { data } = bookings;
  // Offline before the first load: the query is paused, so say why instead of a skeleton.
  const isPausedEmpty = bookings.isPending && bookings.fetchStatus === 'paused';
  // `keepPreviousData` avoids a flash between pages, but rows of another status must not show
  // (or an empty page) under the new filter: skeleton until it arrives.
  const isOtherStatus =
    bookings.isPlaceholderData &&
    (data?.data.length === 0 ||
      Boolean(params.status && data?.data.some((b) => b.status !== params.status)));
  const isLoading = (bookings.isPending && !isPausedEmpty) || isOtherStatus;
  const isFiltered = Boolean(params.status || params.userId || params.serviceId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-4 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold">الحجوزات</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            للقراءة فقط. تتحرك النقاط المحجوزة عبر حل النزاعات وحده.
          </p>
        </div>
        <FilterBar label="فلترة الحجوزات" className="max-sm:w-full">
          <Select
            label="الحالة"
            hideLabel
            options={STATUS_OPTIONS}
            value={params.status ?? ALL}
            onChange={(value) => setParams({ status: value === ALL ? undefined : value })}
            className="sm:w-47.5"
          />
          <ClearFiltersButton schema={BookingListParamsSchema} params={params} onClear={reset} />
        </FilterBar>
      </header>

      {(bookings.isError && !data) || isPausedEmpty ? (
        <ErrorState
          error={bookings.error}
          message={
            isPausedEmpty ? 'لا يوجد اتصال بالإنترنت. ستظهر الحجوزات عند عودة الاتصال.' : undefined
          }
          onRetry={isOnline ? () => void bookings.refetch() : undefined}
          isRetrying={bookings.isRefetching}
          className="rounded-xl border bg-surface"
        />
      ) : (
        <BookingsTable
          data={data?.data}
          isLoading={isLoading}
          isFiltered={isFiltered}
          onClearFilters={reset}
          search={search}
          onOpen={(id) =>
            void navigate(
              { pathname: ROUTES.admin.booking(id), search },
              { state: { fromList: true } },
            )
          }
          footer={
            data &&
            !isLoading && (
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

      <Outlet />
    </div>
  );
}
