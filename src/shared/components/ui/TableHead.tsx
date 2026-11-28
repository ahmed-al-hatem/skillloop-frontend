import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';
import { alignClass, type TableAlign } from './tableAlign';

export type TableHeadProps = Omit<ComponentProps<'th'>, 'align'> & {
  align?: TableAlign;
};

/**
 * Column header cell. Sticky at the top of the table's scroll box; the background is an
 * opaque mix of `muted` over `surface` so scrolled rows don't show through.
 */
export function TableHead({ align = 'start', scope = 'col', className, ...props }: TableHeadProps) {
  return (
    <th
      scope={scope}
      className={cn(
        'sticky top-0 z-10 border-b border-border px-3 py-3.5 text-[13px] font-semibold whitespace-nowrap',
        'bg-[color-mix(in_srgb,var(--muted)_50%,var(--surface))] first:ps-4.5 last:pe-4.5',
        alignClass[align],
        className,
      )}
      {...props}
    />
  );
}
