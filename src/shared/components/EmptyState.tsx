import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Button } from './ui/Button';

export type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  /**
   * `filtered`: nothing matches the current filters (search icon + "مسح الفلاتر"
   * when `onClearFilters` is set). `success`: an empty queue is good news (check icon).
   */
  variant?: 'default' | 'filtered' | 'success';
  /** Replaces the variant's icon. Pass an `aria-hidden` SVG. */
  icon?: ReactNode;
  /** Usually `reset` from `useListParams`. Only used by the `filtered` variant. */
  onClearFilters?: () => void;
  /** Optional call to action, e.g. a <Button>. */
  action?: ReactNode;
  className?: string;
};

const svgProps = {
  'aria-hidden': true,
  className: 'size-6.5',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const variantIcons = {
  default: null,
  filtered: (
    <svg {...svgProps}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  success: (
    <svg {...svgProps}>
      <path d="m5 12 5 5 9-10" />
    </svg>
  ),
};

const tileClasses = {
  default: 'bg-muted text-muted-foreground',
  filtered: 'bg-muted text-muted-foreground',
  success: 'bg-success-muted text-success',
};

export function EmptyState({
  title,
  description,
  variant = 'default',
  icon,
  onClearFilters,
  action,
  className,
}: EmptyStateProps) {
  const shownIcon = icon ?? variantIcons[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2.5 rounded-xl border border-dashed p-8 text-center',
        className,
      )}
    >
      {shownIcon && (
        <span
          className={cn(
            'flex size-14 items-center justify-center rounded-2xl',
            tileClasses[variant],
          )}
        >
          {shownIcon}
        </span>
      )}
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {(action || (variant === 'filtered' && onClearFilters)) && (
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          {variant === 'filtered' && onClearFilters && (
            <Button variant="outline" onClick={onClearFilters} className="rounded-lg font-semibold">
              مسح الفلاتر
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
