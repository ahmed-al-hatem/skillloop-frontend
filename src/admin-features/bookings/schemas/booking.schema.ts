import { z } from 'zod';
import { listParamsShape } from '@/shared/hooks/useListParams';

/*
 * Copied from the backend's openapi.yaml (`AdminBookingListItem`, `AdminBookingDetails` and
 * their $refs). This feature owns the booking schemas; other admin features import them from
 * `@/admin-features/bookings`. Fields marked 🟡 are proposed (plan §11.2) and NOT in the
 * contract yet, so they are `.optional()`: the UI must work without them.
 */

const dateTime = z.iso.datetime();

/** SRS 9.2. Final statuses: DECLINED, CANCELLED, COMPLETED, RESOLVED. */
export const BookingStatusSchema = z.enum([
  'PENDING',
  'ACCEPTED',
  'DECLINED',
  'CANCELLED',
  'DELIVERED',
  'COMPLETED',
  'DISPUTED',
  'RESOLVED',
]);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

/** SESSION = live time together (minutes). DELIVERABLE = finished work (delivery days). */
export const ServiceTypeSchema = z.enum(['SESSION', 'DELIVERABLE']);
export type ServiceType = z.infer<typeof ServiceTypeSchema>;

/** Small public card of a member. Never contains email or phone. */
export const UserSummarySchema = z.object({
  id: z.uuid(),
  fullName: z.string(),
  photoUrl: z.url().nullable(),
  ratingAvg: z.number(),
  ratingCount: z.number().int(),
});
export type UserSummary = z.infer<typeof UserSummarySchema>;

/** Member card for admins (includes contact details). */
export const AdminPersonSchema = UserSummarySchema.extend({
  email: z.email(),
  phone: z.string().nullable(),
});
export type AdminPerson = z.infer<typeof AdminPersonSchema>;

/** One row of `GET /admin/bookings`. */
export const AdminBookingListItemSchema = z.object({
  id: z.uuid(),
  status: BookingStatusSchema,
  serviceTitle: z.string(),
  serviceType: ServiceTypeSchema,
  /** Fixed price P (held while the booking is open), computed by the backend. */
  pricePoints: z.number().int(),
  receiver: UserSummarySchema,
  provider: UserSummarySchema,
  createdAt: dateTime,
  updatedAt: dateTime,
  /** 🟡 Human code, e.g. «B-8812». */
  code: z.string().optional(),
});
export type AdminBookingListItem = z.infer<typeof AdminBookingListItemSchema>;

/** Booking fields shared by member and admin views (SRS 9.7). */
export const BookingCoreSchema = z.object({
  id: z.uuid(),
  status: BookingStatusSchema,
  serviceId: z.uuid(),
  /** Snapshot at booking time. */
  serviceTitle: z.string(),
  serviceType: ServiceTypeSchema,
  categoryId: z.uuid(),
  durationMinutes: z.number().int().nullable(),
  deliveryDays: z.number().int().nullable(),
  pricePoints: z.number().int(),
  note: z.string(),
  scheduledAt: dateTime.nullable(),
  dueAt: dateTime.nullable(),
  deliveryNote: z.string().nullable(),
  deliveryLinks: z.array(z.url()).max(5),
  changeRequestsCount: z.number().int().min(0).max(2),
  lastChangeRequestNote: z.string().nullable(),
  declineReason: z.string().nullable(),
  cancelledBy: z.enum(['RECEIVER', 'PROVIDER', 'SYSTEM']).nullable(),
  cancelReason: z.string().nullable(),
  expiresAt: dateTime.nullable(),
  autoCompleteAt: dateTime.nullable(),
  acceptedAt: dateTime.nullable(),
  deliveredAt: dateTime.nullable(),
  completedAt: dateTime.nullable(),
  cancelledAt: dateTime.nullable(),
  createdAt: dateTime,
  updatedAt: dateTime,
});
export type BookingCore = z.infer<typeof BookingCoreSchema>;

/** One line of the booking history (BOOK-15). */
export const BookingEventSchema = z.object({
  id: z.uuid(),
  /** CREATED, ACCEPTED, …, DISPUTED, RESOLVED — a free string in the contract. */
  action: z.string(),
  fromStatus: BookingStatusSchema.nullable(),
  toStatus: BookingStatusSchema,
  actorRole: z.enum(['RECEIVER', 'PROVIDER', 'SYSTEM', 'ADMIN']),
  actor: UserSummarySchema.nullable(),
  note: z.string().nullable(),
  createdAt: dateTime,
});
export type BookingEvent = z.infer<typeof BookingEventSchema>;

/** `GET /admin/bookings/{id}`: any booking with its history (read-only). */
export const AdminBookingDetailsSchema = BookingCoreSchema.extend({
  receiver: AdminPersonSchema,
  provider: AdminPersonSchema,
  disputeId: z.uuid().nullable(),
  events: z.array(BookingEventSchema),
  /** 🟡 Human code, e.g. «B-8812». */
  code: z.string().optional(),
});
export type AdminBookingDetails = z.infer<typeof AdminBookingDetailsSchema>;

/**
 * `GET /admin/bookings` query. One `status` only; 🟡 `q` and multi-value `status` are not in the
 * contract yet, so they are left out (the search box stays hidden).
 */
export const BookingListParamsSchema = z.object({
  ...listParamsShape,
  status: BookingStatusSchema.optional(),
  /** Bookings where this member is either side. */
  userId: z.uuid().optional(),
  serviceId: z.uuid().optional(),
});
export type BookingListParams = z.infer<typeof BookingListParamsSchema>;
