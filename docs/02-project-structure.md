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
├── admin-features/       # admin dashboard (/admin/*) — same layout and rules as features/
│   └── core/             # admin shell: adminRoutes, nav.config (layout + guard coming)
├── features/
│   └── auth/             # empty folder skeleton — features are built from Figma + openapi.yaml
├── shared/               # shared by everyone, knows nothing about features or admin-features
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

## The admin area: `src/admin-features/`

The admin dashboard lives in `src/admin-features/<feature>/` and is built **exactly like** `src/features/` (same subfolders, `routes.tsx`, `index.ts`). Import it with `@/admin-features/<feature>`.

- `admin-features/core/` is the admin shell. It exports `adminRoutes`, which collects every admin feature's routes. `src/app/router.tsx` imports only `adminRoutes`.
- Admin mock handlers are registered in `src/mocks/handlers.ts` like member ones (one import + one spread).
- The admin area may use a member feature through its `index.ts` (`@/features/auth`). Member features never import from `admin-features/`.
- Scaffold a new admin feature with the `new-feature` skill and `--admin`.

## The rules (ESLint enforces 1, 2 and 5)

1. **`shared/` never imports from `features/` or `admin-features/`.** Member features never import from `admin-features/`.
2. **A feature imports another feature only through its `index.ts`:** `import { useCurrentUser } from '@/features/auth'` ✅ — `'@/features/auth/api/auth.queries'` ❌. Same for `@/admin-features/<f>`. Inside the same feature use relative imports (`../schemas/auth.schema`), but never `../../<other-feature>/...`.
3. **Central files get one line per feature.** `src/app/router.tsx` and `src/mocks/handlers.ts` only collect:
   ```ts
   children: [...authRoutes, ...bookingsRoutes, ...servicesRoutes /* alphabetical */];
   ```
   So merge conflicts are rare — and if one happens, it is one line.
4. **`mocks/` is never exported from a feature's `index.ts`.** `src/mocks/handlers.ts` imports handlers directly, so fake data stays out of the production bundle.
5. **`components/`, `pages/`, `hooks/` and `api/` never import from a `mocks/` folder.** Fake data reaches the app only through MSW.

## Where does my file go?

| I'm writing…                                    | Put it in                                     |
| ----------------------------------------------- | --------------------------------------------- |
| A page / component used by one feature          | `features/<f>/pages/` or `components/`        |
| An admin dashboard screen                       | `admin-features/<f>/pages/`                   |
| A UI primitive (button, modal…) used everywhere | `shared/components/ui/` — in its own small PR |
| A request to the backend                        | `features/<f>/api/<f>.api.ts`                 |
| A schema used by 2+ features                    | `shared/schemas/` (create it when needed)     |
| A generic hook / helper                         | `shared/hooks/` / `shared/lib/`               |
| A new URL                                       | `shared/constants/routes.ts` (`ROUTES`)       |

## Shared components without duplicates

Need a new shared component? Make it in a **small separate PR** to `shared/components/ui/`, get it merged fast, and your teammate pulls `main`. This way the same component is never built twice.
