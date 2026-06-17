(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  // ── NAV ───────────────────────────────────────────────────
  function initNav() {
    var nav     = document.getElementById("nav");
    var toggle  = document.querySelector(".nav-toggle");
    var menu    = document.getElementById("mobile-menu");
    if (!nav) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    }, { passive: true });

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open);
        menu.setAttribute("aria-hidden", !open);
        document.body.style.overflow = open ? "hidden" : "";
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          menu.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          menu.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        });
      });
    }
  }

  // ── SMOOTH SCROLL ──────────────────────────────────────────
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var offset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth"
      });
    });
  }

  // ── MOUSE GRADIENT ─────────────────────────────────────────
  function initMouseGradient() {
    var gradient = document.querySelector("[data-gradient]");
    if (!gradient) return;
    var mx = 30, my = 40;
    var targetX = 30, targetY = 40;

    window.addEventListener("mousemove", function (e) {
      targetX = (e.clientX / window.innerWidth)  * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    }, { passive: true });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      mx = lerp(mx, targetX, 0.05);
      my = lerp(my, targetY, 0.05);
      document.documentElement.style.setProperty("--mx", mx.toFixed(2) + "%");
      document.documentElement.style.setProperty("--my", my.toFixed(2) + "%");
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── SERVICE CARD RADIAL ────────────────────────────────────
  function initServiceCards() {
    document.querySelectorAll(".service-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var cx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + "%";
        var cy = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + "%";
        card.style.setProperty("--cx", cx);
        card.style.setProperty("--cy", cy);
      });
    });
  }

  // ── REVEALS (IntersectionObserver) ─────────────────────────
  function initReveals() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });

    els.forEach(function (el) { io.observe(el); });

    // Safety net — force reveal after 5s anything still hidden in viewport
    setTimeout(function () {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 5000);
  }

  // ── COUNT UP ───────────────────────────────────────────────
  function initCountUp() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el     = e.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var dur    = 1200;
        var start  = performance.now();
        io.unobserve(el);

        function step(now) {
          var t = Math.min((now - start) / dur, 1);
          var ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(ease * target);
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (n) { io.observe(n); });
  }

  // ── BOOT ──────────────────────────────────────────────────
  function boot() {
    safe(initNav,            "initNav");
    safe(initSmoothScroll,   "initSmoothScroll");
    safe(initMouseGradient,  "initMouseGradient");
    safe(initServiceCards,   "initServiceCards");
    safe(initReveals,        "initReveals");
    safe(initCountUp,        "initCountUp");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
