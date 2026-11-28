import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type TableHeaderProps = ComponentProps<'thead'>;

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={cn('text-muted-foreground', className)} {...props} />;
}
