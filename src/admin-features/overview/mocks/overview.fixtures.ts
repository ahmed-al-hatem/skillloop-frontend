import { AdminDashboardSchema, type AdminDashboard } from '../schemas/dashboard.schema';

const HOUR = 60 * 60 * 1000;

/**
 * A busy day: numbers match the design (82% completion, 4 open disputes, 3 over 48h, oldest 61h).
 * Parsed with the schema so the fixture can never drift from it.
 */
export function buildDashboardFixture(now = Date.now()): AdminDashboard {
  return AdminDashboardSchema.parse({
    members: { total: 1240, verified: 1010, suspended: 3 },
    activeServices: 860,
    bookingsByStatus: {
      PENDING: 41,
      ACCEPTED: 77,
      DECLINED: 120,
      CANCELLED: 96,
      DELIVERED: 18,
      COMPLETED: 2310,
      DISPUTED: 4,
      RESOLVED: 37,
    },
    openDisputes: 4,
    pendingSuggestions: 9,
    pointsInCirculation: 58400,
    activeMembers30d: 640,
    pointsPerActiveMember: 91.25,
    completionRate: 82,
    newBookings7d: 156,
    pointsHeldTotal: 9350,
    openDisputesOver48h: 3,
    oldestOpenDisputeAt: new Date(now - 61 * HOUR).toISOString(),
    alerts: { lowCompletion: false, inflation: true, highHeldRatio: false, disputes: true },
    generatedAt: new Date(now).toISOString(),
  });
}

/** A brand-new platform (`?__mock=empty`): every count is zero, nothing needs attention. */
export function buildEmptyDashboardFixture(now = Date.now()): AdminDashboard {
  return AdminDashboardSchema.parse({
    members: { total: 0, verified: 0, suspended: 0 },
    activeServices: 0,
    bookingsByStatus: {},
    openDisputes: 0,
    pendingSuggestions: 0,
    pointsInCirculation: 0,
    activeMembers30d: 0,
    pointsPerActiveMember: 0,
    completionRate: 0,
    newBookings7d: 0,
    pointsHeldTotal: 0,
    openDisputesOver48h: 0,
    oldestOpenDisputeAt: null,
    alerts: { lowCompletion: false, inflation: false, highHeldRatio: false, disputes: false },
    generatedAt: new Date(now).toISOString(),
  });
}
