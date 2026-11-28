import { Link, useLocation, useNavigate } from 'react-router';
import { useLogout } from '@/features/auth';
import logoOnDarkUrl from '@/shared/assets/brand/logo-on-dark.svg';
import logoOnLightUrl from '@/shared/assets/brand/logo-on-light.svg';
import { ROUTES } from '@/shared/constants/routes';
import { withNext } from '../next';

export type ForbiddenPageProps = {
  /** The signed-in account, shown at the bottom. */
  email?: string;
};

/** 403: signed in, but not an admin. Rendered by `RequireAdmin` in place (URL unchanged). */
export function ForbiddenPage({ email }: ForbiddenPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();

  // Leave the guarded page first, so the guard never sees the cleared tokens and redirects.
  const switchAccount = () => {
    void navigate(
      withNext(ROUTES.admin.sessionExpired, location.pathname + location.search + location.hash),
    );
    logout.mutate();
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background p-8 text-foreground">
      <header>
        <img src={logoOnDarkUrl} alt="SkillLoop" className="h-9 w-auto light:hidden" />
        <img src={logoOnLightUrl} alt="SkillLoop" className="hidden h-9 w-auto light:block" />
      </header>

      <main className="flex flex-1 items-center justify-center py-12">
        <div className="flex w-full max-w-130 flex-col items-center gap-5 text-center">
          <div className="flex size-30 items-center justify-center rounded-4xl bg-muted text-brand-lime light:text-success">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2" />
            </svg>
          </div>
          <span
            dir="ltr"
            className="text-sm font-bold tracking-[3px] text-brand-lime light:text-success"
          >
            ERROR 403
          </span>
          <h1 className="text-4xl font-bold">للمدراء فقط</h1>
          <p className="leading-loose text-muted-foreground">
            حسابك لا يملك صلاحية الدخول إلى لوحة الإدارة. إذا كنت تعتقد أن هذا خطأ، تواصل مع مسؤول
            المنصة.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link
              to={ROUTES.home}
              className="inline-flex h-12 items-center rounded-xl bg-primary px-5.5 font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              العودة إلى SkillLoop
            </Link>
            <button
              type="button"
              onClick={switchAccount}
              className="inline-flex h-12 items-center rounded-xl border border-input px-5.5 font-semibold hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              الدخول بحساب آخر
            </button>
          </div>
        </div>
      </main>

      {email && (
        <footer className="text-center text-xs text-muted-foreground">
          مسجّل باسم <span dir="ltr">{email}</span>
        </footer>
      )}
    </div>
  );
}
