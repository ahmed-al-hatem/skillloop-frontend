import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export type SliderProps = Omit<
  ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max'
> & {
  /** Visible label. The current value is shown after it. */
  label: ReactNode;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  /** How a number is written next to the label and at both ends, e.g. `(v) => \`${v}%\``. */
  formatValue?: (value: number) => string;
};

/**
 * Native range input: arrow keys move by `step`, Page Up/Down and Home/End work too, and the
 * fill follows the page direction (in RTL the minimum is on the right). Numbers stay LTR.
 * With react-hook-form use a `Controller`:
 * `<Slider value={field.value} onValueChange={field.onChange} onBlur={field.onBlur} ref={field.ref} … />`.
 */
export function Slider({
  label,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  formatValue = String,
  id,
  className,
  ...props
}: SliderProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}{' '}
        <span dir="ltr" className="font-latin tabular-nums">
          {formatValue(value)}
        </span>
      </label>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={formatValue(value)}
        onChange={(event) => onValueChange(event.target.valueAsNumber)}
        className={cn(
          'h-11 w-full cursor-pointer accent-primary',
          'rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...props}
      />
      <div
        aria-hidden="true"
        className="flex justify-between font-latin text-xs text-muted-foreground tabular-nums"
      >
        <span dir="ltr">{formatValue(min)}</span>
        <span dir="ltr">{formatValue(max)}</span>
      </div>
    </div>
  );
}
