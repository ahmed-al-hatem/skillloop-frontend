import { NavLink, Outlet } from 'react-router';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';

const NAV_ITEMS = [
  { to: ROUTES.matching, label: 'الشركاء المقترحون' },
  { to: ROUTES.exchanges, label: 'التبادلات' },
  { to: ROUTES.timeBank, label: 'بنك الساعات' },
  { to: ROUTES.reviews, label: 'التقييمات' },
  { to: ROUTES.profile, label: 'ملفي' },
];

export function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-4 py-3">
          <span className="text-lg font-bold text-primary">SkillLoop</span>
          <nav className="flex flex-wrap gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent',
                    isActive && 'bg-accent font-medium text-accent-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <NavLink to={ROUTES.login} className="ms-auto text-sm text-muted-foreground">
            تسجيل الدخول
          </NavLink>
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
