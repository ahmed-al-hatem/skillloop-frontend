import { api } from '@/shared/api/client';
import { paginatedSchema, type Paginated } from '@/shared/api/types';
import {
  AdminBookingDetailsSchema,
  AdminBookingListItemSchema,
  type AdminBookingDetails,
  type AdminBookingListItem,
  type BookingListParams,
} from '../schemas/booking.schema';

/** `GET /admin/bookings` — paginated, filtered by `status`, `userId` (either side), `serviceId`. */
export async function getBookings(
  params: BookingListParams,
): Promise<Paginated<AdminBookingListItem>> {
  const res = await api.get('/admin/bookings', { params });
  return paginatedSchema(AdminBookingListItemSchema).parse(res.data);
}

/** `GET /admin/bookings/{id}` — bare object with the parties and the history. */
export async function getBooking(id: string): Promise<AdminBookingDetails> {
  const res = await api.get(`/admin/bookings/${id}`);
  return AdminBookingDetailsSchema.parse(res.data);
}
