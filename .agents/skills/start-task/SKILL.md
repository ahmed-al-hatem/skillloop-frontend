---
name: start-task
description: >-
  Start work on a GitHub issue in the SkillLoop frontend — sync main and create a correctly named branch. Use when the user says "start task/issue #N", "I'm starting on …", or invokes /start-task. Do not use for finishing work or opening PRs (use finish-task).
---

# start-task

Goal: the user ends up on a fresh, correctly named branch created from the latest `main`, ready to code.

## Inputs

- Issue number (required). If missing, ask for it, or run `gh issue list --assignee @me --state open` and let the user pick.

## Steps

1. **Read the issue**: `gh issue view <N>`. Summarize it to the user in 2–3 lines (what to build, which feature folder).
2. **Check the working tree**: `git status --porcelain`.
   - If there are uncommitted changes: STOP. Show them and ask whether to commit them on the current branch, stash them (`git stash push -m "<reason>"`), or discard. Never discard without explicit approval.
3. **Sync main**:
   ```bash
   git switch main
   git pull origin main
   ```
4. **Pick the branch name** from the issue:
   - new functionality → `feat/<N>-<short-kebab-name>`
   - bug → `fix/<N>-<short-kebab-name>`
   - refactor/tooling/docs → `refactor/<N>-…`, `chore/<N>-…`, `docs/<N>-…`
   - short name: 2–4 English words, lowercase, kebab-case (e.g. `feat/12-matching-list`).
5. **Create and switch**: `git switch -c <branch>`.
   - If the branch already exists locally or on origin, ask whether to continue on it (`git switch <branch>` then `git merge origin/main`) instead of creating a new one.
6. **Self-assign** (optional, if not assigned): `gh issue edit <N> --add-assignee @me`.
7. **Report**: current branch, the feature folder to work in (`src/features/<feature>/`), and remind: small commits, run `npm run check`, finish with `/finish-task`.

## Never

- Create branches from anything other than an up-to-date `main`.
- Commit or push in this skill.
