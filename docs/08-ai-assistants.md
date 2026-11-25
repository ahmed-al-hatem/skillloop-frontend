# 08 · AI assistants (Claude Code & Codex)

**English** · [العربية](08-ai-assistants.ar.md)

Instead of memorizing git commands, the workflow is built around **Claude Code** and **Codex**. Both follow the same project rules.

## Where the rules live

| File              | Read by                     | Holds                                   |
| ----------------- | --------------------------- | --------------------------------------- |
| `AGENTS.md`       | Codex (automatically)       | **All** project rules — single source   |
| `CLAUDE.md`       | Claude Code (automatically) | `@AGENTS.md` import + Claude-only notes |
| `.agents/skills/` | Codex                       | The skills (source of truth)            |
| `.claude/skills/` | Claude Code                 | Copy of `.agents/skills/`               |

Rules are written **once** in `AGENTS.md`. To change a rule, edit `AGENTS.md` only (in a PR).
To change a skill, edit `.agents/skills/<name>/SKILL.md`, then run `npm run skills:sync` and commit both folders.

## The skills

| Command          | What it does                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `/start-task 12` | Reads issue #12, updates `main`, opens a correctly named branch (`feat/12-…`)                       |
| `/new-feature`   | Creates a feature folder following the structure and registers its route (one line)                 |
| `/add-endpoint`  | Schema + api function + query hook + MSW mock in one go — **refuses endpoints not in the contract** |
| `/finish-task`   | Runs `check`, commits, merges latest `main`, pushes, opens the PR. **Never merges or force-pushes** |
| `/review-pr 15`  | Checks out PR #15, runs it, guides you through Run · Try · Check, drafts comments                   |

In Codex, ask in words ("start task 12", "finish the task") or use `$start-task`; the skill is picked from its description.

## A typical day

```
/start-task 12                   → you're on feat/12-matching-list
"build the partner card from the issue"
/add-endpoint GET /matches/suggestions
npm run dev → look at it in the browser
/finish-task                     → PR opened, teammate requested as reviewer
```

Reviewing your teammate's work: `/review-pr 15`.

## Safety rules the agents follow

- No commits or pushes to `main`, no `--force`, no merging PRs.
- Destructive git commands (`reset --hard`, `clean`, deleting branches) only after explaining and asking.
- No invented endpoints — the contract in [05](05-api-contract.md) comes first.
- Never commit `.env`.

## Tips

- **Read what it changed** before `/finish-task` — you're the author, not the AI.
- Give the issue number; the agent reads the issue for context.
- If the agent wants to change `shared/` or a central file, make sure your teammate isn't editing it right now.
- Something unclear? Ask the agent to explain the error in simple words before fixing it.
