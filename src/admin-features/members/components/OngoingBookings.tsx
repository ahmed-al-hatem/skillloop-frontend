import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_VARIANTS,
  useBookings,
  type BookingStatus,
} from '@/admin-features/bookings';
import { Ltr } from '@/shared/components/ui/Ltr';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';

const SHOWN = 5;
const page = (userId: string, status: BookingStatus) => ({
  page: 1,
  pageSize: SHOWN,
  userId,
  status,
});

export type OngoingBookingsProps = { memberId: string };

/**
 * The member's open bookings (either side), shown in the suspend dialog. The contract filters
 * one status at a time, so it asks once per open status; `meta.total` gives exact counts.
 * Renders nothing when there are none.
 */
export function OngoingBookings({ memberId }: OngoingBookingsProps) {
  const queries = [
    useBookings(page(memberId, 'PENDING')),
    useBookings(page(memberId, 'ACCEPTED')),
    useBookings(page(memberId, 'DELIVERED')),
    useBookings(page(memberId, 'DISPUTED')),
  ];

  if (queries.some((q) => q.isPending)) {
    return <p className="text-xs text-muted-foreground">جارٍ التحقق من الحجوزات الجارية…</p>;
  }
  if (queries.some((q) => q.isError)) {
    return <p className="text-xs text-muted-foreground">تعذّر تحميل الحجوزات الجارية.</p>;
  }

  const total = queries.reduce((sum, q) => sum + (q.data?.meta.total ?? 0), 0);
  if (total === 0) return null;
  const rows = queries.flatMap((q) => q.data?.data ?? []).slice(0, SHOWN);

  return (
    <div className="flex flex-col gap-2 text-foreground">
      <p className="font-semibold">
        الحجوزات الجارية <Ltr className="text-muted-foreground">({total})</Ltr>
      </p>
      <ul className="divide-y divide-border rounded-lg border border-border bg-background">
        {rows.map((b) => (
          <li key={b.id} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
            <span className="min-w-0 truncate">
              {b.code && (
                <>
                  <Ltr className="font-semibold">#{b.code}</Ltr>
                  {' · '}
                </>
              )}
              <bdi>{b.serviceTitle}</bdi>
            </span>
            <StatusBadge variant={BOOKING_STATUS_VARIANTS[b.status]}>
              {BOOKING_STATUS_LABELS[b.status]}
              {b.status === 'PENDING' && ' · سيُلغى'}
            </StatusBadge>
          </li>
        ))}
      </ul>
      {total > rows.length && (
        <p className="text-xs text-muted-foreground">و{total - rows.length} أخرى.</p>
      )}
    </div>
  );
}
