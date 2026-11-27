# AGENTS.md — SkillLoop Frontend

Rules for AI coding agents (Codex, Claude Code, others) working in this repo.
This is the **single source of truth** for project rules — `CLAUDE.md` imports it.
Human docs live in `docs/` (start at `docs/README.md`).

## Project

SkillLoop is a skill-exchange platform where people trade skills using **points** instead of money: members offer services, others book them with points, the points are held until the work is confirmed, and both sides review each other. The full model is in the backend's SRS and `openapi.yaml`.

Screens are built from the **Figma designs**. Until a design arrives for a feature, there is no screen for it — don't invent UI.

This repo is the **web frontend only**. The API is built by a separate backend team.

- Repo: https://github.com/ahmed-al-hatem/skillloop-frontend — default branch `main`
- Frontend developers: `ahmed-al-hatem` and `<teammate-username>`. Each one reviews the other's PRs (GitHub doesn't let you approve your own).

## Stack

Vite · React · TypeScript (strict) · Tailwind CSS v4 · React Router · TanStack Query · axios · Zod · react-hook-form · MSW · shadcn/ui-compatible primitives.
Package manager: **npm only**. Never use yarn/pnpm, never delete `package-lock.json`. If you add a dependency, tell the user so they can inform their teammate.

## Commands

- `npm run dev` — dev server (MSW fakes the API when `VITE_USE_MOCKS=true` in `.env`)
- `npm run check` — lint + typecheck + format check + build. **Must pass before every commit you propose for a PR.**
- `npm run format` — fix formatting
- `npm run skills:sync` — copy `.agents/skills` → `.claude/skills` after editing a skill

## Architecture rules (ESLint enforces 2 and 3)

1. Code is organized by feature: `src/features/<feature>/` with only the subfolders it needs (`api/`, `components/`, `hooks/`, `pages/`, `schemas/`, `mocks/`) plus `routes.tsx` and `index.ts`. A small feature may use single files (`types.ts`) instead of folders.
2. `src/shared/` never imports from `src/features/`.
3. A feature imports another feature **only** through its `index.ts` (`@/features/auth`), never `@/features/auth/components/...`. Inside a feature use relative imports.
4. Central files — `src/app/router.tsx` and `src/mocks/handlers.ts` — get **one import + one spread line per feature**, kept alphabetical. No feature logic there.
5. `src/app/` only assembles the app (providers, router, layouts).
6. Use the `@/` alias for imports from `src/`.
7. Before creating a UI primitive, check `src/shared/components/ui/`. A new shared component goes in its own small PR.

## Data rules

- Server data → TanStack Query hooks in `features/<f>/api/<f>.queries.ts`. API calls only in `features/<f>/api/<f>.api.ts`, using `api` from `@/shared/api/client`.
- Types come from Zod: write the schema, export `type X = z.infer<typeof XSchema>`. No duplicate hand-written types.
- Validate every API response with its schema inside the api function.
- Never import mock data into components. Fake data goes through MSW handlers in `features/<f>/mocks/`.
- The API contract is the backend's `openapi.yaml` (local copy in `local-docs/api/openapi.yaml`, gitignored; rules in `docs/05-api-contract.md`). **Never invent an endpoint.** If one is missing, stop and tell the user the backend team must add it to `openapi.yaml` first.
- Point balances, prices and match scores are computed by the backend. The frontend only displays them.
- Forms: react-hook-form + `zodResolver(schema)`. Show server field errors from `ApiRequestError` (the API sends them in `error.details`; `shared/api/client.ts` still follows the old draft shape and must be aligned when the first real endpoint is built).

## UI rules

- Tailwind only, combined with `cn()` from `@/shared/lib/cn`. No inline styles, no CSS modules, no raw hex colors — use tokens (`bg-primary`, `text-muted-foreground`, `border-border`).
- The UI is Arabic-first and **RTL**: use logical classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, `text-end`). Never `ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`/`text-left`/`text-right`.
- Every data view handles loading, error (`ErrorState`) and empty (`EmptyState`) states.
- Named exports only. One component per file, PascalCase file name. Props type is `<Component>Props`.
- Use `ROUTES` from `@/shared/constants/routes` instead of hard-coded paths.

## Git rules (strict)

- Never commit or push to `main`. Never `git push --force` / `--force-with-lease`. Never rewrite pushed history. Never merge a PR.
- One task = one GitHub issue = one short branch from an up-to-date `main`.
- Branch names: `feat/<issue>-<short-name>`, `fix/<issue>-<short-name>`, `chore/<issue>-<short-name>`, `docs/<issue>-<short-name>`, `refactor/<issue>-<short-name>`.
- Commits: Conventional Commits with the feature as scope — `feat(matching): add partner card`, `fix(auth): show server error on login`, `chore: add msw handlers for exchanges`.
- Update a branch with `git fetch origin && git merge origin/main` (not rebase).
- PRs: `gh pr create`, body from `.github/pull_request_template.md`, include `Closes #<issue>`. Keep PRs under ~400 lines.
- Never commit `.env` or any secret — only `.env.example`.
- Before any destructive git command (`reset --hard`, `clean`, `branch -D`, `checkout -- .`, `stash drop`), explain what will be lost and ask the user.
- The teammate may not know git well: explain conflicts and git errors in plain words, and propose the fix instead of only running commands.

## Docs rules

- Every human doc exists twice: `name.md` (English) and `name.ar.md` (Arabic). Change both in the same commit.
- `AGENTS.md`, `CLAUDE.md` and skills are English only.

## Skills

In `.agents/skills/` (source of truth, read by Codex), copied to `.claude/skills/` (Claude Code):

| Skill          | Use it to                                                               |
| -------------- | ----------------------------------------------------------------------- |
| `start-task`   | sync `main` and create a correctly named branch for an issue            |
| `new-feature`  | scaffold a feature folder and register it                               |
| `add-endpoint` | schema + api + query hook + MSW mock for one endpoint from the contract |
| `finish-task`  | check, commit, merge `main`, push, open the PR (never merges)           |
| `review-pr`    | check out a teammate's PR, run it, and walk through the review list     |

## When unsure

Ask the user instead of guessing — especially about the API contract, shared components, or anything touching `main`.
