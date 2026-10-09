/* =====================================================================
   ENHANCEMENTS — extra motion + interactivity. Loaded after script.js.
   Everything here is progressive: if it fails, the site still works.
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- aurora + progress bar + back-to-top ---------- */
    var aurora = document.createElement("div");
    aurora.className = "aurora";
    aurora.innerHTML = "<span></span><span></span><span></span>";
    document.body.insertBefore(aurora, document.body.firstChild);

    var bar = document.createElement("div");
    bar.id = "scroll-progress";
    document.body.appendChild(bar);

    var topBtn = document.createElement("button");
    topBtn.id = "to-top";
    topBtn.setAttribute("aria-label", "Back to top");
    topBtn.innerHTML = "<i class='bx bx-chevron-up'></i>";
    topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(topBtn);

    var timeline = $(".timeline");
    if (timeline) timeline.classList.add("tl-draw");
    function updateTimeline() {
      if (!timeline) return;
      var r = timeline.getBoundingClientRect();
      var p = (window.innerHeight * 0.72 - r.top) / r.height;
      timeline.style.setProperty("--tp", Math.max(0, Math.min(1, p)).toFixed(3));
    }

    var header = $("header");
    var ticking = false;
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = "scaleX(" + p + ")";
      if (header) header.classList.toggle("scrolled", h.scrollTop > 30);
      topBtn.classList.toggle("show", h.scrollTop > 500);
      aurora.style.setProperty("--sy", h.scrollTop);
      updateTimeline();
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    /* ---------- hero extras: orbit dots + scroll hint ---------- */
    var scene = $("#scene");
    if (scene) {
      var orbit = document.createElement("div");
      orbit.className = "orbit";
      orbit.innerHTML = "<i></i><i></i><i></i>";
      scene.insertBefore(orbit, scene.firstChild);
    }
    var home = $(".home");
    if (home) {
      var hint = document.createElement("div");
      hint.className = "scroll-hint";
      home.appendChild(hint);
    }

    /* ---------- typewriter (works in every browser) ---------- */
    var typingHost = $(".typing-text");
    var typingSpan = typingHost && $("span", typingHost);
    if (typingSpan) {
      var roles = ["Data Analyst", "Web Developer", "Python Developer", "AI Enthusiast", "Freelancer"];
      typingHost.classList.add("js-typed");
      if (reduceMotion) {
        typingSpan.textContent = roles[0];
      } else {
        var r = 0, c = roles[0].length, del = false;
        typingSpan.textContent = roles[0];
        setTimeout(function () { del = true; tick(); }, 1800);
        function tick() {
          var word = roles[r];
          c += del ? -1 : 1;
          typingSpan.textContent = word.slice(0, c);
          var wait = del ? 45 : 95;
          if (!del && c === word.length) { del = true; wait = 1500; }
          else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 220; }
          setTimeout(tick, wait);
        }
      }
    }

    /* ---------- scroll reveal (with stagger) ---------- */
    var revealTargets = [
      ".about-image", ".about-content > *", ".stat-card",
      ".timeline-item",
      ".project-card", ".cert-card", ".certificate-section > h3",
      ".skill-group", ".ring-card",
      ".info-card", ".contact-card", ".section-title",
      ".page-sub"
    ];
    var headingSel = "section h2";

    function prep(el, idx, group) {
      el.classList.add("rv");
      if (el.matches(".about-image, .timeline-item:nth-child(odd)")) el.classList.add("rv-left");
      else if (el.matches(".about-content > *, .timeline-item:nth-child(even)")) el.classList.add("rv-right");
      else if (el.matches(".stat-card, .ring-card")) el.classList.add("rv-zoom");
      var d = Math.min(idx, 6) * 0.09;
      el.style.setProperty("--d", d + "s");
    }

    var counters = [];
    revealTargets.forEach(function (sel) {
      $$(sel).forEach(function (el, i) {
        if (el.classList.contains("rv")) return;
        prep(el, i % 6);
      });
    });
    $$(headingSel).forEach(function (h) { h.classList.add("rv", "h-line"); });

    // count-up numbers (about stats + skill rings)
    $$(".stat-card h3, .ring-pct").forEach(function (el) {
      var m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (m) counters.push({ el: el, end: parseInt(m[1], 10), suffix: m[2] });
    });

    function countUp(item) {
      if (reduceMotion) return;
      var start = null, dur = 1400;
      item.el.textContent = "0" + item.suffix;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        item.el.textContent = Math.round(item.end * eased) + item.suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function onIn(el) {
      el.classList.add("in");
      // pop skill tags in sequence
      if (el.classList.contains("skill-group")) {
        $$(".skill-tag", el).forEach(function (t, i) {
          t.style.animationDelay = (0.25 + i * 0.07) + "s";
          t.classList.add("pop");
        });
      }
      counters.forEach(function (cn) { if (el === cn.el || el.contains(cn.el)) countUp(cn); });
      // free the element for hover transforms once its reveal is done
      var cleaned = false;
      function clean() {
        if (cleaned) return; cleaned = true;
        el.classList.remove("rv", "rv-left", "rv-right", "rv-zoom");
        if (!el.classList.contains("h-line")) el.classList.remove("in");
        el.style.removeProperty("--d");
      }
      if (!el.classList.contains("h-line")) {
        el.addEventListener("transitionend", function te(e) {
          if (e.target === el && e.propertyName === "opacity") { el.removeEventListener("transitionend", te); clean(); }
        });
        setTimeout(clean, 2200);
      }
    }

    if ("IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { io.unobserve(en.target); onIn(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      $$(".rv").forEach(function (el) { io.observe(el); });
    } else {
      $$(".rv").forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------- cursor glow + 3D tilt on cards ---------- */
    if (canHover && !reduceMotion) {
      var glowSel = ".project-card, .cert-card, .exp-card, .skill-group, .stat-card, .info-card, .ring-card, .contact-card";
      document.addEventListener("mousemove", function (e) {
        var card = e.target.closest && e.target.closest(glowSel);
        if (!card) return;
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left, y = e.clientY - rect.top;
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
        if (card.matches(".project-card, .cert-card") && !card.classList.contains("rv")) {
          var rx = ((y / rect.height) - 0.5) * -7;
          var ry = ((x / rect.width) - 0.5) * 7;
          card.classList.add("tilting");
          card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-8px)";
        }
      }, { passive: true });
      document.addEventListener("mouseout", function (e) {
        var card = e.target.closest && e.target.closest(".project-card, .cert-card");
        if (card && !card.contains(e.relatedTarget)) {
          card.classList.remove("tilting");
          card.style.transform = "";
        }
      });

      /* magnetic buttons */
      $$(".btn, .cv-btn").forEach(function (b) {
        b.addEventListener("mousemove", function (e) {
          var r = b.getBoundingClientRect();
          var x = (e.clientX - (r.left + r.width / 2)) * 0.22;
          var y = (e.clientY - (r.top + r.height / 2)) * 0.32;
          b.style.transform = "translate(" + x.toFixed(1) + "px," + (y - 2).toFixed(1) + "px)";
        });
        b.addEventListener("mouseleave", function () { b.style.transform = ""; });
      });
    }

    /* ---------- button click ripple ---------- */
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".btn, .cv-btn, .project-links a, .gallery-btn, .read-more, .whatsapp-link");
      if (!b || reduceMotion) return;
      var r = b.getBoundingClientRect();
      var size = Math.max(r.width, r.height);
      var s = document.createElement("span");
      s.className = "ripple";
      s.style.width = s.style.height = size + "px";
      s.style.left = (e.clientX - r.left - size / 2) + "px";
      s.style.top = (e.clientY - r.top - size / 2) + "px";
      b.appendChild(s);
      setTimeout(function () { s.remove(); }, 700);
    });

    /* ---------- hero name: split into letters ---------- */
    var h1 = $(".home-content h1");
    if (h1 && !reduceMotion) {
      var txt = h1.textContent.trim();
      h1.setAttribute("aria-label", txt);
      h1.classList.add("js-split");
      h1.innerHTML = "";
      var n = 0;
      txt.split(" ").forEach(function (word, wi) {
        if (wi > 0) h1.appendChild(document.createTextNode(" "));
        var w = document.createElement("span");
        w.className = "w";
        w.setAttribute("aria-hidden", "true");
        word.split("").forEach(function (ch) {
          var sp = document.createElement("span");
          sp.className = "ch";
          sp.style.setProperty("--i", n++);
          sp.textContent = ch;
          w.appendChild(sp);
        });
        h1.appendChild(w);
      });
    }

    /* ---------- cursor ring + sparkle trail (mouse devices only) ---------- */
    if (canHover && !reduceMotion && window.innerWidth > 768) {
      var ring = document.createElement("div");
      ring.className = "cursor-ring";
      document.body.appendChild(ring);
      var rx = 0, ry = 0, cx = 0, cy = 0, seen = false;
      document.addEventListener("mousemove", function (e) {
        cx = e.clientX; cy = e.clientY;
        if (!seen) { seen = true; rx = cx; ry = cy; ring.classList.add("on"); }
      }, { passive: true });
      document.addEventListener("mouseleave", function () { ring.classList.remove("on"); seen = false; });
      (function follow() {
        rx += (cx - rx) * 0.2; ry += (cy - ry) * 0.2;
        ring.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)";
        requestAnimationFrame(follow);
      })();
      document.addEventListener("mouseover", function (e) {
        var hot = e.target.closest && e.target.closest("a, button, .gallery-btn, .read-more, .skill-tag, .tag, .project-card, .cert-card");
        ring.classList.toggle("hot", !!hot);
      });

      var lastSpark = 0, alive = 0;
      document.addEventListener("mousemove", function (e) {
        var now = performance.now();
        if (now - lastSpark < 55 || alive > 14) return;
        lastSpark = now; alive++;
        var sp = document.createElement("span");
        sp.className = "spark" + (Math.random() < 0.5 ? " g" : "");
        sp.style.left = e.clientX - 3 + "px";
        sp.style.top = e.clientY - 3 + "px";
        sp.style.setProperty("--dx", ((Math.random() - 0.5) * 40).toFixed(0) + "px");
        sp.style.setProperty("--dy", (10 + Math.random() * 30).toFixed(0) + "px");
        document.body.appendChild(sp);
        setTimeout(function () { sp.remove(); alive--; }, 800);
      }, { passive: true });
    }

    /* ---------- gallery modal: animate each image swap ---------- */
    var modalImg = $("#galleryModalImg");
    if (modalImg && "MutationObserver" in window) {
      new MutationObserver(function () {
        if (!modalImg.getAttribute("src")) return;
        modalImg.classList.remove("swap");
        void modalImg.offsetWidth;
        modalImg.classList.add("swap");
      }).observe(modalImg, { attributes: true, attributeFilter: ["src"] });
    }
  });
})();
