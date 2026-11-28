import type { BookingListParams } from '../schemas/booking.schema';

/** Every admin key starts with `'admin'`, so logout can remove them all at once. */
export const bookingKeys = {
  all: ['admin', 'bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (params: BookingListParams) => [...bookingKeys.lists(), params] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};
