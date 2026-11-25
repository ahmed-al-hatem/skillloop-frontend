import { cn } from '@/shared/lib/cn';

export type SpinnerProps = { className?: string; label?: string };

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block size-6 animate-spin rounded-full border-2 border-current border-e-transparent',
        className,
      )}
    />
  );
}
