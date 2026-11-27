import type { AdminDashboard } from '../schemas/adminDashboard.schema';

/** Same numbers as the `AdminDashboard` example in openapi.yaml, plus the missing statuses. */
export const adminDashboard: AdminDashboard = {
  members: { total: 1240, verified: 1010, suspended: 3 },
  activeServices: 860,
  bookingsByStatus: {
    PENDING: 41,
    ACCEPTED: 77,
    DELIVERED: 18,
    DISPUTED: 4,
    COMPLETED: 2310,
    RESOLVED: 12,
    DECLINED: 96,
    CANCELLED: 143,
  },
  openDisputes: 4,
  pendingSuggestions: 9,
  pointsInCirculation: 58400,
  activeMembers30d: 640,
  pointsPerActiveMember: 91.25,
};
