import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type TextareaProps = ComponentProps<'textarea'> & {
  /** Validation message shown under the field. Leave it out when a `CharCounter` shows the error. */
  error?: string;
  /** Error styling without a message, e.g. when a `CharCounter` below shows the message. */
  invalid?: boolean;
};

/**
 * Multi-line text field. Works with react-hook-form:
 * `<Textarea id="reason" {...register('reason')} error={errors.reason?.message} />`.
 *
 * With a counter, point `aria-describedby` at it and let the counter show the error:
 * `<Textarea id="reason" {...register('reason')} invalid={!!errors.reason} aria-describedby="reason-count" />`
 * `<CharCounter id="reason-count" length={reason.length} max={300} error={errors.reason?.message} />`
 *
 * Show errors after blur or edit, not before typing: use `useForm({ mode: 'onTouched' })`.
 */
export function Textarea({
  className,
  error,
  invalid,
  id,
  rows = 4,
  'aria-describedby': describedBy,
  ...props
}: TextareaProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const isInvalid = Boolean(error) || invalid;

  return (
    <div className="flex flex-col gap-1">
      <textarea
        id={id}
        rows={rows}
        aria-invalid={isInvalid ? true : undefined}
        aria-describedby={[describedBy, errorId].filter(Boolean).join(' ') || undefined}
        className={cn(
          'min-h-11 w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-start leading-[1.8]',
          'placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isInvalid && 'border-danger',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
