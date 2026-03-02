(function () {
  var THEME_KEY = "toni-theme";
  var THEME_COLORS = {
    light: "#f0f4f8",
    dark: "#0a0f1e"
  };
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function supportsMotion() {
    return !prefersReducedMotion.matches;
  }

  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(THEME_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function systemTheme() {
    return prefersDarkScheme.matches ? "dark" : "light";
  }

  function resolvedTheme() {
    return readStoredTheme() || document.documentElement.dataset.theme || systemTheme();
  }

  function applyTheme(theme, options) {
    var settings = Object.assign({ persist: true }, options);
    var nextTheme = theme === "light" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", THEME_COLORS[nextTheme] || THEME_COLORS.dark);
    }

    if (settings.persist) {
      try {
        window.localStorage.setItem(THEME_KEY, nextTheme);
      } catch (_error) {
        // Ignore storage failures.
      }
    }

    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      var isDark = nextTheme === "dark";
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
      button.dataset.themeState = nextTheme;
    });
  }

  function initThemeToggle() {
    var buttons = Array.from(document.querySelectorAll("[data-theme-toggle]"));
    if (buttons.length === 0) {
      return;
    }

    var initial = resolvedTheme();
    applyTheme(initial, { persist: false });

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var nextTheme = resolvedTheme() === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
      });
    });

    var handleSchemeChange = function () {
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
      items.forEach(function (item) { item.classList.add("is-visible"); });
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

    items.forEach(function (item) { observer.observe(item); });
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

    counters.forEach(function (counter) { observer.observe(counter); });
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

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initNavigation();
    initCurrentYear();
    initSmoothScrollAnchors();
    initRevealAnimations();
    initCounters();
    initHeroReveal();
  });
})();
