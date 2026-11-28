import type { StatusBadgeVariant } from '@/shared/components/ui/StatusBadge';
import type { BookingStatus, ServiceType } from './schemas/booking.schema';

/**
 * The 8 real `BookingStatus` values from `openapi.yaml`, in lifecycle order (the design's
 * «قيد التنفيذ» does not exist in the contract, plan §11.3).
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

/** Badge colour per status (the label always goes with it). */
export const BOOKING_STATUS_VARIANTS = {
  PENDING: 'warning',
  ACCEPTED: 'info',
  DELIVERED: 'info',
  COMPLETED: 'success',
  DISPUTED: 'danger',
  RESOLVED: 'success',
  CANCELLED: 'neutral',
  DECLINED: 'neutral',
} as const satisfies Record<BookingStatus, StatusBadgeVariant>;

/** Statuses in display order (filters, charts). */
export const BOOKING_STATUSES = Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[];

export const SERVICE_TYPE_LABELS = {
  SESSION: 'جلسة',
  DELIVERABLE: 'تسليم عمل',
} as const satisfies Record<ServiceType, string>;
