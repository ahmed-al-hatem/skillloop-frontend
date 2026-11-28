import { z } from 'zod';
import { listParamsShape } from '@/shared/hooks/useListParams';

/*
 * Copied from the backend's openapi.yaml (`AdminDispute` and its $refs).
 * Fields marked 🟡 are proposed in local-docs/admin/api/admin-endpoints.md and are NOT in the
 * contract yet, so they are `.optional()`: the UI must work without them.
 * BookingCore / BookingEvent / AdminPerson live here until the bookings and members features
 * own them; then they move there and are imported through that feature's index.ts.
 */

const dateTime = z.iso.datetime();

export const DisputeStatusSchema = z.enum(['OPEN', 'RESOLVED']);
export type DisputeStatus = z.infer<typeof DisputeStatusSchema>;

export const DisputeReasonSchema = z.enum([
  'PROVIDER_NO_SHOW',
  'NOT_DELIVERED',
  'POOR_QUALITY',
  'NOT_AS_DESCRIBED',
  'OTHER',
]);
export type DisputeReason = z.infer<typeof DisputeReasonSchema>;

/** REFUND_RECEIVER = receiverPercent 100, PAY_PROVIDER = 0, SPLIT = 1–99. */
export const DisputeDecisionSchema = z.enum(['REFUND_RECEIVER', 'PAY_PROVIDER', 'SPLIT']);
export type DisputeDecision = z.infer<typeof DisputeDecisionSchema>;

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
  /** 🟡 Proposed: disputes this member was part of. Not in openapi.yaml yet. */
  disputesCount: z.number().int().min(0).optional(),
});
export type AdminPerson = z.infer<typeof AdminPersonSchema>;

/** Booking fields shared by member and admin views (SRS 9.7). */
export const BookingCoreSchema = z.object({
  id: z.uuid(),
  status: BookingStatusSchema,
  serviceId: z.uuid(),
  serviceTitle: z.string(),
  serviceType: z.enum(['SESSION', 'DELIVERABLE']),
  categoryId: z.uuid(),
  durationMinutes: z.number().int().nullable(),
  deliveryDays: z.number().int().nullable(),
  /** Fixed price P (the held points), computed by the backend. */
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

/** Everything the admin needs to decide (DISP-05). Used by the list and the detail endpoints. */
export const AdminDisputeSchema = z.object({
  // Dispute
  id: z.uuid(),
  bookingId: z.uuid(),
  status: DisputeStatusSchema,
  reason: DisputeReasonSchema,
  description: z.string(),
  receiverImages: z.array(z.url()).max(5),
  providerResponse: z.string().nullable(),
  providerImages: z.array(z.url()).max(5),
  providerRespondedAt: dateTime.nullable(),
  decision: DisputeDecisionSchema.nullable(),
  receiverPercent: z.number().int().min(0).max(100).nullable(),
  /** Visible to both sides. */
  adminNote: z.string().nullable(),
  resolvedAt: dateTime.nullable(),
  createdAt: dateTime,
  // AdminDispute
  receiver: AdminPersonSchema,
  provider: AdminPersonSchema,
  booking: BookingCoreSchema,
  events: z.array(BookingEventSchema),
  resolvedBy: UserSummarySchema.nullable(),
  // 🟡 Proposed (plan §11.2), not in openapi.yaml yet.
  /** 🟡 Human code, e.g. «D-1042». */
  code: z.string().optional(),
  /** 🟡 Category of the booked service (shape proposed). */
  category: z.object({ id: z.uuid(), name: z.string() }).optional(),
  /** 🟡 When the provider's response window (48h) ends. */
  providerResponseDueAt: dateTime.optional(),
  /** 🟡 Backend says whether resolve is allowed now (response in, or window over). */
  canResolve: z.boolean().optional(),
});
export type AdminDispute = z.infer<typeof AdminDisputeSchema>;

/** `GET /admin/disputes` query. `status` defaults to OPEN on the backend; oldest first. */
export const DisputeListParamsSchema = z.object({
  ...listParamsShape,
  status: DisputeStatusSchema.default('OPEN'),
});
export type DisputeListParams = z.infer<typeof DisputeListParamsSchema>;
