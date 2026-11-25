## What changed / شو تغيّر

<!-- 1–3 lines. What does the user see now that they didn't before? -->

Closes #

## Screenshots / لقطات شاشة

<!-- Required for any UI change. Drag images here. Delete this section if no UI changed. -->

## How to test / كيف أجرّب

<!-- Steps for the reviewer, e.g.: open /matching → 3 partner cards appear. -->

1.

## Author checklist / قبل ما تطلب مراجعة

- [ ] `npm run check` passes locally
- [ ] Branch is up to date with `main` (`git merge origin/main`)
- [ ] PR is small (≈ under 400 lines) and does one thing
- [ ] UI works in RTL and on a narrow (mobile) screen
- [ ] Loading / error / empty states handled
- [ ] No `.env`, secrets, or `console.log` left behind
- [ ] Docs updated in **both** `.md` and `.ar.md` (if docs changed)

---

<details>
<summary>Reviewer checklist / للمراجِع — Run · Try · Check</summary>

**1. Run / شغّل**

```bash
gh pr checkout <PR number>
npm install
npm run dev
```

**2. Try / جرّب** — follow "How to test" above. Also try: refresh the page, a narrow window, empty data.

**3. Check / شيّك**

- [ ] CI is green
- [ ] It does what the PR says, nothing broken around it
- [ ] Code is in the right feature folder; no deep imports from another feature
- [ ] No mock data imported in components; no hard-coded API URLs
- [ ] Names are clear; no copy-pasted component that already exists in `shared/components/ui`

Then: **Approve**, or **Request changes** with a concrete comment. Full guide: `docs/04-code-review.md`.

</details>
