import { Navigate, Outlet, useLocation } from 'react-router';
import { useCurrentUser } from '@/features/auth';
import { ApiRequestError } from '@/shared/api/client';
import { ErrorState } from '@/shared/components/ErrorState';
import { ROUTES } from '@/shared/constants/routes';
import { tokenStorage } from '@/shared/lib/token-storage';
import { useAdminAuthEvent } from '../hooks/useAdminAuthEvent';
import { withNext } from '../next';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import { AdminGuardSkeleton } from './AdminGuardSkeleton';

/**
 * Guards every `/admin/*` page (plan §3.2). UX only: the backend checks the role on every call.
 * Forbidden is rendered in place, so the URL stays the same.
 */
export function RequireAdmin() {
  const location = useLocation();
  const event = useAdminAuthEvent();
  const me = useCurrentUser();
  const here = location.pathname + location.search + location.hash;

  const expired =
    event === 'expired' || (me.error instanceof ApiRequestError && me.error.status === 401);
  if (expired) return <Navigate replace to={withNext(ROUTES.admin.sessionExpired, here)} />;

  if (!tokenStorage.get()) return <Navigate replace to={withNext(ROUTES.login, here)} />;

  const forbidden =
    event === 'forbidden' ||
    (me.error instanceof ApiRequestError && me.error.code === 'FORBIDDEN') ||
    (me.data !== undefined && me.data.role !== 'ADMIN');
  if (forbidden) return <ForbiddenPage email={me.data?.email} />;

  if (me.isPending) return <AdminGuardSkeleton />;

  if (me.isError) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background p-6">
        <ErrorState message={me.error.message} onRetry={() => void me.refetch()} />
      </main>
    );
  }

  return <Outlet />;
}
