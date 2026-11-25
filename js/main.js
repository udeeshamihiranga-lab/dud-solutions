/*
 * DUD Solutions: shared behaviour for every page
 *
 *   1. Light / dark theme toggle
 *   2. Mobile menu
 *   3. Project filter        (projects.html)
 *   4. Contact form          (contact.html)
 *
 * Each feature looks for its own elements first, so this one file is safe to
 * load on every page.
 */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     1. Light / dark theme toggle
     --------------------------------------------------------------------- */

  var SUN_ICON =
    '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/>' +
    '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON_ICON =
    '<svg class="icon" viewBox="0 0 24 24"><path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/></svg>';

  var themeToggle = document.getElementById("theme-toggle");

  // The theme in use: the visitor's saved choice, or else their system setting.
  function getCurrentTheme() {
    var chosen = document.documentElement.getAttribute("data-theme");
    if (chosen) return chosen;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Show a sun while in dark mode (click for light) and a moon while in light mode.
  function updateToggleButton() {
    var isDark = getCurrentTheme() === "dark";
    themeToggle.innerHTML = isDark ? SUN_ICON : MOON_ICON;
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  function toggleTheme() {
    var nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);

    try {
      localStorage.setItem("dud-theme", nextTheme);
    } catch (error) {
      // Storage can be blocked (private mode). The toggle still works for this visit.
    }
    updateToggleButton();
  }

  if (themeToggle) {
    updateToggleButton();
    themeToggle.addEventListener("click", toggleTheme);
  }

  /* ---------------------------------------------------------------------
     2. Mobile menu
     --------------------------------------------------------------------- */

  var menuToggle = document.getElementById("menu-toggle");
  var siteNav = document.getElementById("site-nav");

  if (menuToggle && siteNav) {
    menuToggle.setAttribute("aria-controls", "site-nav");

    var setMenuOpen = function (open) {
      siteNav.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuToggle.textContent = open ? "\u2715" : "\u2630";
    };

    setMenuOpen(false);

    menuToggle.addEventListener("click", function () {
      setMenuOpen(!siteNav.classList.contains("is-open"));
    });

    // Close the menu when a link is tapped, when the visitor taps outside it,
    // when Escape is pressed, or when the screen grows to desktop width.
    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenuOpen(false);
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".site-header")) setMenuOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    window.matchMedia("(min-width: 901px)").addEventListener("change", function (event) {
      if (event.matches) setMenuOpen(false);
    });
  }

  /* ---------------------------------------------------------------------
     3. Project filter
     Each .project-card carries data-category="Web Development" etc.
     Each .filter-chip carries data-filter with the matching label.
     --------------------------------------------------------------------- */

  var filterBar = document.getElementById("filter-bar");

  if (filterBar) {
    var projectCards = document.querySelectorAll("#project-grid .project-card");
    var filterChips = filterBar.querySelectorAll(".filter-chip");

    filterBar.addEventListener("click", function (event) {
      var clickedChip = event.target.closest(".filter-chip");
      if (!clickedChip) return;

      var selected = clickedChip.getAttribute("data-filter");

      filterChips.forEach(function (chip) {
        chip.classList.toggle("is-active", chip === clickedChip);
      });

      projectCards.forEach(function (card) {
        var matches = selected === "All Projects" || card.getAttribute("data-category") === selected;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  }
  /* ---------------------------------------------------------------------
     4. About page team cards: flip between photo (front) and details (back)
     Clicking anywhere on a card, or using its Flip / Back button, flips it.
     Links inside the card (LinkedIn, GitHub, email...) work normally and do
     not flip it. The hidden face is made inert so keyboard and screen-reader
     users only reach what is visible.
   --------------------------------------------------------------------- */

  document.querySelectorAll(".team-card").forEach(function (card) {
    var front = card.querySelector(".team-card-front");
    var back = card.querySelector(".team-card-back");

    card.addEventListener("click", function (event) {
      if (event.target.closest("a")) return;

      var isFlipped = card.classList.toggle("is-flipped");
      front.inert = isFlipped;
      back.inert = !isFlipped;

      // Keep keyboard focus on the face that is now showing.
      var visibleButton = (isFlipped ? back : front).querySelector(".team-flip-btn");
      if (visibleButton && event.target.closest(".team-flip-btn")) visibleButton.focus({ preventScroll: true });
    });
  });

  /* ---------------------------------------------------------------------
     5. Contact form
     --------------------------------------------------------------------- */

  var contactForm = document.getElementById("contact-form");

  if (contactForm) {
    var formWrapper = document.getElementById("form-wrapper");
    var formSuccess = document.getElementById("form-success");
    var formError = document.getElementById("form-error");

    function readField(id) {
      return document.getElementById(id).value.trim();
    }

    function isValidEmail(email) {
      return /\S+@\S+\.\S+/.test(email);
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var requiredFilled = ["field-name", "field-email", "field-service", "field-message"].every(function (id) {
        return readField(id) !== "";
      });

      if (!requiredFilled || !isValidEmail(readField("field-email"))) {
        formError.textContent = "Please complete the required fields with a valid email.";
        return;
      }

      // Open a pre-filled email draft in the visitor's default mail app.
      var name = readField("field-name");
      var email = readField("field-email");
      var company = readField("field-company") || "Not provided";
      var service = readField("field-service");
      var message = readField("field-message");

      var subject = "New project inquiry from " + name;
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Company: " + company + "\n" +
        "Service: " + service + "\n\n" +
        "Project details:\n" + message;

      var mailtoLink = "mailto:udeeshamihiranga@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      window.location.href = mailtoLink;

      formWrapper.style.display = "none";
      formSuccess.querySelector("h3").textContent = "Email draft prepared";
      formSuccess.querySelector("p").textContent =
        "Your email app should open with the project details filled in. Please press Send to complete your inquiry.";
      formSuccess.style.display = "block";
    });
  }
})();
