import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type SkeletonProps = ComponentProps<'span'>;

/**
 * Placeholder block shown while content loads. Size and shape come from `className`
 * (e.g. `h-3 w-3/5`, `size-9 rounded-full`). Hidden from screen readers: put
 * `aria-busy="true"` on the region that is loading instead.
 * The shimmer stops under `prefers-reduced-motion` (global guard in index.css).
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block animate-shimmer rounded-sm bg-linear-to-r from-muted from-25% via-border via-37% to-muted to-63% bg-size-[400%_100%]',
        className,
      )}
      {...props}
    />
  );
}
