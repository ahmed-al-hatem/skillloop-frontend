import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type TableProps = ComponentProps<'table'> & {
  /**
   * Classes for the scroll box around the table. The header is sticky inside this box,
   * so give it a max height (e.g. `max-h-[70vh]`) when the header should stay visible.
   */
  containerClassName?: string;
};

/**
 * Semantic `<table>` in a scroll box (wide tables scroll sideways instead of breaking the page).
 * Build it with `TableHeader` › `TableRow` › `TableHead`, and `TableBody` › `TableRow` › `TableCell`.
 * No `aria-sort`: the API has no sorting.
 */
export function Table({ className, containerClassName, ...props }: TableProps) {
  return (
    <div className={cn('relative w-full overflow-auto', containerClassName)}>
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  );
}
