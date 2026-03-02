(function () {
  var THEME_COLORS = {
    light: "#f0f4f8",
    dark: "#0a0f1e"
  };
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function supportsMotion() {
    return !prefersReducedMotion.matches;
  }

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

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector("#site-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", String(open));
      });

      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          document.body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });

      var currentPath = window.location.pathname.split("/").pop() || "index.html";
      nav.querySelectorAll("a").forEach(function (link) {
        var href = (link.getAttribute("href") || "").replace("./", "");
        if (href === currentPath) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });
    }

    var footerNav = document.querySelector(".footer-nav");
    if (footerNav) {
      var currentPath = window.location.pathname.split("/").pop() || "index.html";
      footerNav.querySelectorAll("a").forEach(function (link) {
        var href = (link.getAttribute("href") || "").replace("./", "");
        if (href === currentPath) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });
    }
  }

  function initCurrentYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (node) {
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

      var target = document.querySelector(hash);
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

    document.querySelectorAll('a[href*="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var url;
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
      window.requestAnimationFrame(function () {
        scrollToHash(window.location.hash, false);
      });
    }
  }

  function siblingRevealIndex(element) {
    if (!element.parentElement) {
      return 0;
    }

    var siblings = Array.from(element.parentElement.children).filter(function (node) {
      return node.hasAttribute("data-reveal");
    });
    return Math.max(0, siblings.indexOf(element));
  }

  function revealElement(element) {
    if (element.classList.contains("is-visible")) {
      return;
    }

    var delay = siblingRevealIndex(element) * 60;
    element.style.setProperty("--reveal-delay", delay + "ms");

    if (!supportsMotion()) {
      element.classList.add("is-visible");
      return;
    }

    element.classList.add("is-animating");
    window.requestAnimationFrame(function () {
      element.classList.add("is-visible");
    });

    var cleanup = function () {
      element.classList.remove("is-animating");
      element.removeEventListener("transitionend", cleanup);
    };

    element.addEventListener("transitionend", cleanup);
    window.setTimeout(cleanup, 900);
  }

  function initRevealAnimations() {
    var items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (items.length === 0) {
      return;
    }

    if (!supportsMotion() || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
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

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function formatCounterValue(node, value) {
    var decimals = Number.parseInt(node.dataset.countDecimals || "0", 10);
    var prefix = node.dataset.countPrefix || "";
    var suffix = node.dataset.countSuffix || "";
    var rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    return prefix + rounded + suffix;
  }

  function renderCounterFinal(node) {
    var target = Number.parseFloat(node.dataset.countTo || "0");
    node.textContent = formatCounterValue(node, target);
    node.dataset.countAnimated = "true";
  }

  function animateCounter(node) {
    if (node.dataset.countAnimated === "true") {
      return;
    }

    var target = Number.parseFloat(node.dataset.countTo || "0");
    var start = Number.parseFloat(node.dataset.countFrom || "0");
    var duration = Number.parseInt(node.dataset.countDuration || "1400", 10);

    if (!supportsMotion()) {
      renderCounterFinal(node);
      return;
    }

    var startTime = performance.now();

    function frame(now) {
      var elapsed = now - startTime;
      var progress = Math.min(1, elapsed / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = start + (target - start) * eased;
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
    var counters = Array.from(document.querySelectorAll("[data-count-to]"));
    if (counters.length === 0) {
      return;
    }

    counters.forEach(function (counter) {
      counter.dataset.countAnimated = "false";
      counter.textContent = counter.dataset.countPrefix ? counter.dataset.countPrefix + "0" + (counter.dataset.countSuffix || "") : "0";
    });

    if (!supportsMotion() || !("IntersectionObserver" in window)) {
      counters.forEach(renderCounterFinal);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
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

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function initHeroReveal() {
    var items = Array.from(document.querySelectorAll("[data-hero-reveal]"));
    if (items.length === 0) {
      return;
    }

    if (!supportsMotion()) {
      items.forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    items.forEach(function (item, index) {
      item.style.transition = "opacity 500ms cubic-bezier(0.2, 0.8, 0.2, 1) " + (index * 120) + "ms, transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1) " + (index * 120) + "ms";
    });

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        items.forEach(function (item) {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        });
      });
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

        outputs.warmth.textContent = String(state.warmth);
        outputs.pragmatism.textContent = String(state.pragmatism);
        outputs.initiative.textContent = String(state.initiative);

        meterLabels.warmth.textContent = describeWarmth(state.warmth);
        meterLabels.pragmatism.textContent = describePragmatism(state.pragmatism);
        meterLabels.initiative.textContent = describeInitiative(state.initiative);

        meterFills.warmth.style.width = state.warmth * 10 + "%";
        meterFills.pragmatism.style.width = state.pragmatism * 10 + "%";
        meterFills.initiative.style.width = state.initiative * 10 + "%";

        title.textContent = state.name;
        summary.textContent = buildAgentLabSummary(state.name, state.warmth, state.pragmatism, state.initiative);
        packet.textContent = buildAgentLabPacket(state);
        prompt.textContent = buildAgentLabPrompt(state);

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
    initSmoothScrollAnchors();
    initRevealAnimations();
    initCounters();
    initHeroReveal();
    initAgentLabs();
  });
})();
