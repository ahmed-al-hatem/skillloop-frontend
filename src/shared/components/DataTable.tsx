import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { cn } from '@/shared/lib/cn';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { Button } from './ui/Button';
import { Skeleton } from './ui/Skeleton';
import { Table } from './ui/Table';
import { TableBody } from './ui/TableBody';
import { TableCell } from './ui/TableCell';
import { TableHead } from './ui/TableHead';
import { TableHeader } from './ui/TableHeader';
import { TableRow } from './ui/TableRow';
import type { TableAlign } from './ui/tableAlign';

export type DataTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Tailwind width class for the column, e.g. `'w-40'`. */
  width?: string;
  align?: TableAlign;
  /** Header read by screen readers only (e.g. an actions column). On cards it has no label. */
  headerHidden?: boolean;
};

export type DataTableProps<T> = {
  /** Accessible name of the table, e.g. "قائمة الأعضاء". */
  label: string;
  columns: DataTableColumn<T>[];
  data: T[] | undefined;
  getRowId: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  /** Usually `refetch` from the query. */
  onRetry?: () => void;
  emptyTitle: string;
  emptyDescription?: string;
  /** True when filters differ from the defaults: an empty result shows the filtered variant. */
  isFiltered?: boolean;
  filteredTitle?: string;
  filteredDescription?: string;
  /** Shows a "مسح الفلاتر" button in the filtered-empty state. */
  onClearFilters?: () => void;
  /** Whole row opens something. Clicks on links/buttons inside the row are left alone. */
  onRowClick?: (row: T) => void;
  /** Whole row navigates to this path. Keep a real link in a cell too. */
  getRowHref?: (row: T) => string;
  /** Rendered under the rows inside the card, e.g. pagination. */
  footer?: ReactNode;
  skeletonRows?: number;
  className?: string;
};

const INTERACTIVE = 'a, button, input, select, textarea, [role="button"]';
const skeletonWidths = ['w-3/5', 'w-2/5', 'w-1/2', 'w-4/5', 'w-1/3', 'w-2/3'];

/**
 * List view for server data: table on ≥ 768 px, one card per row below that.
 * Handles loading (skeleton rows), error (+ retry), empty and filtered-empty states.
 */
export function DataTable<T>({
  label,
  columns,
  data,
  getRowId,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  emptyTitle,
  emptyDescription,
  isFiltered = false,
  filteredTitle = 'لا توجد نتائج مطابقة',
  filteredDescription = 'جرّب كلمة أخرى أو امسح الفلاتر.',
  onClearFilters,
  onRowClick,
  getRowHref,
  footer,
  skeletonRows = 6,
  className,
}: DataTableProps<T>) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const navigate = useNavigate();
  const rows = data ?? [];
  const isEmpty = !isLoading && !isError && rows.length === 0;

  const activate = (row: T) => {
    if (onRowClick) onRowClick(row);
    else if (getRowHref) void navigate(getRowHref(row));
  };
  const rowProps = (row: T) =>
    onRowClick || getRowHref
      ? {
          tabIndex: 0,
          className:
            'cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
          onClick: (e: MouseEvent<HTMLElement>) => {
            if (!(e.target as HTMLElement).closest(INTERACTIVE)) activate(row);
          },
          onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
            if (e.key === 'Enter' && e.target === e.currentTarget) activate(row);
          },
        }
      : {};

  const emptyBlock = isEmpty && (
    <EmptyState
      className="rounded-none border-0 py-12"
      title={isFiltered ? filteredTitle : emptyTitle}
      description={isFiltered ? filteredDescription : emptyDescription}
      action={
        isFiltered &&
        onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            مسح الفلاتر
          </Button>
        )
      }
    />
  );

  let body: ReactNode;
  if (isError) {
    body = <ErrorState message={errorMessage} onRetry={onRetry} />;
  } else if (isMobile) {
    body = emptyBlock || (
      <ul aria-label={label} className="flex flex-col divide-y divide-border-subtle">
        {isLoading
          ? Array.from({ length: skeletonRows }, (_, i) => (
              <li key={i} className="flex flex-col gap-2.5 p-4">
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-2/5" />
              </li>
            ))
          : rows.map((row) => {
              const [first, ...rest] = columns;
              const { className: clickable, ...handlers } = rowProps(row);
              return (
                <li
                  key={getRowId(row)}
                  className={cn('flex flex-col gap-2 p-4', clickable)}
                  {...handlers}
                >
                  {first && <div className="font-semibold">{first.cell(row)}</div>}
                  <dl className="flex flex-col gap-1.5 text-sm">
                    {rest.map((col) =>
                      col.headerHidden ? (
                        <div key={col.id} className="flex justify-end pt-1">
                          <dt className="sr-only">{col.header}</dt>
                          <dd>{col.cell(row)}</dd>
                        </div>
                      ) : (
                        <div key={col.id} className="flex items-center justify-between gap-3">
                          <dt className="text-muted-foreground">{col.header}</dt>
                          <dd className="text-end">{col.cell(row)}</dd>
                        </div>
                      ),
                    )}
                  </dl>
                </li>
              );
            })}
      </ul>
    );
  } else {
    body = (
      <>
        <Table aria-label={label}>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.id} align={col.align} className={col.width}>
                  {col.headerHidden ? <span className="sr-only">{col.header}</span> : col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: skeletonRows }, (_, i) => (
                  <TableRow key={i}>
                    {columns.map((col, c) => (
                      <TableCell key={col.id} align={col.align}>
                        <Skeleton
                          className={cn(
                            'inline-block h-3 align-middle',
                            skeletonWidths[(i + c) % skeletonWidths.length],
                          )}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row) => (
                  <TableRow key={getRowId(row)} {...rowProps(row)}>
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align}>
                        {col.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {emptyBlock}
      </>
    );
  }

  return (
    <div
      aria-busy={isLoading || undefined}
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-surface text-foreground',
        className,
      )}
    >
      {body}
      {footer && !isError && !isEmpty && (
        <div className="border-t border-border px-4.5 py-3">{footer}</div>
      )}
    </div>
  );
}
