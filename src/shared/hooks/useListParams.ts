import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/shared/constants/pagination';

/**
 * `page` + `pageSize` for a list schema. Spread it into a feature's params schema:
 *
 *   const MemberListParamsSchema = z.object({
 *     ...listParamsShape,
 *     q: z.string().default(''),
 *     status: z.enum(['active', 'suspended']).optional(),
 *   });
 */
export const listParamsShape = {
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .refine((n) => PAGE_SIZE_OPTIONS.some((size) => size === n))
    .default(DEFAULT_PAGE_SIZE),
};

type Primitive = string | number | boolean | undefined;
type SetOptions = { replace?: boolean };

/** Every field parsed on its own: a bad value (`?page=abc`) falls back to that field's default. */
function parseParams(schema: z.ZodObject, searchParams: URLSearchParams) {
  const params: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(schema.shape)) {
    const raw = searchParams.get(key) ?? undefined;
    const parsed = z.safeParse(field, raw);
    params[key] = parsed.success ? parsed.data : z.safeParse(field, undefined).data;
  }
  return params;
}

/**
 * List params (page, filters) kept in the URL, so links are shareable and Back works.
 * - Reads and validates search params with `schema` (use `.default()` for each field).
 * - Define `schema` at module level so it keeps the same identity between renders.
 * - `setParams({ status })` resets `page` to 1 unless `page` is part of the change.
 * - Values equal to their default are removed from the URL (`/members`, not `/members?page=1`).
 * - Search params not in the schema (e.g. `?tab=`) are kept.
 */
export function useListParams<S extends z.ZodObject>(schema: S) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.toString();

  const params = useMemo(
    () => parseParams(schema, new URLSearchParams(query)) as z.output<S>,
    [schema, query],
  );

  const setParams = useCallback(
    (patch: Partial<z.output<S>>, options?: SetOptions) => {
      setSearchParams(
        (prev) => {
          const defaults = parseParams(schema, new URLSearchParams());
          const next: Record<string, unknown> = { ...parseParams(schema, prev), ...patch };
          if ('page' in schema.shape && !('page' in patch)) next.page = defaults.page;

          const result = new URLSearchParams(prev);
          for (const key of Object.keys(schema.shape)) {
            const value = next[key] as Primitive;
            if (value === undefined || value === '' || value === defaults[key]) result.delete(key);
            else result.set(key, String(value));
          }
          return result;
        },
        { replace: options?.replace },
      );
    },
    [schema, setSearchParams],
  );

  const setPage = useCallback(
    (page: number) => setParams({ page } as unknown as Partial<z.output<S>>),
    [setParams],
  );

  const reset = useCallback(() => {
    setSearchParams((prev) => {
      const result = new URLSearchParams(prev);
      Object.keys(schema.shape).forEach((key) => result.delete(key));
      return result;
    });
  }, [schema, setSearchParams]);

  return { params, setParams, setPage, reset };
}
