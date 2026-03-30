// Shared navigation metadata
const NAV_ITEMS = [
  { key: "home", label: "Home", href: "index.html" },
  { key: "services", label: "Services", href: "services.html" },
  { key: "about", label: "About", href: "about.html" },
  { key: "membership", label: "Membership", href: "membership.html" },
  { key: "contact", label: "Contact", href: "contact.html" },
];

document.addEventListener("DOMContentLoaded", () => {
  injectSharedLayout();
  refreshIcons();
  setupHeaderState();
  setupHeroSlider();
  if (window.AOS) {
    setupAOS();
  } else {
    setupRevealAnimations();
  }
  setupCounters();
  setupParallax();
  setupCapitalCounter();
  setupCapitalParallax();
  setupGrowthParallax();
  updateCurrentYear();
});

// Shared layout injection keeps the header and footer consistent across pages.
function injectSharedLayout() {
  const page = document.body.dataset.page || "home";
  const headerTarget = document.getElementById("site-header");
  const footerTarget = document.getElementById("site-footer");

  if (headerTarget) {
    headerTarget.innerHTML = buildHeader(page);
  }

  if (footerTarget) {
    footerTarget.innerHTML = buildFooter();
  }
}

function buildHeader(page) {
  return `
    <header class="site-header">
      <div class="header-shell">
        <div class="mx-auto max-w-[1840px] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
          <div class="header-layout">
            <div class="header-brand-pane">
              <a href="index.html" class="header-brand-link" aria-label="Business Gate Circle home">
                <span class="header-brand-copy">
                  <span class="brand-title">Business Gate Circle</span>
                  <span class="brand-subtitle">Premium Business Network</span>
                </span>
              </a>
            </div>

            <div class="header-nav-pane">
              <nav class="header-nav-surface" aria-label="Primary">
                <div class="header-nav-track">
                  ${buildNavLinks(page)}
                </div>
              </nav>
            </div>

            <div class="header-actions">
              <a href="membership.html" class="header-cta">
                Join Circle
                <i data-lucide="arrow-up-right" class="h-4 w-4"></i>
              </a>
            </div>

            <button
              type="button"
              class="header-menu-toggle"
              data-menu-toggle
              aria-expanded="false"
              aria-controls="mobile-navigation"
              aria-label="Open navigation"
            >
              <span class="header-menu-icon header-menu-icon-open" aria-hidden="true">
                <i data-lucide="menu" class="h-5 w-5"></i>
              </span>
              <span class="header-menu-icon header-menu-icon-close" aria-hidden="true">
                <i data-lucide="x" class="h-5 w-5"></i>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="header-mobile-panel" data-mobile-panel hidden>
        <div class="header-mobile-backdrop" data-menu-close></div>
        <div class="mx-auto max-w-[1840px] px-4 sm:px-6">
          <div class="header-mobile-dialog" id="mobile-navigation">
            <div class="header-mobile-top">
              <div>
                <p class="header-mobile-eyebrow">Navigation</p>
                <p class="header-mobile-title">Explore Business Gate Circle</p>
              </div>
              <button type="button" class="header-mobile-close" data-menu-close aria-label="Close navigation">
                <i data-lucide="x" class="h-5 w-5"></i>
              </button>
            </div>

            <nav class="header-mobile-nav" aria-label="Mobile Primary">
              ${buildNavLinks(page, true)}
            </nav>

            <a href="membership.html" class="header-cta header-mobile-cta">
              Join Circle
              <i data-lucide="arrow-up-right" class="h-4 w-4"></i>
            </a>
          </div>
        </div>
      </div>
    </header>
  `;
}

function buildNavLinks(page, mobile = false) {
  return NAV_ITEMS.map((item) => {
    const isActive = item.key === page;
    const classes = mobile ? "mobile-nav-link" : "nav-link";

    return `
      <a
        href="${item.href}"
        class="${classes}${isActive ? " is-active" : ""}"
        ${isActive ? 'aria-current="page"' : ""}
      >
        <span>${item.label}</span>
        ${mobile ? '<i data-lucide="arrow-right" class="h-4 w-4"></i>' : ""}
      </a>
    `;
  }).join("");
}

