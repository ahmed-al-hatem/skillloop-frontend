import { Button } from './ui/Button';

export type ErrorStateProps = {
  message?: string;
  /** Usually `refetch` from a query. */
  onRetry?: () => void;
};

/** Inline error for a failed query. For crashes use <ErrorBoundary>. */
export function ErrorState({ message = 'حدث خطأ غير متوقع', onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 p-8 text-center">
      <p className="text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
