import { Link } from 'react-router';
import { Timeline, type TimelineEvent } from '@/shared/components/Timeline';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { RelativeTime } from '@/shared/components/ui/RelativeTime';
import { ROUTES } from '@/shared/constants/routes';
import { ACTOR_ROLE_LABELS, BOOKING_EVENT_LABELS, SERVICE_TYPE_LABELS } from '../constants';
import type { AdminBookingDetails, BookingStatus } from '../schemas/booking.schema';
import { BookingPartyLink } from './BookingPartyLink';

export type BookingDetailBodyProps = {
  booking: AdminBookingDetails;
};

/** Points are held only while the booking is open; after that it is just the booking's price. */
const OPEN_STATUSES: BookingStatus[] = ['PENDING', 'ACCEPTED', 'DELIVERED', 'DISPUTED'];

/** Drawer content: summary list, the booking history and the dispute link when there is one. */
export function BookingDetailBody({ booking }: BookingDetailBodyProps) {
  const events: TimelineEvent[] = [...booking.events]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((event) => {
      const known = BOOKING_EVENT_LABELS[event.action];
      return {
        id: event.id,
        label: known?.label ?? event.action,
        tone: known?.tone,
        actorRole: ACTOR_ROLE_LABELS[event.actorRole],
        time: <RelativeTime value={event.createdAt} />,
      };
    });
  const isOpen = OPEN_STATUSES.includes(booking.status);

  const rows = [
    {
      term: 'الخدمة',
      value: (
        <span className="flex flex-col gap-0.5">
          <span className="font-medium">{booking.serviceTitle}</span>
          <span className="text-xs text-muted-foreground">
            {SERVICE_TYPE_LABELS[booking.serviceType]}
          </span>
        </span>
      ),
    },
    { term: 'المستلم', value: <BookingPartyLink person={booking.receiver} /> },
    { term: 'مقدم الخدمة', value: <BookingPartyLink person={booking.provider} /> },
    {
      term: isOpen ? 'النقاط المحجوزة' : 'سعر الحجز',
      value: <PointsAmount value={booking.pricePoints} className="font-bold" />,
    },
    { term: 'أُنشئ', value: <RelativeTime value={booking.createdAt} /> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 text-sm">
        {rows.map((row) => (
          <div key={row.term} className="contents">
            <dt className="text-muted-foreground">{row.term}</dt>
            <dd className="min-w-0">{row.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="booking-timeline-title" className="flex flex-col gap-2.5">
        <h3 id="booking-timeline-title" className="text-sm font-bold">
          الخط الزمني
        </h3>
        <Timeline events={events} size="sm" />
      </section>

      {booking.disputeId && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger-muted p-3.5 text-sm">
          <span className="font-medium">على هذا الحجز نزاع.</span>
          <Link
            to={ROUTES.admin.dispute(booking.disputeId)}
            className="rounded-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            عرض النزاع
          </Link>
        </div>
      )}
    </div>
  );
}