function buildFooter() {
  return `
    <footer class="site-footer">
      <div class="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-8 xl:px-10">
        <div class="site-footer-main">
          <div class="site-footer-brand">
            <a href="index.html" class="site-footer-brand-link" aria-label="Business Gate Circle home">
              <span class="site-footer-mark">BGC</span>
              <span class="site-footer-brand-copy">
                <span class="site-footer-brand-title">Business Gate Circle</span>
                <span class="site-footer-brand-subtitle">Premium Business Network</span>
              </span>
            </a>

            <p class="site-footer-description">
              A premium business network and membership platform connecting entrepreneurs, investors,
              consultants, and leaders through trusted relationships, curated access, and international growth opportunities.
            </p>

            <div class="site-footer-socials">
              <a href="#" class="site-footer-social" aria-label="LinkedIn">
                <i data-lucide="linkedin" class="h-4 w-4"></i>
              </a>
              <a href="#" class="site-footer-social" aria-label="Instagram">
                <i data-lucide="instagram" class="h-4 w-4"></i>
              </a>
              <a href="mailto:hello@businessgatecircle.com" class="site-footer-social" aria-label="Email Business Gate Circle">
                <i data-lucide="mail" class="h-4 w-4"></i>
              </a>
            </div>
          </div>

          <div class="site-footer-column site-footer-links">
            <h2 class="site-footer-heading">Quick Links</h2>
            <ul class="site-footer-list">
              ${NAV_ITEMS.map((item) => `<li><a href="${item.href}" class="site-footer-link">${item.label}</a></li>`).join("")}
            </ul>
          </div>

          <div class="site-footer-column site-footer-contact">
            <h2 class="site-footer-heading">Contact</h2>
            <ul class="site-footer-list site-footer-contact-list">
              <li class="site-footer-contact-item">
                <i data-lucide="mail" class="h-4 w-4"></i>
                <a href="mailto:hello@businessgatecircle.com" class="site-footer-link">hello@businessgatecircle.com</a>
              </li>
              <li class="site-footer-contact-item">
                <i data-lucide="phone" class="h-4 w-4"></i>
                <a href="tel:+97145550101" class="site-footer-link">+971 4 555 0101</a>
              </li>
              <li class="site-footer-contact-item">
                <i data-lucide="map-pin" class="h-4 w-4"></i>
                <span>Dubai, UAE</span>
              </li>
              <li class="site-footer-contact-item">
                <i data-lucide="clock-3" class="h-4 w-4"></i>
                <span>Mon to Fri, 9:00 AM to 6:00 PM</span>
              </li>
            </ul>
          </div>

          <div class="site-footer-membership">
            <p class="site-footer-heading">Membership</p>
            <p class="site-footer-membership-text">
              Curated access, high-value introductions, and member-first growth support for ambitious professionals and business leaders.
            </p>
            <a href="membership.html" class="site-footer-cta">
              Explore Membership
              <i data-lucide="arrow-right" class="h-4 w-4"></i>
            </a>
          </div>
        </div>

        <div class="site-footer-bottom">
          <p>&copy; <span data-current-year></span> Business Gate Circle. All rights reserved.</p>
          <p>Designed for premium networking, trust, and international business growth.</p>
        </div>
      </div>
    </footer>
  `;
}

// Header interactions handle sticky state and the mobile menu.
function setupHeaderState() {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const menuToggle = header.querySelector("[data-menu-toggle]");
  const mobilePanel = header.querySelector("[data-mobile-panel]");
  const closeTriggers = header.querySelectorAll("[data-menu-close]");
  const mobileLinks = header.querySelectorAll(".mobile-nav-link");
  const desktopMedia = window.matchMedia("(min-width: 1024px)");

  const toggleScrolledState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const updateHeaderOffset = () => {
    document.documentElement.style.setProperty("--header-offset", `${header.offsetHeight}px`);
  };

  const setMenuState = (isOpen) => {
    if (!menuToggle || !mobilePanel) {
      return;
    }

    header.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    mobilePanel.hidden = !isOpen;
  };

  toggleScrolledState();
  updateHeaderOffset();
  window.addEventListener("scroll", toggleScrolledState, { passive: true });
  window.addEventListener("resize", updateHeaderOffset);
  window.addEventListener("load", updateHeaderOffset);

  if (!menuToggle || !mobilePanel) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = !header.classList.contains("menu-open");
    setMenuState(isOpen);
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => setMenuState(false));
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  const handleDesktopChange = (event) => {
    if (event.matches) {
      setMenuState(false);
    }

    updateHeaderOffset();
  };

  if (typeof desktopMedia.addEventListener === "function") {
    desktopMedia.addEventListener("change", handleDesktopChange);
  } else {
    desktopMedia.addListener(handleDesktopChange);
  }
}

