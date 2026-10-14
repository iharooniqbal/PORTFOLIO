/* English <-> Urdu switch.
   Finds every piece of visible text on the page, looks it up in window.UR_DICT
   (see i18n-ur.js) and swaps it. Switching back restores the original English.
   Urdu mode also flips the layout to right-to-left. */
(function () {
  "use strict";
  var root = document.documentElement;
  var DICT = window.UR_DICT || {};
  var INLINE = { STRONG: 1, B: 1, EM: 1, BR: 1, SMALL: 1, U: 1, MARK: 1 };
  var SKIP = "script,style,noscript,svg,canvas,textarea,[data-no-i18n]";
  var origHtml = new Map(), origText = new Map(), origAttr = new Map();
  var active = false, applying = false, observer = null, pending = false;
  var FONT_HREF = "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap";

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---- walk the DOM, calling cb for every translatable unit ---- */
  function visit(el, cb) {
    if (el.nodeType !== 1 || el.matches(SKIP)) return;
    var hasText = false, i, n;
    for (i = 0; i < el.childNodes.length; i++) {
      n = el.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue.trim()) { hasText = true; break; }
    }
    if (hasText) {
      var textOnly = el.hasAttribute("data-i18n-text-only");
      if (!textOnly) {
        for (i = 0; i < el.children.length; i++) {
          if (!INLINE[el.children[i].tagName]) { textOnly = true; break; }
        }
      }
      if (!textOnly) { cb({ type: "html", el: el, key: norm(el.innerHTML) }); return; }
      for (i = 0; i < el.childNodes.length; i++) {
        n = el.childNodes[i];
        if (n.nodeType === 3 && n.nodeValue.trim()) cb({ type: "text", node: n, key: norm(n.nodeValue) });
      }
    }
    for (i = 0; i < el.children.length; i++) visit(el.children[i], cb);
  }

  function attrs(rootEl, cb) {
    var list = rootEl.querySelectorAll("[placeholder],[aria-label],[title]");
    var all = rootEl.matches && rootEl.matches("[placeholder],[aria-label],[title]") ? [rootEl] : [];
    for (var i = 0; i < list.length; i++) all.push(list[i]);
    all.forEach(function (el) {
      if (el.closest("script,style,noscript,svg,canvas,[data-no-i18n]")) return;
      ["placeholder", "aria-label", "title"].forEach(function (a) {
        if (el.hasAttribute(a)) cb(el, a, norm(el.getAttribute(a)));
      });
    });
  }

  function applyTo(rootEl) {
    applying = true;
    visit(rootEl, function (u) {
      var tr = DICT[u.key];
      if (!tr) return;
      if (u.type === "html") {
        if (origHtml.has(u.el)) return;
        origHtml.set(u.el, u.el.innerHTML);
        u.el.innerHTML = tr;
      } else {
        if (origText.has(u.node)) return;
        origText.set(u.node, u.node.nodeValue);
        var v = u.node.nodeValue, lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0];
        u.node.nodeValue = lead + tr + trail;
      }
    });
    attrs(rootEl, function (el, a, key) {
      var tr = DICT[key], k = a + "|";
      if (!tr) return;
      var store = origAttr.get(el) || {};
      if (store[a] !== undefined) return;
      store[a] = el.getAttribute(a); origAttr.set(el, store);
      el.setAttribute(a, tr);
    });
    applying = false;
  }

  function revertAll() {
    applying = true;
    origHtml.forEach(function (html, el) { el.innerHTML = html; });
    origText.forEach(function (v, node) { node.nodeValue = v; });
    origAttr.forEach(function (store, el) { Object.keys(store).forEach(function (a) { el.setAttribute(a, store[a]); }); });
    origHtml.clear(); origText.clear(); origAttr.clear();
    applying = false;
  }

  function translateTitle(on) {
    if (on) {
      if (!document.__origTitle) document.__origTitle = document.title;
      var tr = DICT[norm(document.__origTitle)];
      if (tr) document.title = tr;
    } else if (document.__origTitle) document.title = document.__origTitle;
  }

  function loadFont() {
    if (document.getElementById("ur-font")) return;
    var l = document.createElement("link");
    l.id = "ur-font"; l.rel = "stylesheet"; l.href = FONT_HREF;
    document.head.appendChild(l);
  }

  function watch() {
    if (observer || !("MutationObserver" in window)) return;
    observer = new MutationObserver(function (muts) {
      if (applying || !active || pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; if (active) applyTo(document.body); });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function setBtn() {
    var b = window.__langBtn;
    if (!b) return;
    b.textContent = active ? "EN" : "\u0627\u0631\u062F\u0648";
    b.setAttribute("aria-label", active ? "Switch to English" : "\u0627\u0631\u062F\u0648 \u0645\u06CC\u06BA \u062A\u0628\u062F\u06CC\u0644 \u06A9\u0631\u06CC\u06BA");
    b.title = b.getAttribute("aria-label");
    b.setAttribute("lang", active ? "en" : "ur");
  }

  function setLang(l, silent) {
    var ur = l === "ur";
    set("lang", ur ? "ur" : "en");
    root.classList.add("i18n-busy");
    if (ur) loadFont();
    root.lang = ur ? "ur" : "en";
    root.dir = ur ? "rtl" : "ltr";
    document.dispatchEvent(new CustomEvent("portfolio:lang", { detail: l }));
    if (ur) { active = true; applyTo(document.body); translateTitle(true); watch(); }
    else { active = false; revertAll(); translateTitle(false); }
    setBtn();
    root.classList.remove("i18n-busy");
    root.classList.add("i18n-ready");
  }

  window.PortfolioLang = {
    get: function () { return active ? "ur" : "en"; },
    set: setLang,
    /* handy for finding text that still needs a translation */
    missing: function () {
      var out = {};
      visit(document.body, function (u) { if (!DICT[u.key] && /[A-Za-z]{2}/.test(u.key)) out[u.key] = 1; });
      attrs(document.body, function (el, a, key) { if (!DICT[key] && /[A-Za-z]{2}/.test(key)) out[key] = 1; });
      return Object.keys(out);
    }
  };

  window.addEventListener("load", function () {
    // wait one tick so enhance.js / assistant.js have built their DOM
    setTimeout(function () {
      var b = window.__langBtn;
      if (b) b.addEventListener("click", function () { setLang(active ? "en" : "ur"); });
      if (get("lang") === "ur") setLang("ur"); else { setBtn(); root.classList.add("i18n-ready"); }
    }, 30);
  });
  // safety net: never leave the page hidden
  setTimeout(function () { root.classList.add("i18n-ready"); }, 2500);
})();
