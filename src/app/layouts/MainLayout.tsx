import { Link, Outlet } from 'react-router';
import logoOnDarkUrl from '@/shared/assets/brand/logo-on-dark.svg';
import logoOnLightUrl from '@/shared/assets/brand/logo-on-light.svg';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ROUTES } from '@/shared/constants/routes';

export function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-4 py-3">
          <Link to={ROUTES.home} className="shrink-0">
            <img src={logoOnDarkUrl} alt="SkillLoop" className="h-8 w-auto light:hidden" />
            <img src={logoOnLightUrl} alt="SkillLoop" className="hidden h-8 w-auto light:block" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
