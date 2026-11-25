---
name: review-pr
description: >-
  Help the user review a teammate's pull request in the SkillLoop frontend — check it out, run it, guide manual testing, and walk the review checklist. Use when the user says "review PR #N", "check my teammate's PR", or invokes /review-pr. Never approves or merges on its own.
---

# review-pr

Goal: the user (who may be new to code review) understands the PR, has run it locally, and can decide **Approve** or **Request changes** with clear comments. Follow the three steps: **Run · Try · Check**.

## Inputs

- PR number. If missing: `gh pr list --state open` and let the user pick.

## 0. Prepare

- `git status --porcelain`. If there are uncommitted changes: STOP and ask whether to commit or stash them first (`git stash push -m "before review #N"`). Never discard.
- Remember the current branch to return to it at the end.

## 1. Run / شغّل

```bash
gh pr view <N>                # title, description, linked issue
gh pr checks <N>              # CI status
gh pr checkout <N>
npm install                   # only if package.json / package-lock.json changed
npm run check
```

- If CI or `npm run check` fails: tell the user this alone is a reason to **Request changes**, and quote the error in plain words.
- Start the app with `npm run dev` (in the background) and give the user the URL.

## 2. Try / جرّب

- Turn the PR's "How to test" section into a short numbered list the user can follow in the browser.
- Add 2–3 extra checks that fit the change: refresh the page, narrow (mobile) window, empty list, slow/failed request (in MSW handlers you can temporarily return an error), RTL layout.
- Ask the user what they saw. Do not claim you tested in the browser unless you actually did.

## 3. Check / شيّك

Read the diff (`gh pr diff <N>`) and report against this list — each item ✅ / ⚠️ with file:line:

- [ ] Does what the PR says and nothing unrelated; size is reasonable (≈ < 400 lines)
- [ ] Files are in the right feature folder; no deep imports into another feature; `shared/` doesn't import features
- [ ] API calls only in `api/`, responses validated with Zod, endpoint exists in `docs/05-api-contract.md`
- [ ] No mock data imported in components; no hard-coded URLs or paths (uses `ROUTES`)
- [ ] Loading / error / empty states handled
- [ ] RTL-safe classes (`ms-`/`me-`/`ps-`/`pe-`/`text-start`), Tailwind tokens, no inline styles
- [ ] No duplicate of an existing `shared/components/ui` component
- [ ] No `.env`, secrets, leftover `console.log`; docs changed in both `.md` and `.ar.md`

Explain each ⚠️ simply and draft a polite, specific review comment for it.

## 4. Decide

- Propose **Approve** (all ✅, CI green) or **Request changes** (list the comments). The user decides.
- Only after the user explicitly says so, submit it:
  - `gh pr review <N> --approve --body "<text>"`
  - `gh pr review <N> --request-changes --body "<text>"`
- Merging is done by the PR author on GitHub (**Squash and merge**), not by this skill.

## 5. Clean up

Stop the dev server, `git switch <original branch>`, and `git stash pop` if you stashed.

## Never

- Approve, merge, push, or commit on the teammate's branch.
