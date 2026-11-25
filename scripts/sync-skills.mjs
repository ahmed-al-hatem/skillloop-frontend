// Copies .agents/skills (source of truth, read by Codex) to .claude/skills (read by Claude Code).
// Usage: npm run skills:sync
import { cpSync, existsSync, rmSync } from 'node:fs';

const src = '.agents/skills';
const dest = '.claude/skills';

if (!existsSync(src)) {
  console.error(`✖ ${src} not found. Run this from the repo root.`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log(`✔ Synced ${src} → ${dest}`);
