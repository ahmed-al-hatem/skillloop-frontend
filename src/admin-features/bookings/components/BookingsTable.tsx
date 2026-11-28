import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { ROUTES } from '@/shared/constants/routes';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_VARIANTS } from '../constants';
import { bookingLabel } from '../lib/bookingLabel';
import type { AdminBookingListItem } from '../schemas/booking.schema';

export type BookingsTableProps = {
  data: AdminBookingListItem[] | undefined;
  isLoading: boolean;
  isFiltered: boolean;
  onClearFilters: () => void;
  /** Opens the detail drawer. The code cell is also a real link to it. */
  onOpen: (id: string) => void;
  /** Current list query (`?status=…`), kept in the drawer URL so closing restores it. */
  search: string;
  footer?: ReactNode;
};

const columns = (search: string): DataTableColumn<AdminBookingListItem>[] => [
  {
    id: 'code',
    header: 'الحجز',
    width: 'w-28',
    cell: (b) => (
      <Link
        to={{ pathname: ROUTES.admin.booking(b.id), search }}
        state={{ fromList: true }}
        className="rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <bdi dir="ltr" className="font-latin font-semibold whitespace-nowrap">
          {bookingLabel(b)}
        </bdi>
      </Link>
    ),
  },
  {
    id: 'service',
    header: 'الخدمة',
    cell: (b) => (
      <div className="flex min-w-48 flex-col gap-0.5 max-md:min-w-0">
        <span className="font-medium">{b.serviceTitle}</span>
        <span className="text-xs text-muted-foreground">
          <bdi>{b.receiver.fullName}</bdi> <span aria-label="إلى">←</span>{' '}
          <bdi>{b.provider.fullName}</bdi>
        </span>
      </div>
    ),
  },
  {
    id: 'points',
    header: 'النقاط',
    cell: (b) => <PointsAmount value={b.pricePoints} className="font-semibold" />,
  },
  {
    id: 'status',
    header: 'الحالة',
    cell: (b) => (
      <StatusBadge variant={BOOKING_STATUS_VARIANTS[b.status]}>
        {BOOKING_STATUS_LABELS[b.status]}
      </StatusBadge>
    ),
  },
  {
    id: 'createdAt',
    header: 'أُنشئ',
    cell: (b) => <RelativeTime value={b.createdAt} className="text-muted-foreground" />,
  },
];

/** Read-only bookings list. Loading / empty / filtered-empty states come from `DataTable`. */
export function BookingsTable({
  data,
  isLoading,
  isFiltered,
  onClearFilters,
  onOpen,
  search,
  footer,
}: BookingsTableProps) {
  return (
    <DataTable
      label="قائمة الحجوزات"
      columns={columns(search)}
      data={data}
      getRowId={(b) => b.id}
      isLoading={isLoading}
      emptyTitle="لا توجد حجوزات بعد."
      emptyDescription="ستظهر هنا الحجوزات بين الأعضاء فور إنشائها."
      isFiltered={isFiltered}
      filteredTitle="لا توجد حجوزات بهذه الحالة"
      filteredDescription="اختر حالة أخرى أو امسح الفلاتر."
      onClearFilters={onClearFilters}
      onRowClick={(b) => onOpen(b.id)}
      footer={footer}
    />
  );
}
