import type { BookingStatus } from '@/admin-features/disputes';

/**
 * The 8 real `BookingStatus` values from `openapi.yaml`, in the chart's order (the design's
 * "قيد التنفيذ" does not exist in the contract, plan §11.3).
 */
export const BOOKING_STATUS_LABELS = {
  PENDING: 'معلق',
  ACCEPTED: 'مقبول',
  DELIVERED: 'مُسلَّم',
  COMPLETED: 'مكتمل',
  DISPUTED: 'متنازع عليه',
  RESOLVED: 'تمّ الحل',
  CANCELLED: 'ملغى',
  DECLINED: 'مرفوض',
} as const satisfies Record<BookingStatus, string>;

/** How many open disputes the overview lists (oldest first). */
export const OLDEST_DISPUTES_COUNT = 3;
