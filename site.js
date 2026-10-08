(function () {
  var THEME_COLORS = {
    light: "#f7f5f0",
    dark: "#141413"
  };
  var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function systemTheme() {
    return prefersDarkScheme.matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    var nextTheme = theme === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;

    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", THEME_COLORS[nextTheme] || THEME_COLORS.dark);
    }
  }

  function initSystemTheme() {
    applyTheme(systemTheme());

    var handleSchemeChange = function () {
      applyTheme(systemTheme());
    };

    if (typeof prefersDarkScheme.addEventListener === "function") {
      prefersDarkScheme.addEventListener("change", handleSchemeChange);
    } else if (typeof prefersDarkScheme.addListener === "function") {
      prefersDarkScheme.addListener(handleSchemeChange);
    }
  }

  function markActiveLinks(scope) {
    if (!scope) {
      return;
    }
    var currentPath = window.location.pathname.split("/").pop() || "index.html";
    scope.querySelectorAll("a").forEach(function (link) {
      var href = (link.getAttribute("href") || "").replace("./", "");
      if (href === currentPath) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initNavigation() {
    markActiveLinks(document.querySelector(".site-nav"));
    markActiveLinks(document.querySelector(".footer-nav"));
  }

  function initCurrentYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (node) {
      node.textContent = year;
    });
  }

  /* Press "g" (or the [grid] colophon button) to see the baseline grid. */
  function initGridOverlay() {
    var button = document.querySelector("[data-grid-toggle]");
    if (!button) {
      return;
    }

    function setOverlay(on) {
      document.body.classList.toggle("grid-overlay-on", on);
      button.setAttribute("aria-pressed", String(on));
    }

    function toggle() {
      setOverlay(!document.body.classList.contains("grid-overlay-on"));
    }

    button.addEventListener("click", toggle);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOverlay(false);
        return;
      }
      if (event.key !== "g" && event.key !== "G") {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      var target = event.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      toggle();
    });
  }

  var AGENT_LAB_PRESETS = {
    builder: {
      name: "Builder",
      warmth: 6,
      pragmatism: 9,
      initiative: 8,
      soul: [
        "- Speak plainly and keep the tone grounded.",
        "- Prefer working systems over clever theater.",
        "- Stay human without getting indulgent.",
        "- Offer tradeoffs when a decision has real cost."
      ].join("\n"),
      memory: [
        "- The user values portable, open patterns over vendor lock-in.",
        "- Keep output useful for humans first.",
        "- Do not imply capabilities that are not actually present.",
        "- Preserve the user's voice while raising the quality bar."
      ].join("\n"),
      posture: [
        "- Name the task and the first concrete move.",
        "- Make reasonable assumptions when risk is low.",
        "- Ask questions only when they change the outcome.",
        "- Escalate on real blockers, not on routine ambiguity."
      ].join("\n")
    },
    operator: {
      name: "Operator",
      warmth: 5,
      pragmatism: 10,
      initiative: 9,
      soul: [
        "- Sound calm, precise, and unflustered.",
        "- Avoid drama, hype, and soft vagueness.",
        "- Keep language economical and operational.",
        "- Treat reliability as part of the personality."
      ].join("\n"),
      memory: [
        "- The user wants fewer surprises and cleaner handoffs.",
        "- Surface risk early and keep state explicit.",
        "- Prefer stable workflows to impressive-looking complexity."
      ].join("\n"),
      posture: [
        "- Start with the safest high-leverage action.",
        "- Separate facts, assumptions, and open risk.",
        "- Leave a crisp next step whenever work remains.",
        "- Never pretend a check was run if it was not run."
      ].join("\n")
    },
    guide: {
      name: "Guide",
      warmth: 9,
      pragmatism: 7,
      initiative: 6,
      soul: [
        "- Be warm, steady, and emotionally literate.",
        "- Reduce intimidation without reducing standards.",
        "- Translate complexity into plain language.",
        "- Keep the tone encouraging but not saccharine."
      ].join("\n"),
      memory: [
        "- The user may be thinking out loud and refining the ask as they go.",
        "- Preserve intent even when the phrasing is rough.",
        "- Favor clarity over jargon and structure over sprawl."
      ].join("\n"),
      posture: [
        "- Clarify the goal in one sentence before diving in.",
        "- Suggest the next sensible path instead of dumping options.",
        "- Slow down only when confidence is low or stakes are high.",
        "- Keep the user oriented about what is happening."
      ].join("\n")
    },
    editor: {
      name: "Editor",
      warmth: 4,
      pragmatism: 8,
      initiative: 7,
      soul: [
        "- Be sharp, disciplined, and clean.",
        "- Cut fluff fast but do not flatten the voice.",
        "- Favor strong structure and exact language.",
        "- Respect style when it serves meaning."
      ].join("\n"),
      memory: [
        "- The user wants signal, compression, and credibility.",
        "- Keep claims bounded and specific.",
        "- Improve structure before polishing wording."
      ].join("\n"),
      posture: [
        "- Start by finding the highest-leverage weakness.",
        "- Make the fix concrete instead of abstract.",
        "- Preserve what is distinctive; remove what is noisy.",
        "- State residual risk if something still feels soft."
      ].join("\n")
    }
  };

  function parseAgentLabItems(value) {
    return value
      .split(/\n+/)
      .map(function (line) {
        return line.trim().replace(/^[-*]\s*/, "");
      })
      .filter(Boolean)
      .slice(0, 6);
  }

  function describeWarmth(score) {
    if (score <= 3) {
      return "brisk";
    }
    if (score <= 6) {
      return "steady";
    }
    if (score <= 8) {
      return "warm";
    }
    return "deeply human";
  }

  function describePragmatism(score) {
    if (score <= 3) {
      return "exploratory";
    }
    if (score <= 6) {
      return "balanced";
    }
    if (score <= 8) {
      return "practical";
    }
    return "high";
  }

  function describeInitiative(score) {
    if (score <= 3) {
      return "reserved";
    }
    if (score <= 6) {
      return "measured";
    }
    if (score <= 8) {
      return "forward";
    }
    return "decisive";
  }

  function formatLabScore(score) {
    return String(score).padStart(2, "0") + " / 10";
  }

  function buildAgentLabSummary(name, warmth, pragmatism, initiative) {
    return (
      name +
      " should feel " +
      describeWarmth(warmth) +
      ", " +
      describePragmatism(pragmatism) +
      ", and " +
      describeInitiative(initiative) +
      ". It opens with a concrete first move, keeps context in view, and stays honest about limits."
    );
  }

  function buildAgentLabPacket(state) {
    var soulItems = parseAgentLabItems(state.soul);
    var memoryItems = parseAgentLabItems(state.memory);
    var postureItems = parseAgentLabItems(state.posture);

    return [
      "agent:",
      "  name: " + state.name,
      "  dimensions:",
      "    warmth: " + state.warmth + "/10 (" + describeWarmth(state.warmth) + ")",
      "    pragmatism: " + state.pragmatism + "/10 (" + describePragmatism(state.pragmatism) + ")",
      "    initiative: " + state.initiative + "/10 (" + describeInitiative(state.initiative) + ")",
      "",
      "soul:",
      soulItems.map(function (item) { return "  - " + item; }).join("\n"),
      "",
      "memory:",
      memoryItems.map(function (item) { return "  - " + item; }).join("\n"),
      "",
      "posture:",
      postureItems.map(function (item) { return "  - " + item; }).join("\n")
    ].join("\n");
  }

  function buildAgentLabPrompt(state) {
    var soulItems = parseAgentLabItems(state.soul);
    var memoryItems = parseAgentLabItems(state.memory);
    var postureItems = parseAgentLabItems(state.posture);

    return [
      "You are " + state.name + ".",
      "",
      "Enduring character:",
      soulItems.map(function (item) { return "- " + item; }).join("\n"),
      "",
      "Persistent context:",
      memoryItems.map(function (item) { return "- " + item; }).join("\n"),
      "",
      "Operating posture:",
      postureItems.map(function (item) { return "- " + item; }).join("\n"),
      "",
      "Behavioral mix:",
      "- Warmth: " + state.warmth + "/10 (" + describeWarmth(state.warmth) + ")",
      "- Pragmatism: " + state.pragmatism + "/10 (" + describePragmatism(state.pragmatism) + ")",
      "- Initiative: " + state.initiative + "/10 (" + describeInitiative(state.initiative) + ")",
      "",
      "Do not imply tools, memory, or permissions that are not actually available."
    ].join("\n");
  }

  /* Write to a node only when the value changed — keeps live regions
     from re-announcing identical content on every input event. */
  function setLiveText(node, value) {
    if (node.textContent !== value) {
      node.textContent = value;
    }
  }

  function setAgentLabChips(container, items) {
    container.innerHTML = "";
    items.forEach(function (item) {
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item;
      container.appendChild(chip);
    });
  }

  function initAgentLabs() {
    var labs = Array.from(document.querySelectorAll("[data-agent-lab]"));
    if (labs.length === 0) {
      return;
    }

    labs.forEach(function (lab) {
      var fields = {
        name: lab.querySelector('[data-lab-field="name"]'),
        soul: lab.querySelector('[data-lab-field="soul"]'),
        memory: lab.querySelector('[data-lab-field="memory"]'),
        posture: lab.querySelector('[data-lab-field="posture"]')
      };
      var sliders = {
        warmth: lab.querySelector('[data-lab-slider="warmth"]'),
        pragmatism: lab.querySelector('[data-lab-slider="pragmatism"]'),
        initiative: lab.querySelector('[data-lab-slider="initiative"]')
      };
      var outputs = {
        warmth: lab.querySelector('[data-lab-value="warmth"]'),
        pragmatism: lab.querySelector('[data-lab-value="pragmatism"]'),
        initiative: lab.querySelector('[data-lab-value="initiative"]')
      };
      var meterLabels = {
        warmth: lab.querySelector('[data-lab-meter-label="warmth"]'),
        pragmatism: lab.querySelector('[data-lab-meter-label="pragmatism"]'),
        initiative: lab.querySelector('[data-lab-meter-label="initiative"]')
      };
      var meterFills = {
        warmth: lab.querySelector('[data-lab-fill="warmth"]'),
        pragmatism: lab.querySelector('[data-lab-fill="pragmatism"]'),
        initiative: lab.querySelector('[data-lab-fill="initiative"]')
      };
      var title = lab.querySelector("[data-lab-title]");
      var summary = lab.querySelector("[data-lab-summary]");
      var packet = lab.querySelector("[data-lab-packet]");
      var prompt = lab.querySelector("[data-lab-prompt]");
      var traits = lab.querySelector("[data-lab-traits]");
      var presetButtons = Array.from(lab.querySelectorAll("[data-lab-preset]"));

      if (
        !fields.name || !fields.soul || !fields.memory || !fields.posture ||
        !sliders.warmth || !sliders.pragmatism || !sliders.initiative ||
        !outputs.warmth || !outputs.pragmatism || !outputs.initiative ||
        !meterLabels.warmth || !meterLabels.pragmatism || !meterLabels.initiative ||
        !meterFills.warmth || !meterFills.pragmatism || !meterFills.initiative ||
        !title || !summary || !packet || !prompt || !traits
      ) {
        return;
      }

      function render() {
        var state = {
          name: fields.name.value.trim() || "Untitled agent",
          soul: fields.soul.value,
          memory: fields.memory.value,
          posture: fields.posture.value,
          warmth: Number.parseInt(sliders.warmth.value || "5", 10),
          pragmatism: Number.parseInt(sliders.pragmatism.value || "5", 10),
          initiative: Number.parseInt(sliders.initiative.value || "5", 10)
        };

        setLiveText(outputs.warmth, formatLabScore(state.warmth));
        setLiveText(outputs.pragmatism, formatLabScore(state.pragmatism));
        setLiveText(outputs.initiative, formatLabScore(state.initiative));

        setLiveText(meterLabels.warmth, describeWarmth(state.warmth));
        setLiveText(meterLabels.pragmatism, describePragmatism(state.pragmatism));
        setLiveText(meterLabels.initiative, describeInitiative(state.initiative));

        meterFills.warmth.style.width = state.warmth * 10 + "%";
        meterFills.pragmatism.style.width = state.pragmatism * 10 + "%";
        meterFills.initiative.style.width = state.initiative * 10 + "%";

        setLiveText(title, state.name);
        setLiveText(summary, buildAgentLabSummary(state.name, state.warmth, state.pragmatism, state.initiative));
        setLiveText(packet, buildAgentLabPacket(state));
        setLiveText(prompt, buildAgentLabPrompt(state));

        var traitItems = [
          describeWarmth(state.warmth),
          describePragmatism(state.pragmatism),
          describeInitiative(state.initiative)
        ].concat(parseAgentLabItems(state.soul).slice(0, 2));
        setAgentLabChips(traits, traitItems);
      }

      function applyPreset(key) {
        var preset = AGENT_LAB_PRESETS[key];
        if (!preset) {
          return;
        }

        fields.name.value = preset.name;
        fields.soul.value = preset.soul;
        fields.memory.value = preset.memory;
        fields.posture.value = preset.posture;
        sliders.warmth.value = String(preset.warmth);
        sliders.pragmatism.value = String(preset.pragmatism);
        sliders.initiative.value = String(preset.initiative);

        presetButtons.forEach(function (button) {
          var active = button.dataset.labPreset === key;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
        });

        render();
      }

      presetButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", function () {
          applyPreset(button.dataset.labPreset || "builder");
        });
      });

      Object.keys(fields).forEach(function (key) {
        fields[key].addEventListener("input", render);
      });
      Object.keys(sliders).forEach(function (key) {
        sliders[key].addEventListener("input", render);
      });

      applyPreset((presetButtons[0] && presetButtons[0].dataset.labPreset) || "builder");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSystemTheme();
    initNavigation();
    initCurrentYear();
    initGridOverlay();
    initAgentLabs();
  });
})();
