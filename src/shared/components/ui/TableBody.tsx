import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type TableBodyProps = ComponentProps<'tbody'>;

/** Rows get a hover tint; the last row drops its bottom border (the card edge or footer has one). */
export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn(
        '[&>tr]:transition-colors [&>tr]:duration-micro [&>tr]:hover:bg-muted/50',
        '[&>tr:last-child>td]:border-b-0',
        className,
      )}
      {...props}
    />
  );
}
