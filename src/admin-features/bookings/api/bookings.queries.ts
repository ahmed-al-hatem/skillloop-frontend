import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { BookingListParams } from '../schemas/booking.schema';
import { getBooking, getBookings } from './bookings.api';
import { bookingKeys } from './bookings.keys';

/** Bookings page. Keeps the previous page on screen while the next one loads. */
export function useBookings(params: BookingListParams) {
  return useQuery({
    queryKey: bookingKeys.list(params),
    queryFn: () => getBookings(params),
    placeholderData: keepPreviousData,
  });
}

/** One booking with its parties and history. */
export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: bookingKeys.detail(id ?? ''),
    queryFn: () => getBooking(id ?? ''),
    enabled: Boolean(id),
  });
}
