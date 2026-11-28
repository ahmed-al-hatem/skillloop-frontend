import { Link } from 'react-router';
import { BarChart, type BarChartItem } from '@/shared/components/BarChart';
import { EmptyState } from '@/shared/components/EmptyState';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { ROUTES } from '@/shared/constants/routes';
import { formatNumber } from '@/shared/lib/format';
import { BOOKING_STATUS_LABELS } from '../constants';
import type { AdminDashboard } from '../schemas/dashboard.schema';

const knownStatuses = Object.keys(BOOKING_STATUS_LABELS) as (keyof typeof BOOKING_STATUS_LABELS)[];

/**
 * The 8 contract statuses in a fixed order (missing ones show 0), then any status the backend
 * adds later under its raw name, so a new value never disappears from the chart.
 */
function toItems(counts: AdminDashboard['bookingsByStatus']): BarChartItem[] {
  const known = knownStatuses.map<BarChartItem>((status) => ({
    id: status,
    label: BOOKING_STATUS_LABELS[status],
    value: counts[status] ?? 0,
    tone: status === 'DISPUTED' ? 'danger' : 'primary',
  }));
  const extra = Object.entries(counts)
    .filter(([status]) => !(status in BOOKING_STATUS_LABELS))
    .map<BarChartItem>(([status, value]) => ({ id: status, label: status, value }));
  return [...known, ...extra];
}

export type BookingsByStatusCardProps = {
  counts: AdminDashboard['bookingsByStatus'] | undefined;
  isLoading: boolean;
};

export function BookingsByStatusCard({ counts, isLoading }: BookingsByStatusCardProps) {
  const items = counts ? toItems(counts) : [];
  // Display total only (sum of the backend's counts), shown next to the title.
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <section
      aria-labelledby="bookings-chart-title"
      // overflow-x-clip: the hidden bar tooltips must not widen the page on phones.
      className="flex min-w-0 flex-col gap-4 overflow-x-clip rounded-xl border bg-surface p-5 lg:col-span-2"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="bookings-chart-title" className="font-bold">
            الحجوزات حسب الحالة
          </h2>
          {isLoading ? (
            <Skeleton className="mt-1.5 h-3 w-48" />
          ) : (
            <p className="mt-1 text-[13px] text-muted-foreground">
              العدد الحالي لكل حالة · المجموع <span dir="ltr">{formatNumber(total)}</span>
            </p>
          )}
        </div>
        <Link
          to={ROUTES.admin.bookings}
          className="text-[13px] font-semibold text-primary hover:underline"
        >
          كل الحجوزات
        </Link>
      </div>
      {!isLoading && total === 0 ? (
        <EmptyState title="لا توجد حجوزات بعد" description="ستظهر هنا أعداد الحجوزات لكل حالة." />
      ) : (
        <BarChart
          items={items}
          isLoading={isLoading}
          caption="الحجوزات حسب الحالة"
          categoryLabel="الحالة"
          valueLabel="الحجوزات"
        />
      )}
    </section>
  );
}
