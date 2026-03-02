(function () {
  const THEME_COLORS = {
    light: "#edf1f7",
    dark: "#0f1729"
  };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function supportsMotion() {
    return !prefersReducedMotion.matches;
  }

  function systemTheme() {
    return prefersDarkScheme.matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", THEME_COLORS[nextTheme] || THEME_COLORS.light);
    }
  }

  function initSystemTheme() {
    applyTheme(systemTheme());

    const handleSchemeChange = () => {
      applyTheme(systemTheme());
    };

    if (typeof prefersDarkScheme.addEventListener === "function") {
      prefersDarkScheme.addEventListener("change", handleSchemeChange);
    } else if (typeof prefersDarkScheme.addListener === "function") {
      prefersDarkScheme.addListener(handleSchemeChange);
    }
  }

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
      });

      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          document.body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });

      const currentPath = window.location.pathname.split("/").pop() || "index.html";
      nav.querySelectorAll("a").forEach((link) => {
        const href = (link.getAttribute("href") || "").replace("./", "");
        if (href === currentPath) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });
    }

    const footerNav = document.querySelector(".footer-nav");
    if (footerNav) {
      const currentPath = window.location.pathname.split("/").pop() || "index.html";
      footerNav.querySelectorAll("a").forEach((link) => {
        const href = (link.getAttribute("href") || "").replace("./", "");
        if (href === currentPath) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });
    }
  }

  function initCurrentYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((node) => {
      node.textContent = year;
    });
  }

  function initSmoothScrollAnchors() {
    if (!supportsMotion()) {
      return;
    }

    function scrollToHash(hash, updateHistory) {
      if (!hash || hash === "#") {
        return false;
      }

      const target = document.querySelector(hash);
      if (!target) {
        return false;
      }

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (target instanceof HTMLElement) {
        target.focus({ preventScroll: true });
      }
      if (updateHistory) {
        window.history.replaceState(null, "", hash);
      }
      return true;
    }

    document.querySelectorAll('a[href*="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        let url;
        try {
          url = new URL(link.getAttribute("href") || "", window.location.href);
        } catch (_error) {
          return;
        }

        if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
          return;
        }

        if (!url.hash || url.hash === "#") {
          return;
        }

        event.preventDefault();
        scrollToHash(url.hash, true);
      });
    });

    if (window.location.hash) {
      window.requestAnimationFrame(() => {
        scrollToHash(window.location.hash, false);
      });
    }
  }

  function siblingRevealIndex(element) {
    if (!element.parentElement) {
      return 0;
    }

    const siblings = Array.from(element.parentElement.children).filter((node) => node.hasAttribute("data-reveal"));
    return Math.max(0, siblings.indexOf(element));
  }

  function revealElement(element) {
    if (element.classList.contains("is-visible")) {
      return;
    }

    const delay = siblingRevealIndex(element) * 60;
    element.style.setProperty("--reveal-delay", `${delay}ms`);

    if (!supportsMotion()) {
      element.classList.add("is-visible");
      return;
    }

    element.classList.add("is-animating");
    window.requestAnimationFrame(() => {
      element.classList.add("is-visible");
    });

    const cleanup = () => {
      element.classList.remove("is-animating");
      element.removeEventListener("transitionend", cleanup);
    };

    element.addEventListener("transitionend", cleanup);
    window.setTimeout(cleanup, 900);
  }

  function initRevealAnimations() {
    const items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (items.length === 0) {
      return;
    }

    if (!supportsMotion() || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          revealElement(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    items.forEach((item) => observer.observe(item));
  }

  function formatCounterValue(node, value) {
    const decimals = Number.parseInt(node.dataset.countDecimals || "0", 10);
    const prefix = node.dataset.countPrefix || "";
    const suffix = node.dataset.countSuffix || "";
    const rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    return `${prefix}${rounded}${suffix}`;
  }

  function renderCounterFinal(node) {
    const target = Number.parseFloat(node.dataset.countTo || "0");
    node.textContent = formatCounterValue(node, target);
    node.dataset.countAnimated = "true";
  }

  function animateCounter(node) {
    if (node.dataset.countAnimated === "true") {
      return;
    }

    const target = Number.parseFloat(node.dataset.countTo || "0");
    const start = Number.parseFloat(node.dataset.countFrom || "0");
    const duration = Number.parseInt(node.dataset.countDuration || "1200", 10);

    if (!supportsMotion()) {
      renderCounterFinal(node);
      return;
    }

    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (target - start) * eased;
      node.textContent = formatCounterValue(node, value);

      if (progress < 1) {
        window.requestAnimationFrame(frame);
      } else {
        node.dataset.countAnimated = "true";
      }
    }

    window.requestAnimationFrame(frame);
  }

  function initCounters() {
    const counters = Array.from(document.querySelectorAll("[data-count-to]"));
    if (counters.length === 0) {
      return;
    }

    counters.forEach((counter) => {
      counter.dataset.countAnimated = "false";
      counter.textContent = counter.dataset.countPrefix ? `${counter.dataset.countPrefix}0${counter.dataset.countSuffix || ""}` : "0";
    });

    if (!supportsMotion() || !("IntersectionObserver" in window)) {
      counters.forEach(renderCounterFinal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  function initCvPreview() {
    const wrap = document.querySelector("[data-cv-frame-wrap]");
    const frame = document.querySelector("[data-cv-frame]");
    const fallback = document.querySelector("[data-cv-fallback]");
    if (!wrap || !frame || !fallback) {
      return;
    }

    let loadSettled = false;
    const fallbackDelayMs = 1200;

    function setFallbackVisible(visible) {
      wrap.classList.toggle("is-fallback", visible);
      fallback.hidden = !visible;
      frame.setAttribute("aria-hidden", visible ? "true" : "false");
    }

    const fallbackTimer = window.setTimeout(() => {
      if (!loadSettled) {
        setFallbackVisible(true);
      }
    }, fallbackDelayMs);

    frame.addEventListener(
      "load",
      () => {
        loadSettled = true;
        window.clearTimeout(fallbackTimer);
        setFallbackVisible(false);
      },
      { once: true }
    );

    frame.addEventListener(
      "error",
      () => {
        window.clearTimeout(fallbackTimer);
        setFallbackVisible(true);
      },
      { once: true }
    );
  }

  function initHeroParallax() {
    const hero = document.querySelector(".hero");
    if (!hero || !supportsMotion()) {
      return;
    }

    let rafId = 0;
    let pointerX = 0;
    let pointerY = 0;

    function commit() {
      hero.style.setProperty("--hero-blob-x", `${pointerX * 12}px`);
      hero.style.setProperty("--hero-blob-y", `${pointerY * 10}px`);
      hero.style.setProperty("--hero-blob2-x", `${pointerX * -8}px`);
      hero.style.setProperty("--hero-blob2-y", `${pointerY * -12}px`);
      rafId = 0;
    }

    function schedule() {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(commit);
    }

    hero.addEventListener("mousemove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = rect.width ? (event.clientX - rect.left) / rect.width - 0.5 : 0;
      const y = rect.height ? (event.clientY - rect.top) / rect.height - 0.5 : 0;
      pointerX = x;
      pointerY = y;
      schedule();
    });

    hero.addEventListener("mouseleave", () => {
      pointerX = 0;
      pointerY = 0;
      schedule();
    });

    window.addEventListener(
      "scroll",
      () => {
        const rect = hero.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        const progress = Math.max(-1, Math.min(1, rect.top / viewport));
        hero.style.setProperty("--hero-scroll-shift", `${progress * -10}px`);
      },
      { passive: true }
    );
  }

  const AGENT_LAB_PRESETS = {
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
      .map((line) => line.trim().replace(/^[-*]\s*/, ""))
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

  function buildAgentLabSummary(name, warmth, pragmatism, initiative) {
    const warmthText = describeWarmth(warmth);
    const pragmatismText = describePragmatism(pragmatism);
    const initiativeText = describeInitiative(initiative);

    return `${name} should feel ${warmthText}, ${pragmatismText}, and ${initiativeText}. It opens with a concrete first move, keeps context in view, and stays honest about limits.`;
  }

  function buildAgentLabPacket(state) {
    const soulItems = parseAgentLabItems(state.soul);
    const memoryItems = parseAgentLabItems(state.memory);
    const postureItems = parseAgentLabItems(state.posture);

    return [
      "agent:",
      `  name: ${state.name}`,
      "  dimensions:",
      `    warmth: ${state.warmth}/10 (${describeWarmth(state.warmth)})`,
      `    pragmatism: ${state.pragmatism}/10 (${describePragmatism(state.pragmatism)})`,
      `    initiative: ${state.initiative}/10 (${describeInitiative(state.initiative)})`,
      "",
      "soul:",
      ...soulItems.map((item) => `  - ${item}`),
      "",
      "memory:",
      ...memoryItems.map((item) => `  - ${item}`),
      "",
      "posture:",
      ...postureItems.map((item) => `  - ${item}`)
    ].join("\n");
  }

  function buildAgentLabPrompt(state) {
    const soulItems = parseAgentLabItems(state.soul);
    const memoryItems = parseAgentLabItems(state.memory);
    const postureItems = parseAgentLabItems(state.posture);

    return [
      `You are ${state.name}.`,
      "",
      "Enduring character:",
      ...soulItems.map((item) => `- ${item}`),
      "",
      "Persistent context:",
      ...memoryItems.map((item) => `- ${item}`),
      "",
      "Operating posture:",
      ...postureItems.map((item) => `- ${item}`),
      "",
      "Behavioral mix:",
      `- Warmth: ${state.warmth}/10 (${describeWarmth(state.warmth)})`,
      `- Pragmatism: ${state.pragmatism}/10 (${describePragmatism(state.pragmatism)})`,
      `- Initiative: ${state.initiative}/10 (${describeInitiative(state.initiative)})`,
      "",
      "Do not imply tools, memory, or permissions that are not actually available."
    ].join("\n");
  }

  function setAgentLabChips(container, items) {
    container.innerHTML = "";
    items.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item;
      container.appendChild(chip);
    });
  }

  function initAgentLabs() {
    const labs = Array.from(document.querySelectorAll("[data-agent-lab]"));
    if (labs.length === 0) {
      return;
    }

    labs.forEach((lab) => {
      const fields = {
        name: lab.querySelector('[data-lab-field="name"]'),
        soul: lab.querySelector('[data-lab-field="soul"]'),
        memory: lab.querySelector('[data-lab-field="memory"]'),
        posture: lab.querySelector('[data-lab-field="posture"]')
      };
      const sliders = {
        warmth: lab.querySelector('[data-lab-slider="warmth"]'),
        pragmatism: lab.querySelector('[data-lab-slider="pragmatism"]'),
        initiative: lab.querySelector('[data-lab-slider="initiative"]')
      };
      const outputs = {
        warmth: lab.querySelector('[data-lab-value="warmth"]'),
        pragmatism: lab.querySelector('[data-lab-value="pragmatism"]'),
        initiative: lab.querySelector('[data-lab-value="initiative"]')
      };
      const meterLabels = {
        warmth: lab.querySelector('[data-lab-meter-label="warmth"]'),
        pragmatism: lab.querySelector('[data-lab-meter-label="pragmatism"]'),
        initiative: lab.querySelector('[data-lab-meter-label="initiative"]')
      };
      const meterFills = {
        warmth: lab.querySelector('[data-lab-fill="warmth"]'),
        pragmatism: lab.querySelector('[data-lab-fill="pragmatism"]'),
        initiative: lab.querySelector('[data-lab-fill="initiative"]')
      };
      const title = lab.querySelector("[data-lab-title]");
      const summary = lab.querySelector("[data-lab-summary]");
      const packet = lab.querySelector("[data-lab-packet]");
      const prompt = lab.querySelector("[data-lab-prompt]");
      const traits = lab.querySelector("[data-lab-traits]");
      const presetButtons = Array.from(lab.querySelectorAll("[data-lab-preset]"));

      function render() {
        const state = {
          name: fields.name.value.trim() || "Untitled agent",
          soul: fields.soul.value,
          memory: fields.memory.value,
          posture: fields.posture.value,
          warmth: Number.parseInt(sliders.warmth.value || "5", 10),
          pragmatism: Number.parseInt(sliders.pragmatism.value || "5", 10),
          initiative: Number.parseInt(sliders.initiative.value || "5", 10)
        };

        outputs.warmth.textContent = String(state.warmth);
        outputs.pragmatism.textContent = String(state.pragmatism);
        outputs.initiative.textContent = String(state.initiative);

        meterLabels.warmth.textContent = describeWarmth(state.warmth);
        meterLabels.pragmatism.textContent = describePragmatism(state.pragmatism);
        meterLabels.initiative.textContent = describeInitiative(state.initiative);

        meterFills.warmth.style.width = `${state.warmth * 10}%`;
        meterFills.pragmatism.style.width = `${state.pragmatism * 10}%`;
        meterFills.initiative.style.width = `${state.initiative * 10}%`;

        title.textContent = state.name;
        summary.textContent = buildAgentLabSummary(state.name, state.warmth, state.pragmatism, state.initiative);
        packet.textContent = buildAgentLabPacket(state);
        prompt.textContent = buildAgentLabPrompt(state);

        const traitItems = [
          describeWarmth(state.warmth),
          describePragmatism(state.pragmatism),
          describeInitiative(state.initiative)
        ].concat(parseAgentLabItems(state.soul).slice(0, 2));
        setAgentLabChips(traits, traitItems);
      }

      function applyPreset(key) {
        const preset = AGENT_LAB_PRESETS[key];
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

        presetButtons.forEach((button) => {
          const active = button.dataset.labPreset === key;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
        });

        render();
      }

      presetButtons.forEach((button) => {
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
          applyPreset(button.dataset.labPreset || "builder");
        });
      });

      Object.values(fields).forEach((field) => {
        field.addEventListener("input", render);
      });
      Object.values(sliders).forEach((slider) => {
        slider.addEventListener("input", render);
      });

      applyPreset((presetButtons[0] && presetButtons[0].dataset.labPreset) || "builder");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSystemTheme();
    initNavigation();
    initCurrentYear();
    initSmoothScrollAnchors();
    initRevealAnimations();
    initCounters();
    initCvPreview();
    initHeroParallax();
    initAgentLabs();
  });
})();
