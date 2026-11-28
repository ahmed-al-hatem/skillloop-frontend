import type { ReactNode } from 'react';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { formatDateTime } from '@/shared/lib/format';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_VARIANTS } from '../constants';
import type { AdminDispute } from '../schemas/dispute.schema';

export type BookingSummaryCardProps = { dispute: AdminDispute };

const SERVICE_TYPE_LABELS = { SESSION: 'جلسة', DELIVERABLE: 'تسليم عمل' } as const;

/** The booked service, its price, status, date and both parties. */
export function BookingSummaryCard({ dispute }: BookingSummaryCardProps) {
  const { booking } = dispute;
  const rows: [string, ReactNode][] = [
    ['الخدمة', booking.serviceTitle],
    ...(dispute.category ? [['التصنيف', dispute.category.name] as [string, ReactNode]] : []),
    ['النوع', SERVICE_TYPE_LABELS[booking.serviceType]],
    ['السعر', <PointsAmount value={booking.pricePoints} className="font-semibold" />],
    [
      'الحالة',
      <StatusBadge variant={BOOKING_STATUS_VARIANTS[booking.status]}>
        {BOOKING_STATUS_LABELS[booking.status]}
      </StatusBadge>,
    ],
    ...(booking.scheduledAt
      ? [['موعد الجلسة', formatDateTime(booking.scheduledAt)] as [string, ReactNode]]
      : []),
    ...(booking.dueAt
      ? [['موعد التسليم', formatDateTime(booking.dueAt)] as [string, ReactNode]]
      : []),
    ['المستلم', <bdi>{dispute.receiver.fullName}</bdi>],
    ['مقدم الخدمة', <bdi>{dispute.provider.fullName}</bdi>],
  ];

  return (
    <section
      aria-labelledby="summary-title"
      className="flex min-w-0 flex-col gap-3 rounded-xl border bg-surface p-5"
    >
      <h2 id="summary-title" className="text-[15px] font-bold">
        ملخص الحجز
      </h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-[13px]">
        {rows.map(([term, value]) => (
          <div key={term} className="contents">
            <dt className="text-muted-foreground">{term}</dt>
            <dd className="min-w-0">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
