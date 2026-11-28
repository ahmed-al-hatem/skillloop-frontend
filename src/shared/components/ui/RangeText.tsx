import type { PageMeta } from '@/shared/api/types';
import { cn } from '@/shared/lib/cn';

export type RangeTextProps = {
  meta: PageMeta;
  className?: string;
};

// Latin digits with grouping (design: numbers in Inter), e.g. 1,250.
const number = new Intl.NumberFormat('en-US');

/** "عرض 1–20 من 196" for a paginated list. */
export function RangeText({ meta, className }: RangeTextProps) {
  const { page, pageSize, total } = meta;
  const from = total === 0 ? 0 : Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);
  const range = from === to ? number.format(to) : `${number.format(from)}–${number.format(to)}`;

  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      عرض{' '}
      <bdi dir="ltr" className="font-latin tabular-nums">
        {range}
      </bdi>{' '}
      من{' '}
      <bdi dir="ltr" className="font-latin tabular-nums">
        {number.format(total)}
      </bdi>
    </p>
  );
}
