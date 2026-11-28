import { z } from 'zod';

/** `AdminDashboard.members` in `openapi.yaml`. */
export const AdminDashboardMembersSchema = z.object({
  total: z.number().int(),
  verified: z.number().int(),
  suspended: z.number().int(),
});
export type AdminDashboardMembers = z.infer<typeof AdminDashboardMembersSchema>;

/**
 * Proposed `alerts` flags (🟡, `local-docs/admin/api/admin-endpoints.md` #1). The backend owns
 * the thresholds (completion < 70%, inflation > 20%, held > 30%, > 10 disputes or oldest > 72h).
 */
export const AdminDashboardAlertsSchema = z.object({
  lowCompletion: z.boolean(),
  inflation: z.boolean(),
  highHeldRatio: z.boolean(),
  disputes: z.boolean(),
});
export type AdminDashboardAlerts = z.infer<typeof AdminDashboardAlertsSchema>;

/**
 * `GET /admin/dashboard` response (`AdminDashboard`, bare object, no envelope).
 * All numbers are computed by the backend; the UI only displays them.
 */
export const AdminDashboardSchema = z.object({
  members: AdminDashboardMembersSchema,
  activeServices: z.number().int(),
  /**
   * Count per `BookingStatus`. The contract types it as `additionalProperties: integer`, so keys
   * stay plain strings: a status added later by the backend must not break parsing.
   */
  bookingsByStatus: z.record(z.string(), z.number().int()),
  openDisputes: z.number().int(),
  pendingSuggestions: z.number().int(),
  /** Sum of available + held points of all members. */
  pointsInCirculation: z.number().int(),
  /** Members with a booking in the last 30 days. */
  activeMembers30d: z.number().int(),
  /** Inflation indicator. */
  pointsPerActiveMember: z.number(),

  /*
   * 🟡 Proposed fields (plan §11.2), NOT in `openapi.yaml` yet. Optional until the backend ships
   * them; the UI renders each one only when present. Drop `.optional()` once they are in the contract.
   */
  /** Completed ÷ finished bookings, 0–100. */
  completionRate: z.number().min(0).max(100).optional(),
  newBookings7d: z.number().int().optional(),
  /** Part of `pointsInCirculation` currently held in bookings. */
  pointsHeldTotal: z.number().int().optional(),
  openDisputesOver48h: z.number().int().optional(),
  oldestOpenDisputeAt: z.iso.datetime().nullable().optional(),
  alerts: AdminDashboardAlertsSchema.optional(),
  /** When the backend computed these numbers («آخر تحديث»). */
  generatedAt: z.iso.datetime().optional(),
});
export type AdminDashboard = z.infer<typeof AdminDashboardSchema>;

/** Sidebar badge counts, picked from the dashboard. */
export type AdminCounters = Pick<AdminDashboard, 'openDisputes' | 'pendingSuggestions'>;
