# Claude Code Adapter

Map the files into the repository's shared instructions layer.

## Pattern

- Put compiled guidance into the repo-level instruction file.
- Keep the files themselves alongside the codebase so changes are reviewable.
- Preserve explicit rules about tool honesty, edits, and escalation.

## Notes

- Posture matters more than tone for coding agents.
- Keep `memory.md` focused on durable project context, not temporary ticket detail.