function setupHeroSlider() {
  const slider = document.querySelector("[data-hero-slider]");

  if (!slider) {
    return;
  }

  const slides = Array.from(slider.querySelectorAll("[data-slide]"));
  const dots = Array.from(slider.querySelectorAll("[data-slide-dot]"));
  const previousButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let autoAdvanceId = 0;
  let touchStartX = null;

  if (!slides.length) {
    return;
  }

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const setActiveSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
      dot.tabIndex = isActive ? 0 : -1;
    });
  };

  const stopAutoAdvance = () => {
    if (!autoAdvanceId) {
      return;
    }

    window.clearInterval(autoAdvanceId);
    autoAdvanceId = 0;
  };

  const startAutoAdvance = () => {
    if (prefersReducedMotion || slides.length < 2) {
      return;
    }

    stopAutoAdvance();
    autoAdvanceId = window.setInterval(() => {
      setActiveSlide(activeIndex + 1);
    }, 6200);
  };

  previousButton?.addEventListener("click", () => {
    setActiveSlide(activeIndex - 1);
    startAutoAdvance();
  });

  nextButton?.addEventListener("click", () => {
    setActiveSlide(activeIndex + 1);
    startAutoAdvance();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      setActiveSlide(dotIndex);
      startAutoAdvance();
    });
  });

  slider.addEventListener("mouseenter", stopAutoAdvance);
  slider.addEventListener("mouseleave", startAutoAdvance);
  slider.addEventListener("focusin", stopAutoAdvance);
  slider.addEventListener("focusout", (event) => {
    if (!slider.contains(event.relatedTarget)) {
      startAutoAdvance();
    }
  });

  slider.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0]?.clientX;

      if (touchStartX === null || typeof touchEndX !== "number") {
        return;
      }

      const delta = touchEndX - touchStartX;
      touchStartX = null;

      if (Math.abs(delta) < 48) {
        return;
      }

      setActiveSlide(activeIndex + (delta < 0 ? 1 : -1));
      startAutoAdvance();
    },
    { passive: true }
  );

  slider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveSlide(activeIndex - 1);
      startAutoAdvance();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveSlide(activeIndex + 1);
      startAutoAdvance();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoAdvance();
      return;
    }

    startAutoAdvance();
  });

  setActiveSlide(activeIndex);
  startAutoAdvance();
}

function setupAOS() {
  const normalizeDelay = (value, fallbackIndex = 0) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return String((fallbackIndex % 3) * 100);
    }

    if (parsed <= 50) {
      return "0";
    }

    if (parsed <= 150) {
      return "100";
    }

    return "200";
  };

  const applyAos = (element, delayValue) => {
    if (!element || element.dataset.aosApplied === "true") {
      return;
    }

    element.setAttribute("data-aos", "fade-up");

    if (typeof delayValue !== "undefined") {
      element.setAttribute("data-aos-delay", delayValue);
    }

    element.dataset.aosApplied = "true";
  };

  const revealItems = document.querySelectorAll(".reveal");
  revealItems.forEach((item, index) => {
    const delayValue = item.dataset.delay ? normalizeDelay(item.dataset.delay, index) : undefined;
    applyAos(item, delayValue);
  });

  const cardItems = document.querySelectorAll("main section article");
  cardItems.forEach((item, index) => {
    if (item.closest("[data-aos]")) {
      return;
    }

    applyAos(item, String((index % 3) * 100));
  });

  const imageItems = document.querySelectorAll("main section img");
  imageItems.forEach((image, index) => {
    const target = image.parentElement;

    if (!target || target.closest("[data-aos]")) {
      return;
    }

    applyAos(target, normalizeDelay(index, index));
  });

  window.AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: true,
    offset: 100,
  });
}

