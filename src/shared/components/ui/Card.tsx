import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type CardProps = ComponentProps<'div'>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl border bg-card p-4 text-card-foreground shadow-sm', className)}
      {...props}
    />
  );
}
