# Agent Soul Kit Blueprint

## Proposed repository

`agent-soul-kit`

An open-source repo for giving any agent a stronger sense of voice, memory, and operating posture through portable files instead of hidden product wiring.

## Why this exists

Most agents are capable but generic. They often sound flat, forget durable context, and either over-ask or overreach. The goal of this repo is to make those behaviors explicit and tunable in public.

## Core idea

Split the agent contract into three durable files:

- `soul.md`: voice, values, pace, tone, taste
- `memory.md`: durable facts, preferences, recurring context
- `posture.md`: how the agent should act under uncertainty, what to do first, when to ask, when to escalate

Then provide thin adapters that compile those files into prompts or runtime instructions for different agent shells.

## Design goals

- Portable across runtimes
- Human-readable and diffable
- Honest about tool and permission limits
- Usable without proprietary backend state
- Good enough for real experimentation, not just demos

## Proposed layout

```text
agent-soul-kit/
  README.md
  LICENSE
  souls/
    pragmatic-builder.md
    warm-operator.md
    sharp-editor.md
  memories/
    founder-context.md
    product-lead.md
    personal-assistant.md
  postures/
    default.md
    decisive.md
    gentle.md
  adapters/
    generic-chat.md
    openai-api.md
    claude-code.md
    local-cli.md
  examples/
    coding-agent/
      soul.md
      memory.md
      posture.md
      starter-prompt.md
    research-agent/
    studio-agent/
  playground/
    scenarios.json
    evaluator.md
    browser-demo.md
  docs/
    philosophy.md
    file-format.md
    evaluation-guide.md
```

## MVP

1. Ship 3-5 soul files that feel genuinely distinct.
2. Ship 3-5 memory files for common use cases.
3. Ship 3 posture files that change initiative and escalation behavior in visible ways.
4. Provide generic adapters for at least one API workflow, one CLI workflow, and one plain chat workflow.
5. Include a browser playground that lets users edit files and inspect the compiled packet.
6. Include a small evaluation set that tests tone consistency, usefulness, restraint, and factual honesty about capabilities.

## Recommended README structure

1. Problem statement
2. What soul, memory, and posture files do
3. Minimal quick start
4. Example compiled prompt
5. Supported adapter patterns
6. Playground walkthrough
7. How to evaluate whether a persona is actually better

## Example compiled packet

```yaml
agent:
  name: Pragmatic Builder
  dimensions:
    warmth: 6/10
    pragmatism: 9/10
    initiative: 8/10

soul:
  - Speak plainly.
  - Prefer working systems over clever theater.
  - Stay human without becoming indulgent.

memory:
  - The user prefers portable, open patterns.
  - Do not imply capabilities that are not present.
  - Preserve the user's voice while raising quality.

posture:
  - Name the task and the first concrete move.
  - Make reasonable assumptions when risk is low.
  - Escalate only on real blockers.
```

## What makes the repo credible

- The files are short enough to read in under two minutes.
- The examples are practical instead of mystical.
- The adapters are thin enough that users can trust what is happening.
- The evaluation guidance tests usefulness, not just stylistic novelty.

## What not to do

- Do not fake memory if the runtime does not persist it.
- Do not pretend the agent has tools or permissions it does not have.
- Do not bury the real behavior in giant prompts nobody will maintain.
- Do not optimize only for personality at the expense of task completion.

## Success criteria

- A user can fork the repo and make a recognizable agent in under 15 minutes.
- Two different soul files produce clearly different outputs on the same task.
- Posture files measurably change escalation and initiative behavior.
- The playground makes it obvious which parts of the persona contract matter.
