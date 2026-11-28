import { http, HttpResponse } from 'msw';
import { z } from 'zod';
import { env } from '@/config/env';
import { apiError, paginate, withScenario } from '@/mocks/utils';
import {
  AdminBookingDetailsSchema,
  BookingStatusSchema,
  UserSummarySchema,
  type AdminBookingDetails,
  type AdminBookingListItem,
} from '../schemas/booking.schema';
import { bookingFixtures } from './bookings.fixtures';

const BASE = `${env.API_URL}/admin/bookings`;

// Parsed once so the fixtures can never drift from the schema.
const store = z.array(AdminBookingDetailsSchema).parse(bookingFixtures);

const toListItem = (b: AdminBookingDetails): AdminBookingListItem => ({
  id: b.id,
  code: b.code,
  status: b.status,
  serviceTitle: b.serviceTitle,
  serviceType: b.serviceType,
  pricePoints: b.pricePoints,
  receiver: UserSummarySchema.parse(b.receiver),
  provider: UserSummarySchema.parse(b.provider),
  createdAt: b.createdAt,
  updatedAt: b.updatedAt,
});

export const bookingsAdminHandlers = [
  http.get(BASE, async ({ request }) => {
    const { response, empty } = await withScenario(request);
    if (response) return response;

    const query = new URL(request.url).searchParams;
    const rawStatus = query.get('status');
    const status = rawStatus === null ? null : BookingStatusSchema.safeParse(rawStatus);
    if (status && !status.success) {
      return apiError('VALIDATION_ERROR', 400, [{ field: 'status', message: 'Invalid status' }]);
    }
    const userId = query.get('userId');
    const serviceId = query.get('serviceId');

    const items = empty
      ? []
      : store
          .filter((b) => !status || b.status === status.data)
          .filter((b) => !userId || b.receiver.id === userId || b.provider.id === userId)
          .filter((b) => !serviceId || b.serviceId === serviceId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map(toListItem);
    return HttpResponse.json(paginate(items, request.url));
  }),

  http.get(`${BASE}/:id`, async ({ request, params }) => {
    const { response } = await withScenario(request);
    if (response) return response;

    const booking = store.find((b) => b.id === params.id);
    return booking ? HttpResponse.json(booking) : apiError('NOT_FOUND', 404);
  }),
];
