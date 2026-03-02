# Agent Soul Kit

Portable `soul.md`, `memory.md`, and `posture.md` files for making agents feel more grounded, more consistent, and more useful.

## What this is

Most agents are competent but generic. They lose durable context, drift into flat tone, and often handle ambiguity badly. Agent Soul Kit makes those behaviors explicit and editable.

The core contract is three files:

- `soul.md`: voice, values, pacing, temperament
- `memory.md`: durable context, preferences, facts worth carrying forward
- `posture.md`: how the agent should act when the path is unclear

Then thin adapters compile those files into prompts or runtime instructions for different shells.

## Repo shape

```text
agent-soul-kit/
  souls/
  memories/
  postures/
  adapters/
  examples/
  playground/
  docs/
```

## Quick start

1. Pick one file from `souls/`, `memories/`, and `postures/`.
2. Read [adapters/generic-chat.md](./adapters/generic-chat.md) and compile a starter prompt.
3. Open the browser playground:

   ```bash
   python3 -m http.server 8080
   ```

4. Visit `http://localhost:8080/playground/`.

## Design rules

- Keep files short enough to read in under two minutes.
- Do not pretend the agent has tools or memory it does not really have.
- Make personality serve usefulness, not replace it.
- Separate enduring character from durable context.
- Make initiative explicit so the agent neither stalls nor overreaches.

## Starter profiles

- `souls/pragmatic-builder.md`: direct, grounded, execution-first
- `souls/warm-operator.md`: calm, helpful, steady under ambiguity
- `souls/sharp-editor.md`: compressed, exact, taste-driven

## Adapters

- [adapters/generic-chat.md](./adapters/generic-chat.md)
- [adapters/openai-api.md](./adapters/openai-api.md)
- [adapters/claude-code.md](./adapters/claude-code.md)
- [adapters/local-cli.md](./adapters/local-cli.md)

## Examples

- [examples/coding-agent/](./examples/coding-agent/)
- [examples/research-agent/](./examples/research-agent/)
- [examples/studio-agent/](./examples/studio-agent/)

## Evaluation

Use [docs/evaluation-guide.md](./docs/evaluation-guide.md) and [playground/scenarios.json](./playground/scenarios.json) to test whether a persona is actually better on clarity, restraint, usefulness, and consistency.
