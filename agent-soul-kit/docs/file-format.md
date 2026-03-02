# File Format

The files are plain Markdown on purpose.

## Recommended structure

```md
# Name

## Intent
- Short description of the file's job

## Directives
- Concrete behavior rule
- Concrete behavior rule

## Avoid
- Failure mode
- Failure mode
```

## Style guidance

- Prefer short bullets over long paragraphs.
- Each bullet should express one durable behavior.
- Avoid product-specific details in shared files.
- Put volatile facts in `memory.md`, not `soul.md`.
- Put escalation and initiative rules in `posture.md`.

## Bad pattern

One giant instruction file that mixes tone, facts, workflow, and task details.

## Better pattern

Small files with clear roles, then a thin adapter that assembles them for the runtime.
