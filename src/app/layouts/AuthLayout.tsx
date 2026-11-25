import { Outlet } from 'react-router';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

/** Centered card layout for login / register. */
export function AuthLayout() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <p className="mb-6 text-center text-xl font-bold text-primary">SkillLoop</p>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}
