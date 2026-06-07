document.addEventListener("DOMContentLoaded", () => {

  /* ── Mobile menu ── */
  const menuBtn = document.getElementById("menu-btn");
  const navbar  = document.getElementById("navbar");
  if (menuBtn && navbar) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active");
      navbar.classList.toggle("active");
    });
    navbar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuBtn.classList.remove("active");
      });
    });
  }

  /* ── Read-more toggle on certificates ── */
  document.querySelectorAll(".read-more").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".certificate-card");
      card.classList.toggle("active");
      btn.textContent = card.classList.contains("active") ? "Read Less" : "Read More";
    });
  });

  /* ── Skill bar animation (IntersectionObserver) ── */
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        skillObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll(".skill-card").forEach(c => skillObserver.observe(c));

  /* ── Fade-in on scroll ── */
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateY(0)";
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".project-card, .certificate-card, .skill-card").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity .6s ease, transform .6s ease";
    fadeObserver.observe(el);
  });

  /* ── Contact form ── */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      btn.textContent = "✓ Message Sent!";
      btn.style.background = "linear-gradient(45deg,#0c9e3e,#0f7a30)";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "Send Message";
        btn.style.background = "";
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

});

/* ===== 3D TILT ===== */
const card = document.getElementById("heroCard");

document.addEventListener("mousemove", (e) => {
  if (!card) return;

  const x = (window.innerWidth / 2 - e.clientX) / 25;
  const y = (window.innerHeight / 2 - e.clientY) / 25;

  card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

/* RESET ON LEAVE */
document.addEventListener("mouseleave", () => {
  if (card) card.style.transform = "rotateY(0deg) rotateX(0deg)";
});


/* ===== CURSOR LIGHT ===== */
const light = document.querySelector(".cursor-light");

document.addEventListener("mousemove", (e) => {
  if (!light) return;
  light.style.left = e.pageX + "px";
  light.style.top = e.pageY + "px";
});


/* ===== CLICK ENERGY BURST ===== */
document.addEventListener("click", (e) => {
  const burst = document.createElement("div");

  burst.style.position = "absolute";
  burst.style.left = e.pageX + "px";
  burst.style.top = e.pageY + "px";
  burst.style.width = "10px";
  burst.style.height = "10px";
  burst.style.borderRadius = "50%";
  burst.style.background = "rgba(0,255,255,0.8)";
  burst.style.transform = "translate(-50%, -50%) scale(1)";
  burst.style.animation = "burst 0.6s ease-out forwards";
  burst.style.zIndex = "9999";

  document.body.appendChild(burst);

  setTimeout(() => burst.remove(), 600);
});

/* BURST ANIMATION */
const style = document.createElement("style");
style.innerHTML = `
@keyframes burst {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(12); opacity: 0; }
}`;
document.head.appendChild(style);