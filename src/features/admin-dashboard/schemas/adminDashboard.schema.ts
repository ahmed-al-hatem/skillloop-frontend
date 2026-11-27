import { z } from 'zod';

/** Booking statuses, in lifecycle order (openapi `BookingStatus`, SRS 9.2). */
export const BOOKING_STATUSES = [
  'PENDING',
  'ACCEPTED',
  'DELIVERED',
  'DISPUTED',
  'COMPLETED',
  'RESOLVED',
  'DECLINED',
  'CANCELLED',
] as const;
export const BookingStatusSchema = z.enum(BOOKING_STATUSES);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

const count = z.number().int().min(0);

/** `GET /admin/dashboard` → openapi `AdminDashboard` (SRS ADM-01). Returned without an envelope. */
export const AdminDashboardSchema = z.object({
  members: z.object({
    total: count,
    verified: count,
    suspended: count,
  }),
  activeServices: count,
  /** Count per booking status. Statuses with no bookings may be missing → treat as 0. */
  bookingsByStatus: z.partialRecord(BookingStatusSchema, count),
  openDisputes: count,
  pendingSuggestions: count,
  /** Sum of available + held points of all members. */
  pointsInCirculation: count,
  /** Members with a booking in the last 30 days. */
  activeMembers30d: count,
  /** Inflation indicator (SRS 3.6). Decimal. */
  pointsPerActiveMember: z.number().min(0),
});
export type AdminDashboard = z.infer<typeof AdminDashboardSchema>;
