// Smooth Scrolling for Navbar
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', e => {
    if (link.hash !== "") {
      e.preventDefault();
      const target = document.querySelector(link.hash);
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});


const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active"); // animate hamburger
  navbar.classList.toggle("active");  // slide menu
});

// Close menu when clicking a link
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove("active");
    menuBtn.classList.remove("active");
  });
});



// Close menu after clicking a link
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove("active");
  });
});

// Active Navbar Highlight on Scroll 
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// Certificates Popup Viewer 
const popup = document.createElement("div");
popup.id = "popup";
popup.className = "popup";
popup.innerHTML = `
  <span class="close">&times;</span>
  <img class="popup-content" id="popup-img">
`;
document.body.appendChild(popup);

const popupImg = document.getElementById("popup-img");
const closeBtn = popup.querySelector(".close");

// Handle view buttons
document.querySelectorAll(".view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const imgSrc = btn.getAttribute("data-img");
    popup.style.display = "block";
    popupImg.src = imgSrc;
  });
});

// Close popup
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// Close when clicking outside image
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});

// Hero Button (Hire Me) Action
const hireBtn = document.querySelector(".btn");
if (hireBtn) {
  hireBtn.addEventListener("click", () => {
    window.location.href = "#contact"; // Scroll to contact
  });
}

// Optional Animation on Scroll (fade-in)
const faders = document.querySelectorAll("section, .certificate-card, .project-card");

const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("fade-in");
    appearOnScroll.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

