import { useId } from 'react';
import { PAGE_SIZE_OPTIONS } from '@/shared/constants/pagination';
import { cn } from '@/shared/lib/cn';

export type PageSizeSelectProps = {
  value: number;
  onChange: (pageSize: number) => void;
  options?: readonly number[];
  className?: string;
};

/** "عدد الصفوف" select for list footers. Native `<select>` until the shared `Select` lands. */
export function PageSizeSelect({
  value,
  onChange,
  options = PAGE_SIZE_OPTIONS,
  className,
}: PageSizeSelectProps) {
  const id = useId();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label htmlFor={id} className="text-sm text-muted-foreground">
        عدد الصفوف
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'h-8.5 rounded-md border border-input bg-surface ps-2.5 pe-2 font-latin text-[13px] font-medium text-foreground',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none pointer-coarse:h-11',
        )}
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
