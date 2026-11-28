import { z } from 'zod';
import { RoleSchema } from '@/features/auth';
import type { PageParams } from '@/shared/api/types';
import { listParamsShape } from '@/shared/hooks/useListParams';

/* Schemas copied from openapi.yaml (components/schemas, tag "Admin: Members"). */

export const UserStatusSchema = z.enum(['ACTIVE', 'SUSPENDED']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const TransactionTypeSchema = z.enum([
  'WELCOME_BONUS',
  'BOOKING_HOLD',
  'BOOKING_REFUND',
  'BOOKING_PAYMENT',
  'BOOKING_EARNING',
  'DISPUTE_REFUND',
  'DISPUTE_EARNING',
  'ADMIN_ADJUSTMENT',
]);
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

/** `WalletTransaction`: one wallet movement. Changes are signed (+/-). */
export const WalletTransactionSchema = z.object({
  id: z.uuid(),
  type: TransactionTypeSchema,
  availableChange: z.number().int(),
  heldChange: z.number().int(),
  availableAfter: z.number().int(),
  heldAfter: z.number().int(),
  bookingId: z.uuid().nullable(),
  note: z.string().nullable(),
  createdAt: z.iso.datetime(),
});
export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;

/** `AdminUserListItem`: one row of `GET /admin/users`. */
export const AdminUserListItemSchema = z.object({
  id: z.uuid(),
  fullName: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  role: RoleSchema,
  status: UserStatusSchema,
  emailVerified: z.boolean(),
  pointsAvailable: z.number().int(),
  pointsHeld: z.number().int(),
  ratingAvg: z.number(),
  createdAt: z.iso.datetime(),
  lastLoginAt: z.iso.datetime().nullable(),
  // 🟡 Not in openapi.yaml yet (plan §11.2): requested from the backend for the members table.
  photoUrl: z.url().nullable().optional(),
  ratingCount: z.number().int().optional(),
});
export type AdminUserListItem = z.infer<typeof AdminUserListItemSchema>;

/** `AdminUserDetails`: `GET /admin/users/{id}`, also returned by suspend / unsuspend. */
export const AdminUserDetailsSchema = AdminUserListItemSchema.extend({
  photoUrl: z.url().nullable(),
  bio: z.string().nullable(),
  city: z.string().nullable(),
  suspendedReason: z.string().nullable(),
  suspendedAt: z.iso.datetime().nullable(),
  completedBookingsCount: z.number().int(),
  activeServicesCount: z.number().int(),
  bookingsAsReceiverCount: z.number().int(),
  bookingsAsProviderCount: z.number().int(),
  /** Last 20 transactions. Bookings come from `GET /admin/bookings?userId=`. */
  recentTransactions: z.array(WalletTransactionSchema),
});
export type AdminUserDetails = z.infer<typeof AdminUserDetailsSchema>;

/** List filters + paging kept in the URL by `useListParams` (`/admin/members?q=&status=&page=`). */
export const MemberListUrlParamsSchema = z.object({
  ...listParamsShape,
  q: z.string().default(''),
  status: UserStatusSchema.optional(),
});

/** Query of `GET /admin/users`. `q` matches name, email or phone. */
export type MemberListParams = PageParams & {
  q?: string;
  status?: UserStatus;
  role?: z.infer<typeof RoleSchema>;
};
