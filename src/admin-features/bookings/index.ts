// Public API of the admin bookings feature. Other code imports ONLY from '@/admin-features/bookings'.
// Mocks are never exported from here (they stay out of the production bundle).
export { bookingKeys } from './api/bookings.keys';
export { useBooking, useBookings } from './api/bookings.queries';
export { bookingsRoutes } from './routes';
export {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_VARIANTS,
  BOOKING_STATUSES,
  SERVICE_TYPE_LABELS,
} from './constants';
export {
  BookingListParamsSchema,
  BookingStatusSchema,
  type AdminBookingDetails,
  type AdminBookingListItem,
  type AdminPerson,
  type BookingCore,
  type BookingEvent,
  type BookingListParams,
  type BookingStatus,
  type ServiceType,
  type UserSummary,
} from './schemas/booking.schema';
