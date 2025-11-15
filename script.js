// ==========================
// Smooth Scroll Navigation
// ==========================
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ==========================
// Fade-in on Scroll (IntersectionObserver)
// ==========================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });

document.querySelectorAll(".section").forEach(s => {
  s.classList.add("fade");
  observer.observe(s);
});

// ==========================
// Hero button scroll
// ==========================
document.querySelector(".hero-btn")?.addEventListener("click", () => {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

// ==========================
// MENU FILTERS
// ==========================
const filterBtns = document.querySelectorAll(".menu-filter-btn");
const grids = document.querySelectorAll(".menu-grid");
const titles = document.querySelectorAll(".menu-category-title");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {

    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    grids.forEach(grid => {
      const cat = grid.dataset.category;

      if (filter === "all" || filter === cat) {
        grid.style.display = "grid";
      } else {
        grid.style.display = "none";
      }
    });

    titles.forEach(title => {
      const cat = title.dataset.category;

      if (filter === "all" || filter === cat) {
        title.style.display = "block";
      } else {
        title.style.display = "none";
      }
    });

  });
});

// ==========================
// Loader (fade-out)
// ==========================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  // Keep loader visible briefly so spinner is perceived
  setTimeout(() => {
    loader.classList.add("hide");
    // remove loader from DOM after transition to avoid covering interactive elements
    setTimeout(() => {
      loader.parentNode && loader.parentNode.removeChild(loader);
    }, 900);
  }, 800); // Adjust delay as needed
});

// ------------------------------
// Testimonials Carousel
// ------------------------------

const reviewCards = document.querySelectorAll(".review-card");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const dotsContainer = document.querySelector(".carousel-dots");

let currentIndex = 0;

// Create dots dynamically
reviewCards.forEach((_, i) => {
  const dot = document.createElement("div");
  if (i === 0) dot.classList.add("active");
  dotsContainer.appendChild(dot);

  dot.addEventListener("click", () => {
    currentIndex = i;
    updateCarousel();
  });
});

const dots = document.querySelectorAll(".carousel-dots div");

function updateCarousel() {
  reviewCards.forEach((card, i) => {
    card.classList.toggle("active", i === currentIndex);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % reviewCards.length;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + reviewCards.length) % reviewCards.length;
  updateCarousel();
});

// Autoplay every 5 seconds
setInterval(() => {
  currentIndex = (currentIndex + 1) % reviewCards.length;
  updateCarousel();
}, 5000);