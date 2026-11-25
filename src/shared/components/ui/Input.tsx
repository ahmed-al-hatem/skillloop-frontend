import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type InputProps = ComponentProps<'input'> & {
  /** Validation message (e.g. from react-hook-form `errors.email?.message`). */
  error?: string;
};

/** Works with react-hook-form: `<Input {...register('email')} error={errors.email?.message} />`. */
export function Input({ className, error, id, ...props }: InputProps) {
  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          'h-10 w-full rounded-md border border-input bg-background px-3 text-start',
          'placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
