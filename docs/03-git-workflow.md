# 03 · Git workflow

**English** · [العربية](03-git-workflow.ar.md)

> Using Claude Code or Codex? You don't need to memorize this: `/start-task 12` and `/finish-task` do it for you. See [08 · AI assistants](08-ai-assistants.md).

## The model

- `main` is **protected and always working**. Nobody pushes to it directly.
- No `dev` branch (we're two people). Every task = **one issue** → **one short branch** from `main` → **one PR**.
- PRs are merged with **Squash and merge**, then the branch is deleted.

## Branch names

`<type>/<issue>-<short-name>` — lowercase, kebab-case, 2–4 words.

| Type        | For                         | Example                          |
| ----------- | --------------------------- | -------------------------------- |
| `feat/`     | new functionality           | `feat/12-matching-list`          |
| `fix/`      | bug                         | `fix/18-login-error-message`     |
| `chore/`    | tooling, deps, config       | `chore/3-add-msw-exchanges`      |
| `docs/`     | documentation only          | `docs/7-api-contract-auth`       |
| `refactor/` | restructure, same behaviour | `refactor/21-split-profile-form` |

## Commit messages (Conventional Commits)

```
feat(matching): add partner card
fix(auth): show server error on login
chore: add msw handlers for exchanges
docs: describe time-bank endpoints
```

`type(scope): what, in imperative, lowercase`. The scope is the feature folder name.

## One task, start to finish

```bash
# 1. Start from an up-to-date main
git switch main
git pull

# 2. Open a branch for the task
git switch -c feat/12-matching-list

# 3. Work and commit in small steps
git add .
git commit -m "feat(matching): add suggestions list"

# 4. Before the PR: bring in the latest main and solve conflicts on YOUR branch
git fetch origin
git merge origin/main
npm run check

# 5. Push and open the PR
git push -u origin feat/12-matching-list
gh pr create --fill        # or open it on GitHub; fill the template, "Closes #12"
```

Then your teammate reviews → you **Squash and merge** on GitHub → delete the branch → back to step 1.

## Golden rules

- Keep PRs **small** (≈ under 400 lines) so they get reviewed fast.
- **Don't work on the same file at the same time.** If you must, talk first.
- If a branch lives more than a day, run `git merge origin/main` **every day**.
- Never commit `.env` — only `.env.example`.
- Never `git push --force`. Never rewrite history that is already pushed.
- Merge, don't rebase (simpler and safer for a two-person team).

## Resolving a conflict

1. `git merge origin/main` reports `CONFLICT in <file>`.
2. Open the file in VS Code — choose **Accept Current / Incoming / Both** for each block. Keep both sides when both are needed (common in `router.tsx`: keep both spread lines).
3. `npm run check`, then:
   ```bash
   git add <file>
   git commit        # finishes the merge
   ```
4. Unsure whose change is right? **Ask your teammate** before committing.
5. Want to cancel and start over? `git merge --abort`.
