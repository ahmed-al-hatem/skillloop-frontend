import { z } from 'zod';

/** Successful response envelope: `{ data, meta? }` (see docs/05-api-contract.md). */
export type ApiResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export const PaginationMetaSchema = z.object({
  page: z.number().int(),
  perPage: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
});
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

/** Paginated list envelope: `{ data: T[], meta: { page, perPage, total, totalPages } }`. */
export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

/** Builds a Zod schema for a paginated response whose items match `item`. */
export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({ data: z.array(item), meta: PaginationMetaSchema });

/** Error body returned by the backend for every 4xx/5xx. */
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  /** Field validation errors (422): `{ email: ['Already taken'] }`. */
  errors: z.record(z.string(), z.array(z.string())).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema> & { status: number };
