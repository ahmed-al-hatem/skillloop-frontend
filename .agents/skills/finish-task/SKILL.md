---
name: finish-task
description: Finish a task in the SkillLoop frontend — run checks, commit, sync with main, push the branch and open a pull request with the template. Use when the user says "I'm done", "open a PR", "ship this", or invokes /finish-task. Never merges the PR.
---

# finish-task

Goal: the user's work is committed on their branch, up to date with `main`, pushed, and a PR is open.

## 1. Safety checks

- `git branch --show-current`. If it is `main`: STOP. Explain, then offer to move the work to a new branch (`git switch -c feat/<N>-<name>`) — uncommitted changes move with it.
- Find the issue number from the branch name (`feat/12-…` → 12). If none, ask.

## 2. Quality gate

- Run `npm run check`. If only formatting fails, run `npm run format`. Fix lint/type/build errors caused by this branch. If an error is unrelated to the change, tell the user instead of fixing random code.
- Run `git status` and `git diff --stat`. Make sure no `.env`, secrets, `node_modules`, or unrelated files are included. Show the user a short summary of what will be committed.

## 3. Commit

- Group into 1–3 logical commits, Conventional Commits with feature scope:
  `feat(matching): add suggestions list`, `fix(auth): show server error on login`.
- If docs were changed, confirm both `.md` and `.ar.md` versions were updated.

## 4. Sync with main

```bash
git fetch origin
git merge origin/main
```

- On conflicts: list the files, explain each conflict in plain words, propose a resolution, and **ask the user before finalizing** if both sides changed real logic. After resolving: `npm run check` again, then commit the merge.

## 5. Push and open the PR

```bash
git push -u origin HEAD
gh pr create --base main --title "<conventional title>" --body-file <tmp file>
```

- Build the body from `.github/pull_request_template.md`: what changed, `Closes #<N>`, how to test, checklist ticked honestly. Remind the user to add screenshots for UI changes.
- Request review from the other frontend developer (usernames are in `AGENTS.md` → Project): `--reviewer <the other one>`. Check who you are with `gh api user --jq .login`. If the username is still a placeholder, tell the user to add the reviewer manually.

## 6. Report

PR URL, CI status (`gh pr checks`), and next step: wait for review; to address comments, commit to the same branch and push again.

## Never

- `git push --force`, merging the PR, pushing to `main`, or committing secrets.
