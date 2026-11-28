import { cn } from '@/shared/lib/cn';

export type ArchiveIconProps = { className?: string };

/** Archive box, the title tile of the archive dialog. */
export function ArchiveIcon({ className }: ArchiveIconProps) {
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
      <path d="M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM2 3h20v4H2zM10 12h4" />
    </svg>
  );
}
