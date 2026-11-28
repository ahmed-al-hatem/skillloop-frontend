import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { Drawer } from '@/shared/components/ui/Drawer';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

/**
 * Admin shell (rendered inside `RequireAdmin`): the sidebar on the start side (264 px), then
 * the topbar and the page. Under 768 px the sidebar becomes an off-canvas drawer.
 * Badge counters are wired in a later PR (`useAdminCounters` from `@/admin-features/overview`).
 */
export function AdminLayout() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  // Close the drawer after navigating (adjust state while rendering, no effect needed).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  return (
    <div className="min-h-dvh bg-background text-foreground md:grid md:grid-cols-[264px_minmax(0,1fr)]">
      {isDesktop && <AdminSidebar className="sticky top-0 z-30" />}
      <div className="flex min-w-0 flex-col">
        <AdminTopbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <Drawer
        open={!isDesktop && menuOpen}
        onOpenChange={setMenuOpen}
        title="لوحة الإدارة"
        size="sm"
        className="w-75"
      >
        <AdminSidebar className="h-auto flex-1 border-e-0 bg-transparent px-0 pt-0" />
      </Drawer>
    </div>
  );
}
