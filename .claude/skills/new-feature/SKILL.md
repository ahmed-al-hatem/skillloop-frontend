---
name: new-feature
description: Scaffold a new feature folder in src/features/ (or src/admin-features/ with --admin) following SkillLoop's feature-based structure and register its routes and mocks. Use when the user asks to create/add a new feature or module (e.g. "create the services feature", "new-feature disputes --admin"). Do not use for adding a component or endpoint to an existing feature.
---

# new-feature

## Inputs

- Feature name in kebab-case (e.g. `services`, `disputes`). Prefer the tag names in `openapi.yaml`. Ask if unclear.
- `--admin` (optional): the feature belongs to the admin dashboard (`/admin/*`). Also use it when the user says "admin feature" or names an admin screen. Do not prefix the name with `admin-` — the folder already says it.
- What the first screen/page is (to name the page component).

## Before you start

- Set `<root>` = `src/admin-features` with `--admin`, else `src/features`. Below, `@/<root>` means `@/features` or `@/admin-features`.
- Check `<root>/<name>/`. If it does not exist, create it. If it exists with only empty folders and `.gitkeep` files (a skeleton, like `auth/`), fill it in and delete the `.gitkeep` of every folder you put a file in. If it already has code, stop and tell the user.
- Read `docs/02-project-structure.md` and `docs/07-conventions.md` if you haven't in this session.

## Create only what is needed now

Default minimum:

```
<root>/<name>/
├── pages/<Name>Page.tsx       # named export, placeholder content
├── routes.tsx                 # export const <camelName>Routes: RouteObject[]
└── index.ts                   # public API: export routes (+ anything other features need)
```

Add these only if the first task needs them: `api/`, `components/`, `schemas/`, `mocks/`, `hooks/`, `store/`.
If an endpoint is involved, use the `add-endpoint` skill for `api/`, `schemas/` and `mocks/`.

## Templates

`routes.tsx`:

```tsx
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { <Name>Page } from './pages/<Name>Page';

export const <camelName>Routes: RouteObject[] = [
  { path: ROUTES.<camelName>, element: <<Name>Page /> },
];
```

Page placeholder: use `PageHeader` and `EmptyState` from `@/shared/components/`. Build the real screen from the Figma design the user provides.

`index.ts`:

```ts
// Public API of the <name> feature. Other code imports ONLY from '@/<root>/<name>'.
export { <camelName>Routes } from './routes';
```

Never export `mocks/` from `index.ts` — mock data must stay out of the production bundle.

## Register (one line each)

### Member feature (default)

- `src/shared/constants/routes.ts`: add `<camelName>: '/<url-path>'` to `ROUTES` (if not there yet).
- `src/app/router.tsx`: one import from `@/features/<name>` and one `...<camelName>Routes` spread, alphabetical. Auth-style pages go under `AuthLayout`, everything else under `MainLayout`.
- `src/mocks/handlers.ts`: only if `mocks/` was created — import from `@/features/<name>/mocks/<name>.handlers` and spread `...<camelName>Handlers`.
- Nav link in `src/app/layouts/MainLayout.tsx`: only if the user asks for one (there is no nav yet; it comes with the Figma designs).

### Admin feature (`--admin`)

- Admin routes are **not** registered in `src/app/router.tsx`. That file has a single `...adminRoutes` spread from `@/admin-features/core`.
- If `src/admin-features/core/` does not exist yet, stop and tell the user: the admin shell (core) must be built first.
- `src/shared/constants/routes.ts`: add the path under the `ROUTES.admin` group (e.g. `ROUTES.admin.<camelName>`), plus a builder for detail pages (`ROUTES.admin.<singular>(id)`). Paths are relative to `/admin`.
- `src/admin-features/core/routes.tsx`: one import from `@/admin-features/<name>` and one `...<camelName>Routes` spread inside the `RequireAdmin` children, alphabetical. Pages are lazy-loaded (`lazy: () => import(...)`) so the member bundle never ships admin code, and carry `handle: { crumb: '<Arabic label>' }`.
- `src/mocks/handlers.ts`: only if `mocks/` was created — import from `@/admin-features/<name>/mocks/<name>.handlers` and spread `...<camelName>AdminHandlers`, alphabetical with the member handlers.
- Admin `routes.tsx` template (named exports, lazy):

  ```tsx
  export const <camelName>Routes: RouteObject[] = [
    {
      path: ROUTES.admin.<camelName>,
      handle: { crumb: '<Arabic label>' },
      lazy: () => import('./pages/<Name>Page').then((m) => ({ Component: m.<Name>Page })),
    },
  ];
  ```

- Sidebar entry in `src/admin-features/core/nav.config.ts`: one entry, only if the design shows the screen in the sidebar.
- The admin feature may use member features through their `index.ts` only (`@/features/auth`). Member features must never import from `@/admin-features/` — ESLint blocks it.

## Finish

- Run `npm run check` and fix errors.
- Show the user the created tree and the two one-line registrations.
- Do not commit — the user commits or uses `finish-task`.
