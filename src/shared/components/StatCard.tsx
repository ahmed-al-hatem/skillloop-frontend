import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/components/ui/Skeleton';

// Local until the shared number formatter lands in `@/shared/lib/format`.
const numberFormat = new Intl.NumberFormat('en-US');

const tones = {
  ok: 'text-success',
  warn: 'text-warning',
  danger: 'text-danger',
} as const;

export type StatCardTone = keyof typeof tones;

export type StatCardProps = Omit<ComponentProps<'div'>, 'children'> & {
  label: string;
  /** A number is grouped with Latin digits (`46,920`). Pass a string for ready-made values like `82%`. */
  value: number | string;
  /** Short context under the value, e.g. "آخر 7 أيام". Coloured by `tone`. */
  sub?: ReactNode;
  /** Health of the metric. Without it the sub-text stays muted. */
  tone?: StatCardTone;
  /** Shown after the value, e.g. the points icon. Mark decorative icons `aria-hidden`. */
  icon?: ReactNode;
  isLoading?: boolean;
};

/** One metric tile for dashboards: label, big Inter number, and an optional sub-text. */
export function StatCard({
  label,
  value,
  sub,
  tone,
  icon,
  isLoading = false,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      aria-busy={isLoading || undefined}
      className={cn(
        'flex min-w-0 flex-col gap-1.5 rounded-xl border bg-surface p-5 text-card-foreground',
        className,
      )}
      {...props}
    >
      <span className="text-sm font-semibold">{label}</span>
      {isLoading ? (
        <>
          <Skeleton className="my-1.5 h-8 w-2/5" />
          {sub !== undefined && <Skeleton className="h-3 w-3/5" />}
        </>
      ) : (
        <>
          <span className="inline-flex items-center gap-2">
            <span
              dir="ltr"
              className="font-latin text-[34px] leading-tight font-bold tracking-tight"
            >
              {typeof value === 'number' ? numberFormat.format(value) : value}
            </span>
            {icon && <span className="inline-flex size-6 shrink-0 [&>*]:size-full">{icon}</span>}
          </span>
          {sub !== undefined && (
            <span className={cn('text-[13px]', tone ? tones[tone] : 'text-muted-foreground')}>
              {sub}
            </span>
          )}
        </>
      )}
    </div>
  );
}
