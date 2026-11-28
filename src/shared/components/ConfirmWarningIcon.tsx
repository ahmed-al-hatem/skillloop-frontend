import { cn } from '@/shared/lib/cn';

export type ConfirmWarningIconProps = { className?: string };

/** Warning triangle used by `ConfirmDialog` (title tile and effect callout). */
export function ConfirmWarningIcon({ className }: ConfirmWarningIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01" />
    </svg>
  );
}
