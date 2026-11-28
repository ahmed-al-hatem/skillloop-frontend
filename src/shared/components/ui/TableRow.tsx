import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type TableRowProps = ComponentProps<'tr'>;

export function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={cn(className)} {...props} />;
}
