import { Skeleton } from '@/shared/components/ui/Skeleton';

const ROWS = ['service', 'receiver', 'provider', 'points', 'created'];

/** Loading placeholder in the shape of the drawer body: summary rows, then the timeline. */
export function BookingDetailSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-5">
      <span role="status" className="sr-only">
        جارٍ تحميل الحجز…
      </span>
      <div className="flex flex-col gap-3.5">
        {ROWS.map((key) => (
          <div key={key} className="flex items-center gap-4">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        {['a', 'b', 'c', 'd'].map((key) => (
          <div key={key} className="flex items-center gap-3">
            <Skeleton className="size-2.5 rounded-full" />
            <Skeleton className="h-3.5 w-2/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
