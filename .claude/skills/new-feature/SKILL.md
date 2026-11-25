---
name: new-feature
description: Scaffold a new feature folder in src/features/ following SkillLoop's feature-based structure and register its routes and mocks. Use when the user asks to create/add a new feature or module (e.g. "create the reviews feature"). Do not use for adding a component or endpoint to an existing feature.
---

# new-feature

## Inputs

- Feature name in kebab-case (e.g. `time-bank`). Ask if unclear.
- What the first screen/page is (to name the page component).

## Before you start

- Confirm `src/features/<name>/` does not already exist. If it does, stop and tell the user.
- Read `docs/02-project-structure.md` and `docs/07-conventions.md` if you haven't in this session.

## Create only what is needed now

Default minimum:

```
src/features/<name>/
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

Page placeholder: use `PageHeader` and `EmptyState` from `@/shared/components/` (see `src/features/profile/pages/ProfilePage.tsx`).

`index.ts`:

```ts
// Public API of the <name> feature. Other code imports ONLY from '@/features/<name>'.
export { <camelName>Routes } from './routes';
```

Never export `mocks/` from `index.ts` — mock data must stay out of the production bundle.

## Register (one line each)

- `src/shared/constants/routes.ts`: add `<camelName>: '/<url-path>'` to `ROUTES` (if not there yet).
- `src/app/router.tsx`: one import from `@/features/<name>` and one `...<camelName>Routes` spread, alphabetical. Auth-style pages go under `AuthLayout`, everything else under `MainLayout`.
- `src/mocks/handlers.ts`: only if `mocks/` was created — import from `@/features/<name>/mocks/<name>.handlers` and spread `...<camelName>Handlers`.
- Nav link in `src/app/layouts/MainLayout.tsx`: only if the user asks for one.

Use `src/features/matching/` as the reference for a fully wired feature.

## Finish

- Run `npm run check` and fix errors.
- Show the user the created tree and the two one-line registrations.
- Do not commit — the user commits or uses `finish-task`.
