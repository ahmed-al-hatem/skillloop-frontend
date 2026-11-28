import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';
import { alignClass, type TableAlign } from './tableAlign';

export type TableCellProps = Omit<ComponentProps<'td'>, 'align'> & {
  align?: TableAlign;
};

export function TableCell({ align = 'start', className, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        'border-b border-border-subtle px-3 py-3.5 align-middle first:ps-4.5 last:pe-4.5',
        alignClass[align],
        className,
      )}
      {...props}
    />
  );
}
