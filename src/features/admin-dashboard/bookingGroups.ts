import type { AdminDashboard, BookingStatus } from './schemas/adminDashboard.schema';
import { dashboardStrings as t } from './strings';

type BookingGroupKey = keyof typeof t.bookings.groups;

export type BookingGroup = {
  key: BookingGroupKey;
  statuses: BookingStatus[];
  /** MUI theme color path. */
  color: string;
};

/**
 * The 8 booking statuses (SRS 9.2) grouped for the dashboard rings, so the chart stays readable.
 * Each group still lists its statuses with their own counts in the legend.
 */
export const BOOKING_GROUPS: BookingGroup[] = [
  { key: 'inProgress', statuses: ['PENDING', 'ACCEPTED', 'DELIVERED'], color: 'primary.main' },
  { key: 'done', statuses: ['COMPLETED', 'RESOLVED'], color: 'secondary.main' },
  { key: 'disputed', statuses: ['DISPUTED'], color: 'warning.main' },
  { key: 'closed', statuses: ['DECLINED', 'CANCELLED'], color: 'text.disabled' },
];

/** Count of one status; a status missing from the API response counts as 0. */
export const statusCount = (
  bookingsByStatus: AdminDashboard['bookingsByStatus'],
  status: BookingStatus,
) => bookingsByStatus[status] ?? 0;

export const groupCount = (
  bookingsByStatus: AdminDashboard['bookingsByStatus'],
  group: BookingGroup,
) => group.statuses.reduce((sum, status) => sum + statusCount(bookingsByStatus, status), 0);
