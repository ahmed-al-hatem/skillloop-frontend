@AGENTS.md

## Claude Code notes

- All project rules are in `AGENTS.md` (imported above). Do not duplicate rules here.
- Project skills live in `.claude/skills/` — a copy of `.agents/skills/`, which is the source of truth. Edit skills only in `.agents/skills/`, then run `npm run skills:sync`.
- The user can run them directly: `/start-task 12`, `/new-feature`, `/add-endpoint`, `/finish-task`, `/review-pr 15`.
