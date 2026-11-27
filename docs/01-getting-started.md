# 01 · Getting started

**English** · [العربية](01-getting-started.ar.md)

## Requirements

- **Node.js 22+** (`node -v`)
- **Git** and the **GitHub CLI** (`gh auth login` once)
- **VS Code** — open the repo and accept the recommended extensions (ESLint, Prettier, Tailwind CSS, EditorConfig)
- Optional: **Claude Code** or **Codex** (see [08 · AI assistants](08-ai-assistants.md))

## First run

```bash
git clone https://github.com/ahmed-al-hatem/skillloop-frontend.git
cd skillloop-frontend
npm install
cp .env.example .env        # PowerShell: Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5173 → you see the app header and a "قريباً" (coming soon) placeholder. The screens are built from the Figma designs, feature by feature.

## Environment variables

| Variable         | Example                        | Meaning                                   |
| ---------------- | ------------------------------ | ----------------------------------------- |
| `VITE_API_URL`   | `http://localhost:8000/api/v1` | Backend base URL                          |
| `VITE_USE_MOCKS` | `true`                         | `true` = MSW fakes the API in the browser |

They are validated with Zod in `src/config/env.ts`; a missing or wrong value shows a clear error on start.
`.env` is **never** committed — only `.env.example`. If you add a variable, add it to `.env.example`, `src/config/env.ts`, `src/vite-env.d.ts` and this table.

## Daily commands

| Command          | When                                        |
| ---------------- | ------------------------------------------- |
| `npm run dev`    | While coding                                |
| `npm run check`  | Before every PR — runs exactly what CI runs |
| `npm run format` | When `check` says formatting is wrong       |

## Package manager

**npm only.** Don't use yarn or pnpm, and always commit `package-lock.json`. If you add a library, tell your teammate (and mention it in the PR) so they run `npm install`.

## Troubleshooting

- **Blank page / env error** → you forgot `.env`.
- **Requests go to the real server** → `VITE_USE_MOCKS` must be exactly `true`; restart `npm run dev` after editing `.env`.
- **"Port 5173 is in use"** → Vite picks the next port; read the URL in the terminal.
