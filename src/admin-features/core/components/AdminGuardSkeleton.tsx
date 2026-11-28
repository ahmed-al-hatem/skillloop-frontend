import { Skeleton } from '@/shared/components/ui/Skeleton';

/** Full-page frame of the admin shell (sidebar + topbar + content) while `me` loads. */
export function AdminGuardSkeleton() {
  return (
    <div aria-busy="true" className="flex min-h-dvh bg-background">
      <span className="sr-only">جارٍ التحميل…</span>
      <aside className="hidden w-66 shrink-0 flex-col gap-4 border-e border-border bg-sidebar p-5 md:flex">
        <Skeleton className="mb-4 h-9 w-32" />
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-md" />
        ))}
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="size-9 rounded-full" />
        </header>
        <main className="flex flex-col gap-6 p-6">
          <Skeleton className="h-8 w-56" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-72 rounded-lg" />
        </main>
      </div>
    </div>
  );
}
