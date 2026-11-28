import pointsIconUrl from '@/shared/assets/brand/points.svg';
import { cn } from '@/shared/lib/cn';
import { formatPoints } from '@/shared/lib/format';

// Icon sizes from the design: 16 tables, 24 cards, 48 empty / welcome states.
const sizes = {
  sm: { icon: 'size-4', gap: 'gap-1' },
  md: { icon: 'size-6', gap: 'gap-1.5' },
  lg: { icon: 'size-12', gap: 'gap-2' },
} as const;

export type PointsAmountProps = {
  /** Points as the backend sends them. Displayed only, never computed here. */
  value: number;
  size?: keyof typeof sizes;
  /** Show "+" / "-" for adjustments (+50, -20). */
  signed?: boolean;
  className?: string;
};

/** A point number followed by the points icon (alt "نقطة"). Text size comes from the parent. */
export function PointsAmount({ value, size = 'sm', signed = false, className }: PointsAmountProps) {
  return (
    <span className={cn('inline-flex items-center', sizes[size].gap, className)}>
      <bdi dir="ltr" className="font-latin tabular-nums">
        {formatPoints(value, { signed })}
      </bdi>
      <img src={pointsIconUrl} alt="نقطة" className={cn('shrink-0', sizes[size].icon)} />
    </span>
  );
}
