import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useSuggestions } from '../api/matching.queries';
import { PartnerCard } from './PartnerCard';

/** Reference example: every list handles loading, error and empty states. */
export function SuggestionsList() {
  const { data, isPending, isError, error, refetch } = useSuggestions();

  if (isPending) {
    return (
      <div className="flex justify-center p-8 text-primary">
        <Spinner />
      </div>
    );
  }

  if (isError) return <ErrorState message={error.message} onRetry={() => void refetch()} />;

  if (data.length === 0) {
    return (
      <EmptyState
        title="لا يوجد شركاء مقترحون بعد"
        description="أضف مهارات إلى ملفك لنقترح عليك شركاء."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((match) => (
        <PartnerCard key={match.id} match={match} />
      ))}
    </div>
  );
}
