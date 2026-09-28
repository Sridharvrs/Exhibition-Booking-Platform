/* ============================================
   Exhibition Booking Platform — Shared JS
   ============================================ */

/* ---------- Navbar scroll effect ---------- */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/* ---------- Mobile drawer toggle ---------- */
/* ---------- Mobile drawer toggle ---------- */
function initMobileDrawer() {
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".mobile-drawer");
  const overlay = document.querySelector(".drawer-overlay");
  const drawerClose = document.querySelector(".drawer-close");

  if (!toggle || !drawer || !overlay) return;

  let scrollPosition = 0;

  function openDrawer() {
    scrollPosition = window.scrollY;

    drawer.classList.add("open");
    overlay.classList.add("visible");
    toggle.classList.add("active");

    /* Lock background scroll */
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("visible");
    toggle.classList.remove("active");

    /* Restore background scroll */
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";

    window.scrollTo(0, scrollPosition);
  }

  toggle.addEventListener("click", openDrawer);

  if (drawerClose) {
    drawerClose.addEventListener("click", closeDrawer);
  }

  overlay.addEventListener("click", closeDrawer);

  drawer.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeDrawer);
  });
}

/* ---------- Scroll reveal animations ---------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale"
  );
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
}

/* ---------- Active nav link highlight ---------- */
function initActiveNav() {
  var currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-drawer a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "index.html" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ---------- Count-up animation for stats ---------- */
function initCountUp() {
  var counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var current = 0;
        var step = Math.ceil(target / 60);

        var timer = setInterval(function () {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 25);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (c) {
    observer.observe(c);
  });
}

/* ---------- Init all on DOM ready ---------- */
document.addEventListener("DOMContentLoaded", function () {
  initNavbarScroll();
  initMobileDrawer();
  initScrollReveal();
  initActiveNav();
  initCountUp();
});
