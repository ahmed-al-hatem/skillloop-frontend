# SkillLoop — Frontend

**English** · [العربية](README.ar.md)

SkillLoop is a skill-for-skill exchange platform: teach what you know, learn what you want, and every hour you teach goes into your **time bank**. This repo is the web frontend.

**Stack:** Vite · React · TypeScript · Tailwind CSS · React Router · TanStack Query · axios · Zod · react-hook-form · MSW

## Quick start

```bash
npm install
cp .env.example .env     # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5173. With `VITE_USE_MOCKS=true` the API is faked by MSW, so no backend is needed.

## Scripts

| Command          | What it does                                   |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Dev server                                     |
| `npm run check`  | Lint + typecheck + format check + build (= CI) |
| `npm run format` | Fix formatting with Prettier                   |
| `npm run build`  | Production build into `dist/`                  |

## Documentation

Everything is in [`docs/`](docs/README.md): getting started, project structure, git workflow, code review, API contract, mocking, conventions, and working with Claude Code / Codex.

AI agents read [`AGENTS.md`](AGENTS.md) (rules) — `CLAUDE.md` imports it.
