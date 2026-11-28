import { z } from 'zod';
import { listParamsShape } from '@/shared/hooks/useListParams';

/*
 * Copied from the backend's openapi.yaml (`Service` = `ServiceCard` + details, tag "Admin: Content").
 * Fields marked 🟡 are proposed in plan §11.2 and are NOT in the contract yet, so they are
 * `.optional()`: the UI must work without them.
 */

export const ServiceStatusSchema = z.enum(['ACTIVE', 'PAUSED', 'ARCHIVED']);
export type ServiceStatus = z.infer<typeof ServiceStatusSchema>;

export const ServiceTypeSchema = z.enum(['SESSION', 'DELIVERABLE']);
export type ServiceType = z.infer<typeof ServiceTypeSchema>;

/**
 * `UserSummary`. Same shape as the disputes feature's copy, which does not export it; both move to
 * the members feature's index.ts once it owns the person schemas.
 */
export const UserSummarySchema = z.object({
  id: z.uuid(),
  fullName: z.string(),
  photoUrl: z.url().nullable(),
  ratingAvg: z.number(),
  ratingCount: z.number().int(),
});
export type UserSummary = z.infer<typeof UserSummarySchema>;

export const CategorySchema = z.object({
  id: z.uuid(),
  nameAr: z.string(),
  nameEn: z.string(),
  icon: z.string().nullable(),
  isOther: z.boolean(),
  sortOrder: z.number().int(),
});
export type Category = z.infer<typeof CategorySchema>;

/** `Service`: one row of `GET /admin/services`, also returned by archive. */
export const ServiceSchema = z.object({
  // ServiceCard
  id: z.uuid(),
  title: z.string(),
  type: ServiceTypeSchema,
  category: CategorySchema,
  /** Only for the 'Other' category. */
  customCategoryName: z.string().nullable(),
  durationMinutes: z.number().int().nullable(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).nullable(),
  mode: z.enum(['ONLINE', 'IN_PERSON', 'BOTH']).nullable(),
  deliveryDays: z.number().int().nullable(),
  complexity: z.enum(['SIMPLE', 'MEDIUM', 'COMPLEX']).nullable(),
  pricePoints: z.number().int(),
  ratingAvg: z.number(),
  ratingCount: z.number().int(),
  completedCount: z.number().int(),
  provider: UserSummarySchema,
  // Service
  description: z.string(),
  status: ServiceStatusSchema,
  suggestedPoints: z.number().int(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  // 🟡 Proposed (plan §11.2), not in openapi.yaml yet.
  /** 🟡 All bookings of this service. */
  bookingsCount: z.number().int().min(0).optional(),
  /** 🟡 Hidden from the market because the provider is suspended. */
  isHidden: z.boolean().optional(),
});
export type Service = z.infer<typeof ServiceSchema>;

/**
 * Query of `GET /admin/services`, kept in the URL. `q` matches title or provider name.
 * 🟡 `providerStatus` is proposed (plan §11.2) and left out until the contract has it.
 */
export const ServiceListParamsSchema = z.object({
  ...listParamsShape,
  q: z.string().default(''),
  status: ServiceStatusSchema.optional(),
  categoryId: z.uuid().optional(),
  providerId: z.uuid().optional(),
});
export type ServiceListParams = z.infer<typeof ServiceListParamsSchema>;

export const ARCHIVE_REASON_MIN = 5;
export const ARCHIVE_REASON_MAX = 300;

/** `ArchiveRequest`: body of `POST /admin/services/{id}/archive`. The reason is sent to the provider. */
export const ArchiveRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(ARCHIVE_REASON_MIN, `السبب ${ARCHIVE_REASON_MIN} أحرف على الأقل`)
    .max(ARCHIVE_REASON_MAX, `السبب ${ARCHIVE_REASON_MAX} حرف كحد أقصى`),
});
export type ArchiveRequest = z.infer<typeof ArchiveRequestSchema>;
