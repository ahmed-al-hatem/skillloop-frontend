import { cn } from '@/shared/lib/cn';

export type LogoutIconProps = {
  className?: string;
};

export function LogoutIcon({ className }: LogoutIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-4.5 shrink-0', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" />
    </svg>
  );
}
