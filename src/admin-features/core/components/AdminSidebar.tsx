import { useState } from 'react';
import { useCurrentUser } from '@/features/auth';
import logoOnDarkUrl from '@/shared/assets/brand/logo-on-dark.svg';
import logoOnLightUrl from '@/shared/assets/brand/logo-on-light.svg';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { cn } from '@/shared/lib/cn';
import { adminNav, adminNavGroups, type AdminNavBadge } from '../nav.config';
import { AdminNavGroup } from './AdminNavGroup';
import { LogoutDialog } from './LogoutDialog';
import { LogoutIcon } from './LogoutIcon';
import { ThemeToggle } from './ThemeToggle';

export type AdminSidebarProps = {
  /** Badge counters (open disputes, pending suggestions). Undefined = no badge. */
  counts?: Partial<Record<AdminNavBadge, number>>;
  className?: string;
};

/** Brand + theme, nav groups from `nav.config.ts`, and the signed-in admin with logout. */
export function AdminSidebar({ counts, className }: AdminSidebarProps) {
  const me = useCurrentUser().data;
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <nav
      aria-label="القائمة الرئيسية"
      className={cn(
        'flex h-dvh flex-col gap-4.5 border-e border-border bg-sidebar px-3.5 pt-5 text-sidebar-foreground',
        className,
      )}
    >
      <div className="flex items-center justify-between px-2 pt-1">
        <img src={logoOnDarkUrl} alt="SkillLoop" className="h-8.5 w-auto light:hidden" />
        <img src={logoOnLightUrl} alt="SkillLoop" className="hidden h-8.5 w-auto light:block" />
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
            الإدارة
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 [scrollbar-width:none] flex-col gap-5.5 overflow-y-auto pb-6">
        {adminNavGroups.map((group) => (
          <AdminNavGroup
            key={group.key}
            label={group.label}
            phase={'phase' in group ? group.phase : undefined}
            items={adminNav.filter((item) => item.group === group.key)}
            counts={counts}
          />
        ))}
      </div>

      <div className="-mx-3.5 flex flex-none items-center gap-2.5 border-t border-border px-3.5 pt-3.5 pb-4">
        {me && (
          <>
            <Avatar
              name={me.fullName}
              src={me.photoUrl}
              tone="solid"
              decorative
              className="size-10"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug">
              <span className="text-sm font-semibold [overflow-wrap:anywhere]">{me.fullName}</span>
              <span
                dir="ltr"
                className="text-end font-sans text-xs break-all text-muted-foreground"
              >
                {me.email}
              </span>
            </div>
          </>
        )}
        <Tooltip content="تسجيل الخروج">
          <button
            type="button"
            aria-label="تسجيل الخروج"
            onClick={() => setLogoutOpen(true)}
            className="ms-auto flex size-10 flex-none items-center justify-center rounded-[10px] border border-input text-muted-foreground transition-colors duration-micro hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none pointer-coarse:size-11"
          >
            <LogoutIcon />
          </button>
        </Tooltip>
      </div>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </nav>
  );
}
