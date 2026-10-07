const progress = document.querySelector(".scroll-progress");
const revealItems = document.querySelectorAll(".reveal");

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${amount}%`;
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Count-up animation for stat numbers when they scroll into view.
const countTargets = document.querySelectorAll(
  ".big-stats b, .st-stats b, .wk-chip b, .ap-num b"
);

const runCount = (el) => {
  if (!el._raw) el._raw = el.textContent;
  const match = el._raw.match(/^(\d+)(\D.*)?$/);
  if (!match) return;
  const target = parseInt(match[1], 10);
  const suffix = match[2] || "";
  const pad = match[1].length > 1 && match[1][0] === "0";
  const duration = 1200;
  const start = performance.now();
  if (el._raf) cancelAnimationFrame(el._raf);
  const frame = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    let value = String(Math.round(target * eased));
    if (pad) value = value.padStart(match[1].length, "0");
    el.textContent = value + suffix;
    if (t < 1) {
      el._raf = requestAnimationFrame(frame);
    } else {
      el._raf = null;
    }
  };
  el._raf = requestAnimationFrame(frame);
};

if (
  "IntersectionObserver" in window &&
  countTargets.length &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCount(entry.target);
        } else if (entry.target._raf) {
          cancelAnimationFrame(entry.target._raf);
          entry.target._raf = null;
        }
      });
    },
    { threshold: 0.6 }
  );
  countTargets.forEach((el) => countObserver.observe(el));
}

// Project stats ride the sticky card deck: count only when the card reaches
// its front/pinned position, reset when it slides back down (replay on return).
const deckStats = document.querySelectorAll(".proj-metric b");
if (deckStats.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const updateDeckStats = () => {
    deckStats.forEach((el) => {
      const card = el.closest(".proj");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const front = rect.top <= 120 && rect.bottom > 200;
      if (front && !el._active) {
        el._active = true;
        runCount(el);
      } else if (!front && el._active) {
        el._active = false;
        if (el._raf) {
          cancelAnimationFrame(el._raf);
          el._raf = null;
        }
      }
    });
  };
  window.addEventListener("scroll", updateDeckStats, { passive: true });
  window.addEventListener("resize", updateDeckStats);
  updateDeckStats();
}

// Mobile nav: full-screen menu — closes on link click, logo click, overlay tap, or click outside.
const navToggle = document.querySelector(".nav-toggle");
if (navToggle) {
  const closeNav = () => {
    navToggle.checked = false;
  };
  document.addEventListener("click", (event) => {
    if (!navToggle.checked) return;
    if (event.target.closest("nav a, .logo")) {
      closeNav();
      return;
    }
    if (event.target.closest("nav")) {
      closeNav();
      return;
    }
    if (!event.target.closest(".topbar")) closeNav();
  });
}

// Scroll to top: slanted block showing live scroll percent; click returns to top.
const toTop = document.querySelector(".to-top");
if (toTop) {
  const toTopLabel = toTop.querySelector("span");
  const toggleTop = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 0;
    if (toTopLabel) toTopLabel.textContent = pct + "%";
    toTop.classList.toggle("is-shown", window.scrollY > 500);
  };
  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();
  toTop.addEventListener("click", () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    window.scrollTo({ top: 0, behavior });
  });
}
