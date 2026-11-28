import type { ReactNode } from 'react';
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_VARIANTS } from '../constants';
import type { AdminBookingListItem } from '../schemas/booking.schema';

export type BookingsTableProps = {
  data: AdminBookingListItem[] | undefined;
  isLoading: boolean;
  isFiltered: boolean;
  onClearFilters: () => void;
  footer?: ReactNode;
};

/** «#B-8812» from the 🟡 `code`; the start of the id until the backend sends it. */
const bookingLabel = (b: AdminBookingListItem) => `#${b.code ?? b.id.slice(0, 8)}`;

const columns: DataTableColumn<AdminBookingListItem>[] = [
  {
    id: 'code',
    header: 'الحجز',
    width: 'w-28',
    cell: (b) => (
      <bdi dir="ltr" className="font-latin font-semibold whitespace-nowrap">
        {bookingLabel(b)}
      </bdi>
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
  footer,
}: BookingsTableProps) {
  return (
    <DataTable
      label="قائمة الحجوزات"
      columns={columns}
      data={data}
      getRowId={(b) => b.id}
      isLoading={isLoading}
      emptyTitle="لا توجد حجوزات بعد."
      emptyDescription="ستظهر هنا الحجوزات بين الأعضاء فور إنشائها."
      isFiltered={isFiltered}
      filteredTitle="لا توجد حجوزات بهذه الحالة"
      filteredDescription="اختر حالة أخرى أو امسح الفلاتر."
      onClearFilters={onClearFilters}
      footer={footer}
    />
  );
}
