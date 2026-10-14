/* Theme switch (light / dark) + language switch (English / Urdu).
   Choices are remembered in localStorage. The small inline script in each page's <head>
   applies them before first paint, so there is no flash. */
(function () {
  "use strict";
  var root = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var SUN = '<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>';
  var MOON = '<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7z"/></svg>';

  window.PortfolioTheme = {
    get: function () { return root.getAttribute("data-theme") === "light" ? "light" : "dark"; },
    set: function (t) {
      root.classList.add("theme-anim");
      root.setAttribute("data-theme", t);
      set("theme", t);
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute("content", t === "light" ? "#f2f7f4" : "#07140f");
      setTimeout(function () { root.classList.remove("theme-anim"); }, 500);
      refresh();
    }
  };

  var themeBtn, langBtn;
  function refresh() {
    if (themeBtn) {
      var light = window.PortfolioTheme.get() === "light";
      themeBtn.setAttribute("aria-pressed", light ? "true" : "false");
      var label = light ? "Switch to dark mode" : "Switch to light mode";
      themeBtn.title = label; themeBtn.setAttribute("aria-label", label);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var header = document.querySelector("header");
    if (!header) return;
    var box = document.createElement("div");
    box.className = "hdr-tools";

    themeBtn = document.createElement("button");
    themeBtn.type = "button"; themeBtn.className = "hdr-btn"; themeBtn.id = "theme-btn";
    themeBtn.innerHTML = SUN + MOON;
    themeBtn.addEventListener("click", function () {
      window.PortfolioTheme.set(window.PortfolioTheme.get() === "light" ? "dark" : "light");
    });
    box.appendChild(themeBtn);

    langBtn = document.createElement("button");
    langBtn.type = "button"; langBtn.className = "hdr-btn"; langBtn.id = "lang-btn";
    box.appendChild(langBtn);
    window.__langBtn = langBtn;          // wired up by i18n.js

    var nav = header.querySelector(".navbar");
    if (nav && nav.nextSibling) header.insertBefore(box, nav.nextSibling); else header.appendChild(box);
    refresh();
  });
})();
