(function () {
  const presetMap = {
    builder: {
      name: "Pragmatic Builder",
      soul: "../souls/pragmatic-builder.md",
      memory: "../memories/product-lead.md",
      posture: "../postures/decisive.md"
    },
    operator: {
      name: "Warm Operator",
      soul: "../souls/warm-operator.md",
      memory: "../memories/founder-context.md",
      posture: "../postures/default.md"
    },
    editor: {
      name: "Sharp Editor",
      soul: "../souls/sharp-editor.md",
      memory: "../memories/personal-assistant.md",
      posture: "../postures/gentle.md"
    }
  };

  function cleanBullets(text) {
    return text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2));
  }

  function buildPacket(name, soul, memory, posture) {
    return [
      "agent:",
      `  name: ${name}`,
      "",
      "soul:",
      ...cleanBullets(soul).map((item) => `  - ${item}`),
      "",
      "memory:",
      ...cleanBullets(memory).map((item) => `  - ${item}`),
      "",
      "posture:",
      ...cleanBullets(posture).map((item) => `  - ${item}`)
    ].join("\n");
  }

  function buildPrompt(name, soul, memory, posture) {
    return [
      `You are ${name}.`,
      "",
      "Enduring character:",
      ...cleanBullets(soul).map((item) => `- ${item}`),
      "",
      "Persistent context:",
      ...cleanBullets(memory).map((item) => `- ${item}`),
      "",
      "Operating posture:",
      ...cleanBullets(posture).map((item) => `- ${item}`),
      "",
      "Do not imply tools, memory, or permissions that are not actually available."
    ].join("\n");
  }

  async function loadText(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    return response.text();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const preset = document.querySelector("#preset");
    const name = document.querySelector("#name");
    const soul = document.querySelector("#soul");
    const memory = document.querySelector("#memory");
    const posture = document.querySelector("#posture");
    const packet = document.querySelector("#packet");
    const prompt = document.querySelector("#prompt");

    function render() {
      packet.textContent = buildPacket(name.value.trim() || "Untitled Agent", soul.value, memory.value, posture.value);
      prompt.textContent = buildPrompt(name.value.trim() || "Untitled Agent", soul.value, memory.value, posture.value);
    }

    async function applyPreset(key) {
      const next = presetMap[key];
      if (!next) {
        return;
      }

      name.value = next.name;
      const [nextSoul, nextMemory, nextPosture] = await Promise.all([
        loadText(next.soul),
        loadText(next.memory),
        loadText(next.posture)
      ]);

      soul.value = nextSoul.trim();
      memory.value = nextMemory.trim();
      posture.value = nextPosture.trim();
      render();
    }

    preset.addEventListener("change", () => {
      applyPreset(preset.value).catch((error) => {
        packet.textContent = error.message;
      });
    });

    [name, soul, memory, posture].forEach((node) => {
      node.addEventListener("input", render);
    });

    await applyPreset("builder");
  });
})();
