import { z } from 'zod';

/*
 * Response shapes from the backend's openapi.yaml (see docs/05-api-contract.md):
 *   - single object  → returned as is, no envelope:      `Me`
 *   - list           → `{ data: T[] }`                   use `listSchema(item)`
 *   - paginated list → `{ data: T[], meta: PageMeta }`   use `paginatedSchema(item)`
 */

/** `meta` of a paginated list. Query with `?page=1&pageSize=20` (pageSize max 50). */
export const PageMetaSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
});
export type PageMeta = z.infer<typeof PageMetaSchema>;

/** Query params every paginated endpoint accepts. */
export type PageParams = {
  page?: number;
  pageSize?: number;
};

/** Number of pages for a `PageMeta` (the backend doesn't send it). */
export const totalPages = ({ total, pageSize }: PageMeta) =>
  Math.max(1, Math.ceil(total / pageSize));

/** Builds a Zod schema for an unpaginated list response: `{ data: T[] }`. */
export const listSchema = <T extends z.ZodType>(item: T) => z.object({ data: z.array(item) });

/** Builds a Zod schema for a paginated list response: `{ data: T[], meta: PageMeta }`. */
export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({ data: z.array(item), meta: PageMetaSchema });

/** Paginated list type, e.g. `Paginated<Service>`. */
export type Paginated<T> = {
  data: T[];
  meta: PageMeta;
};

/** One invalid field in a `VALIDATION_ERROR`. */
export const FieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});
export type FieldError = z.infer<typeof FieldErrorSchema>;

/**
 * Error body returned by the backend for every 4xx/5xx:
 * `{ error: { code, message, details? } }`. `code` is stable (use it in code),
 * `message` is already translated (show it), `details` only for VALIDATION_ERROR.
 */
export const ApiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(FieldErrorSchema).optional(),
  }),
});

/** What the frontend keeps from a failed request (see `ApiRequestError`). */
export type ApiError = {
  code: string;
  message: string;
  status: number;
  details?: FieldError[];
};
