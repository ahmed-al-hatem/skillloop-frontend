import { totalPages, type PageMeta } from '@/shared/api/types';
import { cn } from '@/shared/lib/cn';

export type PaginationProps = {
  meta: PageMeta;
  onPageChange: (page: number) => void;
  className?: string;
};

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * Pages to show: first, last, current ±1, and the first/last 3 when near an edge.
 * A gap of one page shows that page instead of "…".
 * 196 pages: page 1 → 1 2 3 … 196 · page 50 → 1 … 49 50 51 … 196.
 */
function getPageItems(page: number, pageCount: number): PageItem[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  if (page <= 3) [2, 3].forEach((p) => pages.add(p));
  if (page >= pageCount - 2) [pageCount - 1, pageCount - 2].forEach((p) => pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  const items: PageItem[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev === 2) items.push(p - 1);
    if (prev !== undefined && p - prev > 2)
      items.push(p < page ? 'ellipsis-start' : 'ellipsis-end');
    items.push(p);
  });
  return items;
}

// 34 px visible box (design) with a 44 px hit area from the ::before overlay.
const itemClass = cn(
  'relative inline-flex h-8.5 min-w-8.5 items-center justify-center rounded-md px-2',
  'font-latin text-[13px] tabular-nums transition-colors duration-micro',
  "before:absolute before:-inset-1.25 before:content-['']",
  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
);
const idleClass = 'border border-border bg-surface text-foreground hover:bg-accent';

// Chevrons point "back"/"forward" in LTR; `rtl:-scale-x-100` mirrors them for Arabic.
const chevron = (path: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-4 rtl:-scale-x-100"
  >
    <path d={path} />
  </svg>
);

/** Numbered pagination for a paginated list. `meta` comes straight from the API response. */
export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  const pageCount = totalPages(meta);
  const page = Math.min(meta.page, pageCount);

  const arrowClass = cn(
    itemClass,
    idleClass,
    'disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-50 disabled:hover:bg-surface',
  );

  return (
    <nav aria-label="ترقيم الصفحات" className={cn('flex items-center gap-1.5', className)}>
      <button
        type="button"
        aria-label="الصفحة السابقة"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={arrowClass}
      >
        {chevron('M15 6l-6 6 6 6')}
      </button>

      {getPageItems(page, pageCount).map((item) =>
        typeof item === 'number' ? (
          <button
            key={item}
            type="button"
            aria-label={`الصفحة ${item}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => item !== page && onPageChange(item)}
            className={cn(
              itemClass,
              'max-sm:hidden',
              item === page ? 'bg-foreground font-semibold text-background' : idleClass,
            )}
          >
            {item}
          </button>
        ) : (
          <span key={item} aria-hidden="true" className="px-1 text-muted-foreground max-sm:hidden">
            …
          </span>
        ),
      )}

      {/* Phones: "100 / 196" instead of the numbered buttons, so the footer stays on one row. */}
      <p className="px-2 font-latin text-[13px] text-foreground tabular-nums sm:hidden">
        <span className="sr-only">الصفحة </span>
        <bdi dir="ltr">
          {page} / {pageCount}
        </bdi>
      </p>

      <button
        type="button"
        aria-label="الصفحة التالية"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className={arrowClass}
      >
        {chevron('M9 6l6 6-6 6')}
      </button>
    </nav>
  );
}
