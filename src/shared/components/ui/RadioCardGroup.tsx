import { useId, type ReactNode, type Ref } from 'react';
import { cn } from '@/shared/lib/cn';

export type RadioCardOption<T extends string> = {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioCardGroupProps<T extends string> = {
  /** Shared `name` of the radios. Native radios with one name give arrow-key navigation for free. */
  name: string;
  /** Question above the cards (rendered as the fieldset's `<legend>`). */
  legend: ReactNode;
  options: readonly RadioCardOption<T>[];
  /** Selected value, or `undefined` when nothing is picked yet. */
  value: T | undefined;
  onValueChange: (value: T) => void;
  onBlur?: () => void;
  /** Goes to the selected radio (or the first one), so react-hook-form can focus it on error. */
  ref?: Ref<HTMLInputElement>;
  error?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * One choice out of a few, shown as cards (e.g. the dispute decision).
 * With react-hook-form use a `Controller`:
 * `<RadioCardGroup name={field.name} value={field.value} onValueChange={field.onChange} onBlur={field.onBlur} ref={field.ref} … />`.
 */
export function RadioCardGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onValueChange,
  onBlur,
  ref,
  error,
  disabled,
  className,
}: RadioCardGroupProps<T>) {
  const baseId = useId();
  const errorId = error ? `${baseId}-error` : undefined;
  const refIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <fieldset
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={errorId}
      className={cn('m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0', className)}
    >
      <legend className="mb-2.5 p-0 text-sm font-semibold text-muted-foreground">{legend}</legend>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] gap-3">
        {options.map((option, index) => {
          const inputId = `${baseId}-${index}`;
          const descriptionId = option.description ? `${inputId}-description` : undefined;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={cn(
                'flex min-h-11 cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-background p-3.5',
                'transition-colors duration-micro hover:border-input',
                'has-checked:border-primary has-checked:bg-primary/10 has-checked:ring-1 has-checked:ring-primary',
                'has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background',
                'has-disabled:cursor-not-allowed has-disabled:opacity-50',
                error && 'border-danger',
              )}
            >
              <input
                ref={index === refIndex ? ref : undefined}
                id={inputId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                disabled={option.disabled}
                aria-describedby={descriptionId}
                onChange={() => onValueChange(option.value)}
                onBlur={onBlur}
                className="mt-1 size-4.5 shrink-0 accent-primary focus-visible:outline-none"
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-bold">{option.label}</span>
                {option.description && (
                  <span id={descriptionId} className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
