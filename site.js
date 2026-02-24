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

  document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCurrentYear();
    initRevealOnScroll();
  });
})();
