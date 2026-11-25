# 04 · Code review & CI

**English** · [العربية](04-code-review.ar.md)

## Who reviews whom

**Your PRs are reviewed by your teammate, theirs by you** (GitHub doesn't let you approve your own PR).

`main` uses **light protection** — GitHub enforces only:

1. Changes reach `main` **through a PR** (no direct push), and
2. **CI is green** (the `check` job: lint + typecheck + format + build).

An approval is **not** enforced by GitHub, to keep things fast. It's still our habit: **merge after your teammate approves**. If they're unavailable and the change is small and urgent, you may merge with a green CI — then tell them so they look at it later.

## CI

`.github/workflows/ci.yml` runs on every PR and every push to `main`. It runs the same as `npm run check` locally — if it passes on your machine, it passes on CI.
Red CI? Open the PR → **Checks** → `check` → read the first red step.

## Review in 3 steps: Run · Try · Check

You don't need to be an expert. Follow these steps every time (~10–15 minutes).
With Claude Code / Codex: `/review-pr 15` walks you through all of it.

### 1. Run / شغّل

```bash
gh pr checkout 15        # switches to the PR's branch
npm install              # if package.json changed
npm run dev
```

### 2. Try / جرّب

- Follow the **How to test** steps written in the PR.
- Then try to break it a little:
  - refresh the page
  - make the window narrow (mobile)
  - what if the list is empty? what if the request fails?
  - does it look right in Arabic (RTL)?
- Compare with the screenshots in the PR.

### 3. Check / شيّك

Read the **Files changed** tab and tick:

- [ ] CI is green
- [ ] Does what the PR says, nothing unrelated; small enough to understand
- [ ] Files are in the right feature folder; no `@/features/x/...` deep imports
- [ ] API calls only in `api/`, endpoint exists in [05 · API contract](05-api-contract.md)
- [ ] No mock data imported in components, no hard-coded URLs/paths
- [ ] Loading / error / empty states exist
- [ ] RTL-safe classes (`ms-`, `pe-`, `text-start`…), no inline styles, no raw colors
- [ ] No component that already exists in `shared/components/ui`
- [ ] No `.env`, secrets, or leftover `console.log`
- [ ] Docs changed in both `.md` and `.ar.md` (if any)

### Decide

- All good → **Review changes → Approve**.
- Something wrong → **Request changes** with a concrete comment on the line:
  > "The list shows nothing when `data` is empty — can we use `EmptyState` here?"
- Small taste issue, not blocking → comment and still approve, prefix it with `nit:`.

When done, go back to your own branch: `git switch <your-branch>`.

## After approval (PR author)

1. Click **Squash and merge** (title = Conventional Commit, e.g. `feat(matching): add partner card (#15)`).
2. **Delete branch**.
3. Locally: `git switch main && git pull`.

## Good review manners

- Comment on the code, not the person. Ask questions instead of orders.
- Review within the same day when possible — a waiting PR blocks your teammate.
- If something is big, talk (call/chat) rather than long comment threads.
