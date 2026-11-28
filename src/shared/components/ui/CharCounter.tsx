import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export type CharCounterProps = {
  /** Give it an id and point the field's `aria-describedby` at it. */
  id?: string;
  /** Current number of characters (e.g. `watch('reason').length`). */
  length: number;
  max: number;
  /** When set, a non-empty value shorter than this is shown in the error tone. */
  min?: number;
  /** Help text on the start side, e.g. "من 5 إلى 300 حرف". Replaced by `error` when there is one. */
  hint?: ReactNode;
  /** Validation message (e.g. `errors.reason?.message`). Takes the hint's place and turns the row red. */
  error?: string;
  className?: string;
};

/**
 * The row under a text field: hint or error on the start side, `{len} / {max}` on the end side.
 * Digits stay left-to-right inside the RTL layout.
 */
export function CharCounter({ id, length, max, min, hint, error, className }: CharCounterProps) {
  const outOfRange = length > max || (min !== undefined && length > 0 && length < min);
  const isError = Boolean(error) || outOfRange;

  return (
    <div
      id={id}
      className={cn(
        'flex items-start justify-between gap-3 text-xs',
        isError ? 'text-danger' : 'text-muted-foreground',
        className,
      )}
    >
      <span>{error ?? hint}</span>
      <span dir="ltr" className="shrink-0 font-latin tabular-nums">
        {length} / {max}
      </span>
    </div>
  );
}
