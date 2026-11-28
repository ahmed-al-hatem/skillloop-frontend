import type { ReactNode } from 'react';
import { Link } from 'react-router';

export type ActivityRowProps = {
  to: string;
  /** Status badge at the end of the row. */
  badge: ReactNode;
  children: ReactNode;
};

/** A linked row in an activity tab: summary text, then a status badge. */
export function ActivityRow({ to, badge, children }: ActivityRowProps) {
  return (
    <li>
      <Link
        to={to}
        className="flex min-h-12 flex-wrap items-center justify-between gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="min-w-0">{children}</span>
        {badge}
      </Link>
    </li>
  );
}
