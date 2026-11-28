import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { cn } from '@/shared/lib/cn';

export type OnlineStatusPillProps = {
  className?: string;
};

/**
 * Topbar "غير متصل" pill, shown only while offline. It has no live region:
 * <OfflineBanner> announces the change.
 */
export function OnlineStatusPill({ className }: OnlineStatusPillProps) {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <span
      className={cn(
        'inline-flex h-7.5 items-center gap-2 rounded-full border border-danger/40 bg-danger-muted px-3 text-xs font-semibold text-danger',
        className,
      )}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-danger" />
      غير متصل
    </span>
  );
}
