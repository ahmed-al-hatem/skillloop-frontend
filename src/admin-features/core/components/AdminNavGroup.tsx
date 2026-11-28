import { useId } from 'react';
import type {
  AdminNavBadge,
  AdminNavItem as AdminNavItemConfig,
  AdminNavPhase,
} from '../nav.config';
import { AdminNavItem } from './AdminNavItem';
import { PhaseTag } from './PhaseTag';

export type AdminNavGroupProps = {
  label: string | null;
  /** A placeholder group (Analytics): tag next to the title, compact rows. */
  phase?: Exclude<AdminNavPhase, 'v1'>;
  items: readonly AdminNavItemConfig[];
  counts?: Partial<Record<AdminNavBadge, number>>;
};

export function AdminNavGroup({ label, phase, items, counts }: AdminNavGroupProps) {
  const labelId = useId();
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <div
          id={labelId}
          className="flex items-center gap-2 px-3.5 pb-1.5 text-xs font-semibold text-muted-foreground"
        >
          <span className="flex-1">{label}</span>
          {phase && <PhaseTag phase={phase} />}
        </div>
      )}
      <ul aria-labelledby={label ? labelId : undefined} className="flex flex-col gap-0.5">
        {items.map((item) => (
          <AdminNavItem
            key={item.key}
            item={item}
            count={item.badge ? counts?.[item.badge] : undefined}
            compact={Boolean(phase)}
          />
        ))}
      </ul>
    </div>
  );
}
