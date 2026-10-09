/* ================= PAGE TRANSITION ================= */
(() => {
    document.documentElement.style.transition = "opacity .35s ease";
    document.documentElement.style.opacity = "0";

    window.addEventListener("DOMContentLoaded", () => {
        requestAnimationFrame(() => {
            document.documentElement.style.opacity = "1";
        });
    });

    document.addEventListener("click", e => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("http") ||
            href.startsWith("mailto:") || link.target === "_blank") return;

        e.preventDefault();
        document.documentElement.style.opacity = "0";
        setTimeout(() => { window.location.href = href; }, 320);
    });
})();

document.addEventListener("DOMContentLoaded", () => {

    // Mobile Menu
    const menuBtn = document.getElementById("menu-btn");
    const navbar = document.getElementById("navbar");

    if (menuBtn && navbar) {
        menuBtn.addEventListener("click", () => {
            menuBtn.classList.toggle("active");
            navbar.classList.toggle("active");
        });

        navbar.querySelectorAll("a").forEach(link =>
            link.addEventListener("click", () => {
                menuBtn.classList.remove("active");
                navbar.classList.remove("active");
            })
        );
    }

    // Read More
    document.querySelectorAll(".read-more").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".cert-card");
            if (!card) return;

            card.classList.toggle("active");
            btn.textContent = card.classList.contains("active")
                ? "Read Less"
                : "Read More";
        });
    });

    // Skill Animation
    const skillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll(".skill-card")
        .forEach(card => skillObserver.observe(card));

    // Fade-in / reveal animations now live in enhance.js

    // Contact Form
    const form = document.getElementById("contact-form");

    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();

            const btn = form.querySelector("button[type='submit']");
            if (!btn) return;

            btn.textContent = "✓ Message Sent!";
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = "Send Message";
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    // Typing Animation
    const typing = document.getElementById("typing-text");

    if (typing) {
        const roles = [
            "Data Analyst",
            "Web Developer",
            "Python Developer"
        ];

        let role = 0,
            char = 0,
            deleting = false;

        function type() {
            const text = roles[role];

            typing.textContent = deleting
                ? text.substring(0, char--)
                : text.substring(0, char++);

            if (!deleting && char > text.length) {
                deleting = true;
                return setTimeout(type, 1500);
            }

            if (deleting && char < 0) {
                deleting = false;
                role = (role + 1) % roles.length;
            }

            setTimeout(type, deleting ? 50 : 100);
        }

        type();
    }
});

// 3D Tilt (Desktop Only)
const heroCard = document.getElementById("heroCard");

if (heroCard && window.matchMedia("(hover: hover)").matches) {

    document.addEventListener("mousemove", e => {
        const x = (window.innerWidth / 2 - e.clientX) / 25;
        const y = (window.innerHeight / 2 - e.clientY) / 25;

        heroCard.style.transform =
            `rotateY(${x}deg) rotateX(${y}deg)`;
    });

    document.addEventListener("mouseleave", () => {
        heroCard.style.transform =
            "rotateY(0deg) rotateX(0deg)";
    });
}

// Cursor Light
const light = document.querySelector(".cursor-light");

if (light) {
    document.addEventListener("mousemove", e => {
        light.style.left = `${e.pageX}px`;
        light.style.top = `${e.pageY}px`;
    });
}

// Click Burst
document.addEventListener("click", e => {
    const burst = document.createElement("div");

    Object.assign(burst.style, {
        position: "absolute",
        left: `${e.pageX}px`,
        top: `${e.pageY}px`,
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "rgba(212,175,55,.8)",
        transform: "translate(-50%,-50%)",
        animation: "burst .6s ease-out forwards",
        zIndex: "9999"
    });

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 600);
});

const style = document.createElement("style");
style.textContent = `
@keyframes burst{
    from{transform:translate(-50%,-50%) scale(1);opacity:1;}
    to{transform:translate(-50%,-50%) scale(12);opacity:0;}
}`;
document.head.appendChild(style);