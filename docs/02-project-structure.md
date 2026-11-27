# 02 · Project structure

**English** · [العربية](02-project-structure.ar.md)

Code is split **by feature**, not by file type. Everything about "auth" lives in `src/features/auth/`.

```
src/
├── app/                  # assembles the app only — no feature logic
│   ├── App.tsx
│   ├── providers.tsx     # QueryClientProvider (+ devtools in dev)
│   ├── router.tsx        # collects the routes of every feature
│   └── layouts/          # MainLayout (header), AuthLayout (centered card)
├── features/
│   ├── admin/            # admin panel shell (MUI) — see "The admin area" below
│   └── auth/             # empty folder skeleton — features are built from Figma + openapi.yaml
├── shared/               # shared by everyone, knows nothing about features
│   ├── api/              # client.ts (axios + interceptors), types.ts (PageMeta, Paginated, listSchema, paginatedSchema, ApiError)
│   ├── assets/brand/     # logo SVGs (see design/README.md)
│   ├── components/       # EmptyState, ErrorState, PageHeader, ErrorBoundary
│   │   └── ui/           # Button, Input, Label, Card, Badge, Spinner
│   ├── hooks/            # useDebounce, useMediaQuery
│   ├── lib/              # cn(), formatDate(), formatDateTime(), tokenStorage
│   └── constants/        # ROUTES, query defaults
├── mocks/                # browser.ts (setupWorker), handlers.ts (collects feature handlers)
├── config/env.ts         # reads + validates env with Zod
├── styles/index.css      # Tailwind + design tokens
└── main.tsx              # starts MSW when VITE_USE_MOCKS=true, then renders
```

## Inside a feature

Today `features/auth/` has only empty folders (`.gitkeep`). When it is built, it will look like this:

```
features/auth/
├── api/
│   ├── auth.api.ts           # request functions only (axios + Zod parse)
│   └── auth.queries.ts       # useLogin() / useCurrentUser() with TanStack Query + query keys
├── components/
│   └── LoginForm.tsx
├── pages/
│   └── LoginPage.tsx
├── schemas/
│   └── auth.schema.ts        # LoginSchema + type Login
├── mocks/
│   ├── auth.data.ts
│   └── auth.handlers.ts
├── routes.tsx                # export const authRoutes
└── index.ts                  # public API: what other code may import
```

Create only the folders you need. A small feature can use files (`types.ts`) instead of folders.

## The admin area

The admin panel (`/admin`) uses **MUI** (from the [MUI dashboard template](https://mui.com/material-ui/getting-started/templates/dashboard/)); the rest of the app is Tailwind. MUI is loaded lazily, so members never download it, and ESLint blocks MUI imports outside `src/features/admin*`.

```
features/admin/                  # the shell, shared by every admin section
├── theme/
│   ├── AdminThemeProvider.tsx   # RTL-aware Emotion cache + MUI theme
│   ├── createAdminCache.ts      # stylis-plugin-rtl + `@layer mui` (so Tailwind and MUI don't fight)
│   ├── createAdminTheme.ts      # dark theme: navy + brand colors from the CSS variables in styles/index.css
│   ├── customizations/          # component overrides, one file per group (inputs, navigation, surfaces…)
│   └── flipInRtl.ts             # mirrors arrow icons in RTL
├── components/                  # AdminLayout, SideMenu, SideMenuMobile, AppNavbar, Header, breadcrumbs…
├── config/navigation.ts         # ADMIN_NAV — one item per admin section
├── index.ts                     # exports adminRoute only — no MUI here (the router loads it eagerly)
├── strings.ts                   # shell texts (ready for i18n)
└── routes.tsx                   # adminRoute: the lazy /admin layout route

features/admin-ui/               # MUI building blocks shared by the sections: SectionCard, MetricItem, LegendItem…
                                 # (imported only by lazy admin pages — never by src/app)

features/admin-<section>/        # one feature per section: admin-dashboard, admin-categories…
└── (api/, components/, pages/, schemas/, mocks/, routes.tsx, index.ts — like any feature)
```

**Adding an admin section:** create `features/admin-<section>/`, add one spread line inside the `...adminRoute` block of `src/app/router.tsx`, and one item in `ADMIN_NAV`.

## The 4 rules (ESLint enforces 1 and 2)

1. **`shared/` never imports from `features/`.**
2. **A feature imports another feature only through its `index.ts`:** `import { useCurrentUser } from '@/features/auth'` ✅ — `'@/features/auth/api/auth.queries'` ❌. Inside the same feature use relative imports (`../schemas/auth.schema`).
3. **Central files get one line per feature.** `src/app/router.tsx` and `src/mocks/handlers.ts` only collect:
   ```ts
   children: [...authRoutes, ...bookingsRoutes, ...servicesRoutes /* alphabetical */];
   ```
   So merge conflicts are rare — and if one happens, it is one line.
4. **`mocks/` is never exported from a feature's `index.ts`.** `src/mocks/handlers.ts` imports handlers directly, so fake data stays out of the production bundle.

## Where does my file go?

| I'm writing…                                    | Put it in                                     |
| ----------------------------------------------- | --------------------------------------------- |
| A page / component used by one feature          | `features/<f>/pages/` or `components/`        |
| A UI primitive (button, modal…) used everywhere | `shared/components/ui/` — in its own small PR |
| A request to the backend                        | `features/<f>/api/<f>.api.ts`                 |
| A schema used by 2+ features                    | `shared/schemas/` (create it when needed)     |
| A generic hook / helper                         | `shared/hooks/` / `shared/lib/`               |
| A new URL                                       | `shared/constants/routes.ts` (`ROUTES`)       |

## Shared components without duplicates

Need a new shared component? Make it in a **small separate PR** to `shared/components/ui/`, get it merged fast, and your teammate pulls `main`. This way the same component is never built twice.
