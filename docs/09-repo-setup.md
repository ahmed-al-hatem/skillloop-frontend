# 09 · Repository setup (one time)

**English** · [العربية](09-repo-setup.ar.md)

Done once by the repo owner. Tick the boxes as you go.

## 1. Invite the teammate

- [ ] **Settings → Collaborators → Add people** → teammate's GitHub username (role: Write).
- [ ] Replace `<teammate-username>` in `AGENTS.md` with their username (small PR).

## 2. Protect `main`

**Settings → Branches → Add branch ruleset** (or classic _branch protection rule_) for `main`:

We use **light protection** (done ✅ 2026-11-26): it blocks mistakes without slowing the daily flow.

- [x] Require a pull request before merging — required approvals: **0**
- [x] Require status checks to pass → **`check`** — branch does _not_ have to be up to date
- [x] Block force pushes · Restrict deletions
- [x] Include administrators — the rules apply to the owner too

Want it stricter later? Set required approvals to **1** and tick "Require branches to be up to date". Not now: with two people it makes every PR wait.

## 3. Merge settings

**Settings → General → Pull Requests:**

- [ ] Allow **squash merging** only (untick merge commits and rebase merging); default message: _Pull request title_
- [ ] **Automatically delete head branches**

## 4. Labels

Create: `feature`, `bug`, `chore`, `docs`, `shared-ui`, `blocked`, and one per feature: `auth`, `profile`, `matching`, `exchanges`, `time-bank`, `reviews`.

## 5. Project board

**Projects → New project → Board**, link it to the repo, columns:
**Todo → In progress → Review → Done**.

- Every task is an issue (template: **Task**). Add it to the board.
- Moving cards: start → _In progress_, PR opened → _Review_, merged → _Done_ (enable the built-in workflows "Item closed → Done" and "Pull request merged → Done").

## 6. First tasks (suggested)

After the scaffold is merged, split by feature so you don't touch the same files:

| Developer A            | Developer B          |
| ---------------------- | -------------------- |
| `auth`                 | `profile` / skills   |
| `exchanges` / sessions | `reviews`            |
| `time-bank`            | `matching` (real UI) |

Shared UI needs (modal, select, avatar…) → separate small `shared-ui` PRs first.
