import { Skeleton } from '@/shared/components/ui/Skeleton';

/** Loading placeholder in the shape of the detail page: header, two statement cards, a card row. */
export function DisputeDetailSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-5">
      <span role="status" className="sr-only">
        جارٍ تحميل النزاع…
      </span>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full max-w-md flex-col gap-2.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-14 w-48 rounded-xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {['claim', 'reply'].map((key) => (
          <Skeleton key={key} className="h-64 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {['summary', 'timeline', 'ratings'].map((key) => (
          <Skeleton key={key} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
