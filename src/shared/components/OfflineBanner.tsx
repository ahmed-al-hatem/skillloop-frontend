import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { cn } from '@/shared/lib/cn';

export type OfflineBannerProps = {
  /**
   * Runs on "إعادة المحاولة" once the browser is back online. Queries refetch on
   * reconnect by themselves, so this is only for extra work.
   */
  onRetry?: () => unknown;
  className?: string;
};

const BACK_ONLINE_MS = 3000;
const MIN_RETRY_MS = 1000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Full-width bar under the topbar: a red "لا يوجد اتصال" alert with retry while
 * offline, then a green "عاد الاتصال" bar for 3 s. Both are announced (aria-live).
 */
export function OfflineBanner({ onRetry, className }: OfflineBannerProps) {
  const isOnline = useOnlineStatus();
  const [wasOnline, setWasOnline] = useState(isOnline);
  const [showBack, setShowBack] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Adjust state while rendering when the connection flips (no effect needed).
  if (wasOnline !== isOnline) {
    setWasOnline(isOnline);
    setShowBack(isOnline);
  }

  useEffect(() => {
    if (!showBack) return;
    const timer = setTimeout(() => setShowBack(false), BACK_ONLINE_MS);
    return () => clearTimeout(timer);
  }, [showBack]);

  async function retry() {
    setIsRetrying(true);
    try {
      await Promise.all([wait(MIN_RETRY_MS), navigator.onLine ? onRetry?.() : undefined]);
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <div aria-live="polite" className={className}>
      {!isOnline && (
        <div className="flex flex-wrap items-center gap-3 border-b border-danger/30 bg-danger-muted px-4 py-2.5 text-sm text-danger md:px-8">
          <svg
            aria-hidden="true"
            className="size-4.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 8.8a15 15 0 0 1 4.2-2.6M9.9 4.4A15 15 0 0 1 22 8.8M5 12.5a10 10 0 0 1 5.2-2.7M15.5 10.2A10 10 0 0 1 19 12.5M8.5 16a5 5 0 0 1 7 0M12 20h.01M3 3l18 18" />
          </svg>
          <p className="flex-[1_1_20rem]">
            <b className="font-semibold">لا يوجد اتصال بالإنترنت.</b> تعرض الصفحة آخر بيانات محمّلة،
            والإجراءات التي تغيّر البيانات معطّلة حتى يعود الاتصال.
          </p>
          <button
            type="button"
            onClick={() => void retry()}
            disabled={isRetrying}
            className={cn(
              'inline-flex h-8.5 items-center gap-2 rounded-lg border border-danger/30 px-3 font-semibold',
              'transition-colors duration-micro hover:bg-danger/10 disabled:opacity-70',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none pointer-coarse:h-11',
            )}
          >
            <svg
              aria-hidden="true"
              className={cn('size-4 shrink-0', isRetrying && 'motion-safe:animate-spin')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />
            </svg>
            {isRetrying ? 'جارٍ المحاولة…' : 'إعادة المحاولة'}
          </button>
        </div>
      )}
      {isOnline && showBack && (
        <div className="flex items-center gap-2.5 border-b border-success/30 bg-success-muted px-4 py-2.5 text-sm text-success md:px-8">
          <svg
            aria-hidden="true"
            className="size-4.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 5 5 9-10" />
          </svg>
          عاد الاتصال، وتم تحديث البيانات.
        </div>
      )}
    </div>
  );
}
