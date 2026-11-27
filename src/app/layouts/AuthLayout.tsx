import { Outlet } from 'react-router';
import logoOnDarkUrl from '@/shared/assets/brand/logo-on-dark.svg';
import logoOnLightUrl from '@/shared/assets/brand/logo-on-light.svg';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

/** Centered card layout for login / register. */
export function AuthLayout() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <img
          src={logoOnDarkUrl}
          alt="SkillLoop"
          className="mx-auto mb-6 h-10 w-auto light:hidden"
        />
        <img
          src={logoOnLightUrl}
          alt="SkillLoop"
          className="mx-auto mb-6 hidden h-10 w-auto light:block"
        />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}
