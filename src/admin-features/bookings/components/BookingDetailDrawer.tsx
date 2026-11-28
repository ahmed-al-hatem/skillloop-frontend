import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { ApiRequestError } from '@/shared/api/client';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { Drawer } from '@/shared/components/ui/Drawer';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { ROUTES } from '@/shared/constants/routes';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useBooking } from '../api/bookings.queries';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_VARIANTS } from '../constants';
import { bookingLabel } from '../lib/bookingLabel';
import { BookingDetailBody } from './BookingDetailBody';
import { BookingDetailSkeleton } from './BookingDetailSkeleton';

/**
 * `/admin/bookings/:id`: read-only booking detail in a drawer over the list. Closing goes back
 * to the list with its filters (browser Back when it was opened from the list).
 */
export function BookingDetailDrawer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const booking = useBooking(id);
  const isOnline = useOnlineStatus();
  const { data } = booking;
  // Offline before the first load: the query is paused, so say why instead of a skeleton.
  const isPausedEmpty = booking.isPending && booking.fetchStatus === 'paused';
  const isNotFound = booking.error instanceof ApiRequestError && booking.error.status === 404;
  const fromList = (location.state as { fromList?: boolean } | null)?.fromList === true;

  const close = () => {
    if (fromList) void navigate(-1);
    else void navigate({ pathname: ROUTES.admin.bookings, search: location.search });
  };

  return (
    <Drawer
      open
      onOpenChange={(open) => !open && close()}
      title={
        data ? (
          <>
            الحجز{' '}
            <bdi dir="ltr" className="font-latin">
              {bookingLabel(data)}
            </bdi>
          </>
        ) : (
          'تفاصيل الحجز'
        )
      }
      description={
        data && (
          <StatusBadge variant={BOOKING_STATUS_VARIANTS[data.status]}>
            {BOOKING_STATUS_LABELS[data.status]}
          </StatusBadge>
        )
      }
    >
      {data ? (
        <BookingDetailBody booking={data} />
      ) : isNotFound ? (
        <EmptyState
          title="غير موجود"
          description="هذا الحجز غير موجود أو أن الرابط غير صحيح."
          action={
            <Link
              to={{ pathname: ROUTES.admin.bookings, search: location.search }}
              className="rounded-sm font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              العودة إلى الحجوزات
            </Link>
          }
        />
      ) : booking.isError || isPausedEmpty ? (
        <ErrorState
          error={booking.error}
          message={
            isPausedEmpty
              ? 'لا يوجد اتصال بالإنترنت. ستظهر تفاصيل الحجز عند عودة الاتصال.'
              : undefined
          }
          onRetry={isOnline ? () => void booking.refetch() : undefined}
          isRetrying={booking.isRefetching}
        />
      ) : (
        <BookingDetailSkeleton />
      )}
    </Drawer>
  );
}
