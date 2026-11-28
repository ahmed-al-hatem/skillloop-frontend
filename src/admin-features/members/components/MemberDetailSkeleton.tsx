import { Skeleton } from '@/shared/components/ui/Skeleton';

/** Loading placeholder in the shape of the detail page: profile, wallet + transactions. */
export function MemberDetailSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <span role="status" className="sr-only">
        جارٍ تحميل بيانات العضو…
      </span>
      <Skeleton className="h-4 w-28" />
      <div className="flex items-center gap-4 rounded-2xl border bg-surface p-5.5">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex w-full max-w-md flex-col gap-2.5">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-52 rounded-2xl lg:col-span-2" />
      </div>
    </div>
  );
}
