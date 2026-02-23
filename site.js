(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");

    if (!toggle || !nav) {
      return;
    }

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

  function initTypedText() {
    const target = document.querySelector("[data-typed]");
    if (!target) {
      return;
    }

    const strings = (target.dataset.typedStrings || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    if (strings.length === 0) {
      return;
    }

    if (prefersReducedMotion) {
      target.textContent = strings[0];
      return;
    }

    let stringIndex = 0;
    let charIndex = 0;
    let direction = 1;

    const cursor = document.createElement("span");
    cursor.className = "typed-cursor";
    cursor.textContent = "|";
    target.after(cursor);

    function tick() {
      const active = strings[stringIndex];

      target.textContent = active.slice(0, charIndex);

      if (direction === 1) {
        charIndex += 1;
        if (charIndex > active.length) {
          direction = -1;
          setTimeout(tick, 1500);
          return;
        }
      } else {
        charIndex -= 1;
        if (charIndex < 0) {
          direction = 1;
          stringIndex = (stringIndex + 1) % strings.length;
          charIndex = 0;
        }
      }

      const speed = direction === 1 ? 70 : 35;
      setTimeout(tick, speed);
    }

    tick();
  }

  function initCurrentYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach((node) => {
      node.textContent = year;
    });
  }

  function initRevealOnScroll() {
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    if (revealItems.length === 0) {
      return;
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function initParallaxHero() {
    const hero = document.querySelector(".hero");
    if (!hero || prefersReducedMotion) {
      return;
    }

    let rafId = 0;
    const intensity = 14;

    window.addEventListener("mousemove", (event) => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * intensity;
        const y = (event.clientY / window.innerHeight - 0.5) * intensity;
        hero.style.backgroundPosition = `${50 - x}% ${50 - y}%`;
        rafId = 0;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCurrentYear();
    initTypedText();
    initRevealOnScroll();
    initParallaxHero();
  });
})();
