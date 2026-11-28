import { NavLink } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';
import type { AdminNavBadge, AdminNavItem as AdminNavItemConfig } from '../nav.config';
import { AdminNavIcon } from './AdminNavIcon';
import { PhaseTag } from './PhaseTag';

const badgeTones = {
  openDisputes: 'bg-secondary text-secondary-foreground',
  pendingSuggestions: 'bg-primary text-primary-foreground',
} as const satisfies Record<AdminNavBadge, string>;

export type AdminNavItemProps = {
  item: AdminNavItemConfig;
  /** Counter for `item.badge`; nothing is shown while it is undefined or 0. */
  count?: number;
  /** Smaller row, used inside a group that is itself a placeholder (Analytics). */
  compact?: boolean;
};

const row = 'relative flex items-center gap-3 rounded-[10px] px-3.5 text-sm font-medium';

/** One sidebar row: a link for a `v1` entry, a disabled placeholder for `P2`/`later`. */
export function AdminNavItem({ item, count, compact = false }: AdminNavItemProps) {
  const icon = item.icon ? (
    <AdminNavIcon name={item.icon} className={cn(compact && 'size-4.5')} />
  ) : (
    <span aria-hidden="true" className={compact ? 'w-4.5' : 'w-5'} />
  );

  if (item.phase !== 'v1') {
    return (
      <li>
        <div
          aria-disabled="true"
          className={cn(row, 'text-muted-foreground/70', compact ? 'h-9.5 text-[13px]' : 'h-11')}
        >
          {icon}
          <span className="flex-1">{item.label}</span>
          {!compact && <PhaseTag phase={item.phase} />}
        </div>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.to}
        end={item.to === ROUTES.admin.root}
        className={({ isActive }) =>
          cn(
            row,
            'h-11 transition-colors duration-micro focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            isActive
              ? 'bg-accent text-foreground before:absolute before:inset-y-2.5 before:start-0 before:w-0.75 before:rounded-full before:bg-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )
        }
      >
        {icon}
        <span className="flex-1">{item.label}</span>
        {item.badge && count ? (
          <span
            className={cn(
              'h-5.5 min-w-5.5 rounded-full px-1.75 text-center text-xs leading-5.5 font-bold tabular-nums',
              badgeTones[item.badge],
            )}
          >
            {count}
          </span>
        ) : null}
      </NavLink>
    </li>
  );
}
