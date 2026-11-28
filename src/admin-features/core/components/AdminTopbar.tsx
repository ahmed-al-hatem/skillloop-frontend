import { Link } from 'react-router';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { OnlineStatusPill } from '@/shared/components/OnlineStatusPill';
import { cn } from '@/shared/lib/cn';
import { useRouteCrumbs } from '../hooks/useRouteCrumbs';

export type AdminTopbarProps = {
  /** Opens the nav drawer. The button only shows under 768 px. */
  onOpenMenu: () => void;
};

/** Breadcrumb (from route `handle.crumb`), the offline pill, and the offline / back-online bar. */
export function AdminTopbar({ onOpenMenu }: AdminTopbarProps) {
  const crumbs = useRouteCrumbs();

  return (
    <div className="sticky top-0 z-20">
      <header className="flex h-12 items-center gap-3 border-b border-border-subtle bg-background px-4 md:px-8">
        <button
          type="button"
          aria-label="فتح القائمة"
          onClick={onOpenMenu}
          className="-ms-2 flex size-11 flex-none items-center justify-center rounded-[10px] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:hidden"
        >
          <svg
            aria-hidden="true"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <nav aria-label="مسار الصفحة" className="min-w-0 flex-1">
          <ol className="flex items-center gap-1.5 text-[13px]">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <li
                  key={crumb.id}
                  className={cn(
                    'flex items-center gap-1.5',
                    isLast ? 'min-w-0' : 'whitespace-nowrap',
                  )}
                >
                  {index > 0 && (
                    <svg
                      aria-hidden="true"
                      className="size-3.5 flex-none text-muted-foreground rtl:-scale-x-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  )}
                  {isLast ? (
                    <span aria-current="page" className="block truncate font-semibold">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.to}
                      className="text-muted-foreground hover:text-foreground focus-visible:underline focus-visible:outline-none"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <OnlineStatusPill />
      </header>
      <OfflineBanner />
    </div>
  );
}
