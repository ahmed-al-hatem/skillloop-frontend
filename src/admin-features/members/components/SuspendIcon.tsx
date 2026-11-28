import { cn } from '@/shared/lib/cn';

export type SuspendIconProps = { className?: string };

/** Circle with a slash (design's suspend icon). Decorative. */
export function SuspendIcon({ className }: SuspendIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-[18px]', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </svg>
  );
}
