import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { LoginRequestSchema, useLogin, type LoginRequest } from '@/features/auth';
import { ApiRequestError } from '@/shared/api/client';
import logoOnDarkUrl from '@/shared/assets/brand/logo-on-dark.svg';
import logoOnLightUrl from '@/shared/assets/brand/logo-on-light.svg';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { resetAdminAuthEvent } from '../hooks/useAdminAuthEvent';
import { safeNext } from '../next';

/**
 * `/admin/session-expired?next=…`: the refresh failed, sign in again and go back to `next`.
 * Copy must not promise a session length (plan §3.2: no "8 hours" until the backend has it).
 */
export function SessionExpiredPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginRequest>({ resolver: zodResolver(LoginRequestSchema) });

  useEffect(() => resetAdminAuthEvent(), []);

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: () => {
        resetAdminAuthEvent();
        void navigate(safeNext(params.get('next')), { replace: true });
      },
      onError: (error) => {
        if (!(error instanceof ApiRequestError)) return;
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          if (field === 'email' || field === 'password') setError(field, { message });
        }
      },
    }),
  );

  const formError =
    login.error instanceof ApiRequestError && Object.keys(login.error.fieldErrors).length === 0
      ? login.error.message
      : undefined;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-8 text-foreground">
      <main className="flex w-full max-w-115 flex-col gap-5 rounded-2xl border border-border bg-card px-8 py-9 shadow-2xl">
        <img src={logoOnDarkUrl} alt="SkillLoop" className="h-10 w-auto self-center light:hidden" />
        <img
          src={logoOnLightUrl}
          alt="SkillLoop"
          className="hidden h-10 w-auto self-center light:block"
        />

        <div className="flex flex-col items-center gap-2.5 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-warning-muted text-warning">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2M9 2h6" />
            </svg>
          </span>
          <h1 className="text-2xl font-bold">انتهت الجلسة</h1>
          <p className="text-sm leading-loose text-muted-foreground">
            سجّلنا خروجك تلقائياً لحماية المنصة. سجّل الدخول للمتابعة من حيث توقفت.
          </p>
        </div>

        <form noValidate onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="session-email">البريد الإلكتروني</Label>
            <Input
              id="session-email"
              type="email"
              dir="ltr"
              autoComplete="username"
              className="h-11.5"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="session-password">كلمة المرور</Label>
            <Input
              id="session-password"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              className="h-11.5"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          {formError && (
            <p role="alert" className="text-sm text-danger">
              {formError}
            </p>
          )}
          <Button type="submit" size="lg" isLoading={login.isPending} className="rounded-xl">
            تسجيل الدخول
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          أي تغييرات غير محفوظة في النماذج لم تُرسل.
        </p>
      </main>
    </div>
  );
}
