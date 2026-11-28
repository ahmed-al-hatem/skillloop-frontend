import { useMemo } from 'react';
import { z } from 'zod';
import { cn } from '@/shared/lib/cn';

export type ClearFiltersButtonProps<S extends z.ZodObject> = {
  /** The same schema passed to `useListParams`. */
  schema: S;
  /** `params` from `useListParams`. */
  params: z.output<S>;
  /** Usually `reset` from `useListParams`. */
  onClear: () => void;
  /** Keys that are not filters. Defaults to paging. */
  ignore?: readonly string[];
  className?: string;
};

const PAGING_KEYS = ['page', 'pageSize'] as const;

const isEmpty = (value: unknown) => value === undefined || value === '';

/**
 * "مسح الفلاتر": rendered only while a filter differs from its schema default
 * (`q`, `status`…; paging is ignored), so it never shows on an unfiltered list.
 *
 *   const { params, reset } = useListParams(MemberListParamsSchema);
 *   <ClearFiltersButton schema={MemberListParamsSchema} params={params} onClear={reset} />
 */
export function ClearFiltersButton<S extends z.ZodObject>({
  schema,
  params,
  onClear,
  ignore = PAGING_KEYS,
  className,
}: ClearFiltersButtonProps<S>) {
  const defaults = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(schema.shape).map(([key, field]) => [
          key,
          z.safeParse(field, undefined).data,
        ]),
      ),
    [schema],
  );

  const values = params as Record<string, unknown>;
  const filtered = Object.keys(schema.shape).some((key) => {
    if (ignore.includes(key)) return false;
    const value = values[key];
    const fallback = defaults[key];
    return !(value === fallback || (isEmpty(value) && isEmpty(fallback)));
  });

  if (!filtered) return null;

  return (
    <button
      type="button"
      onClick={onClear}
      className={cn(
        'inline-flex h-10 shrink-0 items-center justify-center rounded-lg px-3.5 text-sm font-semibold text-foreground light:text-primary',
        'transition-colors duration-micro hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        'pointer-coarse:h-11',
        className,
      )}
    >
      مسح الفلاتر
    </button>
  );
}
