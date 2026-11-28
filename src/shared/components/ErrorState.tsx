import type { ReactNode } from 'react';
import { ApiRequestError } from '@/shared/api/client';
import { cn } from '@/shared/lib/cn';
import { Button } from './ui/Button';

export type ErrorStateProps = {
  title?: string;
  /** Wins over the message taken from `error`. */
  message?: string;
  /** The query's `error`: shows the backend's translated message and HTTP status. */
  error?: unknown;
  /** Usually `refetch` from a query. */
  onRetry?: () => void;
  /** Usually the query's `isRefetching`. */
  isRetrying?: boolean;
  /** Replaces the warning icon. Pass an `aria-hidden` SVG. */
  icon?: ReactNode;
  className?: string;
};

const FALLBACK_MESSAGE = 'تحقق من الاتصال ثم أعد المحاولة.';

/** Inline error for a failed query. For crashes use <ErrorBoundary>. */
export function ErrorState({
  title = 'تعذّر تحميل البيانات',
  message,
  error,
  onRetry,
  isRetrying = false,
  icon,
  className,
}: ErrorStateProps) {
  const apiError = error instanceof ApiRequestError ? error : undefined;
  const text = message ?? apiError?.message ?? FALLBACK_MESSAGE;
  const status = apiError && apiError.status > 0 ? apiError.status : undefined;

  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center gap-2.5 p-8 text-center', className)}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-danger-muted text-danger">
        {icon ?? (
          <svg
            aria-hidden="true"
            className="size-6.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01" />
          </svg>
        )}
      </span>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">
        {text}
        {status && (
          <>
            {' · '}
            الرمز <span dir="ltr">{status}</span>
          </>
        )}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          isLoading={isRetrying}
          className="mt-1 rounded-lg bg-foreground font-bold text-background hover:bg-foreground/90"
        >
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
