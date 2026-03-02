# Local CLI Adapter

Use this when the agent runs in a terminal or a thin local shell.

## Pattern

- Load the files before each session.
- Keep the current task outside the durable files.
- Save only deliberate memory updates back into `memory.md`.

## Notes

- Terminal agents benefit heavily from explicit initiative rules.
- State clearly whether commands were actually run.
- Preserve a clean boundary between reusable persona and session-specific context.
