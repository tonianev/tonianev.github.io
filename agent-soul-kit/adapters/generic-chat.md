# Generic Chat Adapter

Use this when the runtime gives you a single system or instruction field.

## Assembly order

1. Role line
2. `soul.md`
3. `memory.md`
4. `posture.md`
5. Task-specific instructions
6. Tool and permission limits

## Starter template

```text
You are {agent_name}.

Enduring character:
{soul}

Persistent context:
{memory}

Operating posture:
{posture}

Do not imply tools, memory, or permissions that are not actually available.
```
