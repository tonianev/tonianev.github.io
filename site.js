(function () {
  const THEME_KEY = "toni-theme";
  const THEME_COLORS = {
    light: "#edf1f7",
    dark: "#0f1729"
  };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function supportsMotion() {
    return !prefersReducedMotion.matches;
  }

  function readStoredTheme() {
    try {
      const value = window.localStorage.getItem(THEME_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function systemTheme() {
    return prefersDarkScheme.matches ? "dark" : "light";
  }

  function resolvedTheme() {
    return document.documentElement.dataset.theme || readStoredTheme() || systemTheme();
  }

  function applyTheme(theme, options) {
    const settings = Object.assign({ persist: true }, options);
    const nextTheme = theme === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", THEME_COLORS[nextTheme] || THEME_COLORS.light);
    }

    if (settings.persist) {
      try {
        window.localStorage.setItem(THEME_KEY, nextTheme);
      } catch (_error) {
        // Ignore storage failures.
      }
    }

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const isDark = nextTheme === "dark";
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
      button.dataset.themeState = nextTheme;
    });
  }

  function initThemeToggle() {
    const buttons = Array.from(document.querySelectorAll("[data-theme-toggle]"));
    if (buttons.length === 0) {
      return;
    }

    const initial = resolvedTheme();
    applyTheme(initial, { persist: false });

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = resolvedTheme() === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
      });
    });

    const handleSchemeChange = () => {
      if (readStoredTheme()) {
        return;
      }
      applyTheme(systemTheme(), { persist: false });
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

  document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initNavigation();
    initCurrentYear();
    initSmoothScrollAnchors();
    initRevealAnimations();
    initCounters();
    initHeroParallax();
  });
})();
