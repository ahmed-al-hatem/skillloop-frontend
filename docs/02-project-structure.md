# 02 · Project structure

**English** · [العربية](02-project-structure.ar.md)

Code is split **by feature**, not by file type. Everything about "matching" lives in `src/features/matching/`.

```
src/
├── app/                  # assembles the app only — no feature logic
│   ├── App.tsx
│   ├── providers.tsx     # QueryClientProvider (+ devtools in dev)
│   ├── router.tsx        # collects the routes of every feature
│   └── layouts/          # MainLayout (header + nav), AuthLayout (centered card)
├── features/
│   ├── auth/             # register, login, session
│   ├── profile/          # skills I teach / skills I want to learn
│   ├── matching/         # partner suggestions  ← fully wired reference example
│   ├── exchanges/        # exchange agreement + sessions
│   ├── time-bank/        # balance + transactions
│   └── reviews/          # ratings + badges
├── shared/               # shared by everyone, knows nothing about features
│   ├── api/              # client.ts (axios + interceptors), types.ts (ApiResponse, ApiError, Paginated)
│   ├── components/       # EmptyState, ErrorState, PageHeader, ErrorBoundary
│   │   └── ui/           # Button, Input, Label, Card, Badge, Spinner
│   ├── hooks/            # useDebounce, useMediaQuery
│   ├── lib/              # cn(), formatDate(), formatHours(), tokenStorage
│   ├── schemas/          # UserSummarySchema, SkillSchema
│   └── constants/        # ROUTES, query defaults
├── mocks/                # browser.ts (setupWorker), handlers.ts (collects feature handlers)
├── config/env.ts         # reads + validates env with Zod
├── styles/index.css      # Tailwind + design tokens
└── main.tsx              # starts MSW when VITE_USE_MOCKS=true, then renders
```

## Inside a feature

```
features/matching/
├── api/
│   ├── matching.api.ts       # request functions only (axios + Zod parse)
│   └── matching.queries.ts   # useSuggestions() with TanStack Query + query keys
├── components/
│   ├── PartnerCard.tsx
│   └── SuggestionsList.tsx
├── pages/
│   └── MatchingPage.tsx
├── schemas/
│   └── match.schema.ts       # MatchSchema + type Match
├── mocks/
│   ├── matching.data.ts
│   └── matching.handlers.ts
├── routes.tsx                # export const matchingRoutes
└── index.ts                  # public API: what other code may import
```

Create only the folders you need. A small feature can use files (`types.ts`) instead of folders.

## The 4 rules (ESLint enforces 1 and 2)

1. **`shared/` never imports from `features/`.**
2. **A feature imports another feature only through its `index.ts`:** `import { useSuggestions } from '@/features/matching'` ✅ — `'@/features/matching/api/matching.queries'` ❌. Inside the same feature use relative imports (`../schemas/match.schema`).
3. **Central files get one line per feature.** `src/app/router.tsx` and `src/mocks/handlers.ts` only collect:
   ```ts
   children: [...exchangesRoutes, ...matchingRoutes, ...profileRoutes /* alphabetical */];
   ```
   So merge conflicts are rare — and if one happens, it is one line.
4. **`mocks/` is never exported from a feature's `index.ts`.** `src/mocks/handlers.ts` imports handlers directly, so fake data stays out of the production bundle.

## Where does my file go?

| I'm writing…                                    | Put it in                                     |
| ----------------------------------------------- | --------------------------------------------- |
| A page / component used by one feature          | `features/<f>/pages/` or `components/`        |
| A UI primitive (button, modal…) used everywhere | `shared/components/ui/` — in its own small PR |
| A request to the backend                        | `features/<f>/api/<f>.api.ts`                 |
| A schema used by 2+ features                    | `shared/schemas/`                             |
| A generic hook / helper                         | `shared/hooks/` / `shared/lib/`               |
| A new URL                                       | `shared/constants/routes.ts` (`ROUTES`)       |

## Shared components without duplicates

Need a new shared component? Make it in a **small separate PR** to `shared/components/ui/`, get it merged fast, and your teammate pulls `main`. This way the same component is never built twice.
