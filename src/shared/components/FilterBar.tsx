import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export type FilterBarProps = {
  children: ReactNode;
  /** Accessible name of the search landmark, e.g. "فلترة الأعضاء". */
  label?: string;
  className?: string;
};

/**
 * Row of list filters above a table (`role="search"`). Wraps on narrow screens,
 * where every control takes the full width. Design sizes, per child:
 *
 *   <FilterBar label="فلترة الأعضاء">
 *     <SearchInput className="sm:max-w-115 sm:flex-[1_1_20rem]" … />
 *     <Select className="sm:w-47.5" hideLabel … />
 *     <ClearFiltersButton … />
 *   </FilterBar>
 */
export function FilterBar({ children, label, className }: FilterBarProps) {
  return (
    <div
      role="search"
      aria-label={label}
      className={cn('flex flex-wrap items-center gap-2 max-sm:*:w-full', className)}
    >
      {children}
    </div>
  );
}