// Section reveal animation using IntersectionObserver.
function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const delay = Number(entry.target.dataset.delay || 0);

        if (delay > 0) {
          entry.target.style.transitionDelay = `${delay}ms`;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

// Animated counters for the impact section.
function setupCounters() {
  const counters = document.querySelectorAll("[data-counter]");

  if (!counters.length) {
    return;
  }

  const formatter = new Intl.NumberFormat("en-US");

  const animateCounter = (element) => {
    const target = Number(element.dataset.counter || 0);
    const duration = Number(element.dataset.duration || 1600);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const startTime = performance.now();

    const updateValue = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * eased);

      element.textContent = `${prefix}${formatter.format(currentValue)}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(updateValue);
      }
    };

    window.requestAnimationFrame(updateValue);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, counterObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.counted === "true") {
          return;
        }

        entry.target.dataset.counted = "true";
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.45,
    }
  );

  counters.forEach((counter) => observer.observe(counter));
}

// Gentle parallax motion for decorative elements.
function setupParallax() {
  const parallaxItems = document.querySelectorAll("[data-parallax]");

  if (!parallaxItems.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  let ticking = false;

  const updateParallax = () => {
    const viewportHeight = window.innerHeight;

    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const speed = Number(item.dataset.parallax || 0.12);
      const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
      const shift = Math.max(-30, Math.min(30, distanceFromCenter * speed * -0.12));

      item.style.transform = `translate3d(0, ${shift}px, 0)`;
    });

    ticking = false;
  };

  const requestTick = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
}

function setupCapitalCounter() {
  const counter = document.querySelector("[data-capital-counter]");

  if (!counter) {
    return;
  }

  const start = Number(counter.dataset.start || 100);
  const end = Number(counter.dataset.end || 140);
  const duration = 1200;
  let hasCounted = false;

  const renderValue = (value) => {
    counter.textContent = String(value);
  };

  const finishValue = () => {
    counter.textContent = `${end}+`;
  };

  const animateCounter = () => {
    if (hasCounted) {
      return;
    }

    hasCounted = true;
    renderValue(start);

    const startTime = performance.now();

    const updateValue = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(start + (end - start) * eased);

      if (progress < 1) {
        renderValue(currentValue);
        window.requestAnimationFrame(updateValue);
        return;
      }

      finishValue();
    };

    window.requestAnimationFrame(updateValue);
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishValue();
    return;
  }

  if (!("IntersectionObserver" in window)) {
    animateCounter();
    return;
  }

  const observer = new IntersectionObserver(
    (entries, counterObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter();
        counterObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  observer.observe(counter);
}

function setupCapitalParallax() {
  const section = document.getElementById("capital");
  const scene = section?.querySelector("[data-capital-parallax]");

  if (!section || !scene) {
    return;
  }

  const layers = Array.from(scene.querySelectorAll("[data-capital-layer]"));

  if (!layers.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.classList.add("is-capital-active");
    return;
  }

  let isActive = false;
  let ticking = false;

  const updateLayers = () => {
    const rect = scene.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;

    layers.forEach((layer, index) => {
      const speed = Number(layer.dataset.capitalLayer || 0.14);
      const shiftY = Math.max(-10, Math.min(10, distanceFromCenter * speed * -0.07));
      const direction = index % 2 === 0 ? 1 : -1;
      const shiftX = Math.max(-4, Math.min(4, shiftY * 0.22 * direction));

      layer.style.setProperty("--capital-shift-x", `${shiftX.toFixed(2)}px`);
      layer.style.setProperty("--capital-shift-y", `${shiftY.toFixed(2)}px`);
    });

    ticking = false;
  };

  const requestTick = () => {
    if (!isActive || ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateLayers);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isActive = entry.isIntersecting;
        section.classList.toggle("is-capital-active", entry.isIntersecting);

        if (entry.isIntersecting) {
          requestTick();
        }
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  observer.observe(scene);
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
}

function setupGrowthParallax() {
  const section = document.getElementById("growth");

  if (!section) {
    return;
  }

  const layers = Array.from(section.querySelectorAll("[data-growth-layer]"));

  if (!layers.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.classList.add("is-growth-active");
    return;
  }

  let isActive = false;
  let ticking = false;

  const updateLayers = () => {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;

    layers.forEach((layer, index) => {
      const speed = Number(layer.dataset.growthLayer || 0.16);
      const shiftY = Math.max(-16, Math.min(16, distanceFromCenter * speed * -0.1));
      const direction = index % 2 === 0 ? 1 : -1;
      const shiftX = Math.max(-8, Math.min(8, shiftY * 0.28 * direction));

      layer.style.setProperty("--growth-shift-x", `${shiftX.toFixed(2)}px`);
      layer.style.setProperty("--growth-shift-y", `${shiftY.toFixed(2)}px`);
    });

    ticking = false;
  };

  const requestTick = () => {
    if (!isActive || ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateLayers);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isActive = entry.isIntersecting;
        section.classList.toggle("is-growth-active", entry.isIntersecting);

        if (entry.isIntersecting) {
          requestTick();
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  observer.observe(section);
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
}

function updateCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((item) => {
    item.textContent = String(new Date().getFullYear());
  });
}

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}
