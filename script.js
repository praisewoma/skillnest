/* ==========================================================================
   script.js — site-wide behaviour (navigation, branding, small animations)
   --------------------------------------------------------------------------
   What it does, in plain English:
   1. Applies the brand name/tagline from brand.js to any element that has a
      data-brand attribute, and fills in the contact email link.
   2. Opens/closes the mobile hamburger menu.
   3. Opens/closes the desktop dropdown menus.
   4. Marks the page you are currently on in the navigation.
   5. Fades sections in as you scroll (unless you prefer reduced motion).
   6. Adds a shadow to the header once you scroll down.

   No frameworks, no libraries, no network requests.
   ========================================================================== */

(function () {
  "use strict";

  var BRAND = window.SKILLNEST_BRAND || {};

  /* ------------------------------------------------------------------
     1. BRANDING — fill in any [data-brand="..."] element
     ------------------------------------------------------------------ */
  function applyBrand() {
    var nodes = document.querySelectorAll("[data-brand]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-brand");
      if (BRAND[key]) nodes[i].textContent = BRAND[key];
    }

    // Email links: <a data-brand-email> gets both href and text.
    var mailLinks = document.querySelectorAll("[data-brand-email]");
    for (var j = 0; j < mailLinks.length; j++) {
      if (!BRAND.email) continue;
      mailLinks[j].setAttribute("href", "mailto:" + BRAND.email);
      mailLinks[j].textContent = BRAND.email;
    }

    // Keep the browser tab title in sync after a rename.
    if (BRAND.name && BRAND.name !== "SkillNest") {
      document.title = document.title.split("SkillNest").join(BRAND.name);
    }

    var years = document.querySelectorAll("[data-year]");
    for (var k = 0; k < years.length; k++) {
      years[k].textContent = new Date().getFullYear();
    }
  }

  /* ------------------------------------------------------------------
     2. MOBILE MENU (hamburger)
     ------------------------------------------------------------------ */
  function setupMobileMenu() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close the menu" : "Open the menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close the drawer after tapping any link inside it.
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    // If the window is resized up to desktop, reset the drawer state.
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
     3. DESKTOP DROPDOWN MENUS
        (On mobile the same lists are simply shown inside the drawer.)
     ------------------------------------------------------------------ */
  function setupDropdowns() {
    var buttons = document.querySelectorAll("[data-menu-toggle]");

    function closeAll(except) {
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i] === except) continue;
        buttons[i].setAttribute("aria-expanded", "false");
        var menu = document.getElementById(buttons[i].getAttribute("aria-controls"));
        if (menu) menu.classList.remove("is-open");
      }
    }

    for (var i = 0; i < buttons.length; i++) {
      (function (button) {
        var menu = document.getElementById(button.getAttribute("aria-controls"));
        if (!menu) return;

        button.addEventListener("click", function (event) {
          event.stopPropagation();
          var isOpen = button.getAttribute("aria-expanded") === "true";
          closeAll(button);
          button.setAttribute("aria-expanded", isOpen ? "false" : "true");
          menu.classList.toggle("is-open", !isOpen);
        });
      })(buttons[i]);
    }

    document.addEventListener("click", function () { closeAll(null); });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      var activeMenu = document.activeElement && document.activeElement.closest
        ? document.activeElement.closest(".nav-menu")
        : null;
      var trigger = activeMenu
        ? document.querySelector('[aria-controls="' + activeMenu.id + '"]')
        : null;
      closeAll(null);
      if (trigger) trigger.focus();
    });
  }

  /* ------------------------------------------------------------------
     4. HIGHLIGHT THE CURRENT PAGE IN THE NAVIGATION
     ------------------------------------------------------------------ */
  function markCurrentPage() {
    var path = location.pathname.split("/").pop() || "index.html";
    var isPracticePage = new URLSearchParams(location.search).get("mode") === "practice";
    var links = document.querySelectorAll(".primary-nav a[href], .footer__col a[href]");

    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href").split("#")[0];
      var hrefPath = href.split("?")[0];
      if (!hrefPath || hrefPath !== path) continue;

      // The same quiz page offers two URLs. Highlight only the mode the visitor is in.
      var isPracticeLink = new URLSearchParams(href.split("?")[1] || "").get("mode") === "practice";
      if (isPracticePage !== isPracticeLink) continue;

      links[i].setAttribute("aria-current", "page");
      // If the link is inside a dropdown, highlight the parent button too.
      var menu = links[i].closest(".nav-menu");
      if (menu) {
        var parentBtn = document.querySelector('[aria-controls="' + menu.id + '"]');
        if (parentBtn) parentBtn.classList.add("is-parent-current");
      }
    }
  }

  /* ------------------------------------------------------------------
     5. FADE-IN ON SCROLL
     ------------------------------------------------------------------ */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var reduce = typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-visible");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.08 }
    );

    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  /* ------------------------------------------------------------------
     6. HEADER SHADOW ON SCROLL
     ------------------------------------------------------------------ */
  function setupHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     Start everything once the page is ready
     ------------------------------------------------------------------ */
  function init() {
    applyBrand();
    setupMobileMenu();
    setupDropdowns();
    markCurrentPage();
    setupReveal();
    setupHeaderShadow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
