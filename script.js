document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });

document.querySelectorAll(".section").forEach(s => {
  s.classList.add("fade");
  observer.observe(s);
});

document.querySelector(".hero-btn")?.addEventListener("click", () => {
  const menuEl = document.getElementById("menu");
  if (menuEl) menuEl.scrollIntoView({ behavior: "smooth" });
});

(function() {
  const filterBtns = document.querySelectorAll(".menu-filter-btn");
  const grids = document.querySelectorAll(".menu-grid");
  const titles = document.querySelectorAll(".menu-category-title");

  if (!filterBtns.length || !grids.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {

      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      grids.forEach(grid => {
        [...grid.children].forEach((card) => {
          card.style.transition = "opacity 0.25s ease, transform 0.25s ease";
          card.style.opacity = "0";
          card.style.transform = "translateY(10px)";
        });
      });

      setTimeout(() => {

        grids.forEach(grid => {
          const cat = grid.dataset.category;

          if (filter === "all" || filter === cat) {
            grid.style.display = "grid";
          } else {
            grid.style.display = "none";
          }

          if (grid.style.display !== "none") {
            [...grid.children].forEach((card, i) => {
              card.style.opacity = "0";
              card.style.transform = "translateY(10px)";
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, i * 80);
            });
          }
        });

        titles.forEach(title => {
          const cat = title.dataset.category;
          title.style.display = (filter === "all" || filter === cat) ? "block" : "none";
        });

      }, 260);

    });
  });
})();

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add("hide");
    setTimeout(() => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 900);
  }, 800);
});

(function() {
  const reviewCards = document.querySelectorAll(".review-card");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (!reviewCards.length) return;

  let currentIndex = 0;

  if (!dotsContainer) {
    const fallback = document.createElement("div");
    fallback.className = "carousel-dots";
    const carouselSection = document.querySelector(".testimonials-section");
    if (carouselSection) carouselSection.appendChild(fallback);
  }

  const dotsWrap = document.querySelector(".carousel-dots");

  reviewCards.forEach((_, i) => {
    if (!dotsWrap) return;
    const dot = document.createElement("div");
    if (i === 0) dot.classList.add("active");
    dotsWrap.appendChild(dot);

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

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % reviewCards.length;
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + reviewCards.length) % reviewCards.length;
      updateCarousel();
    });
  }

  setInterval(() => {
    currentIndex = (currentIndex + 1) % reviewCards.length;
    updateCarousel();
  }, 5000);
})();


(function() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  if (!themeToggle) return;

  if (localStorage.getItem("theme") === "dark" || localStorage.getItem("theme") === "dark-mode") {
    body.classList.add("dark-mode");
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const menuCards = document.querySelectorAll(".menu-card");
  const favoritesGrid = document.querySelector(".favorites-grid");

  menuCards.forEach((card, index) => {

    let itemId = card.dataset.id;
    if (!itemId) {
      const title = card.querySelector("h3")?.textContent?.trim() || `menu-${index}`;
      itemId = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      card.dataset.id = itemId;
    }

    const computed = window.getComputedStyle(card);
    if (computed.position === "static") card.style.position = "relative";

    let btn = card.querySelector(".favorite-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.className = "favorite-btn";
      btn.setAttribute("aria-label", "Add to favorites");
      btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      card.appendChild(btn);
    }

    const icon = btn.querySelector("i");

    function syncButton() {
      if (favorites.includes(itemId)) {
        btn.classList.add("active");
        icon.classList.replace("fa-regular", "fa-solid");
      } else {
        btn.classList.remove("active");
        icon.classList.replace("fa-solid", "fa-regular");
      }
    }

    syncButton();

    btn.addEventListener("click", e => {
      e.stopPropagation();

      if (favorites.includes(itemId)) {
        favorites = favorites.filter(id => id !== itemId);
      } else {
        favorites.push(itemId);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      syncButton();
      renderFavoritesSection();
    });
  });

  function renderFavoritesSection() {
    if (!favoritesGrid) return;

    favoritesGrid.innerHTML = "";

    if (favorites.length === 0) {
      favoritesGrid.innerHTML = `<p class="empty-msg">No favorites added yet.</p>`;
      return;
    }

    favorites.forEach(id => {
      const original = document.querySelector(`.menu-card[data-id="${id}"]`);
      if (!original) return;

      const clone = original.cloneNode(true);

      const btn = clone.querySelector(".favorite-btn");
      const icon = btn?.querySelector("i");

      if (btn) {
        btn.addEventListener("click", () => {
          favorites = favorites.filter(f => f !== id);
          localStorage.setItem("favorites", JSON.stringify(favorites));
          renderFavoritesSection();

          const realOriginalBtn = original.querySelector(".favorite-btn i");
          if (realOriginalBtn) realOriginalBtn.classList.replace("fa-solid", "fa-regular");
        });
      }

      if (icon) icon.classList.replace("fa-regular", "fa-solid");

      favoritesGrid.appendChild(clone);
    });
  }

  renderFavoritesSection();
});

const hamburger = document.getElementById("hamburger");
const nav = document.querySelector("nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  nav.classList.toggle("open");
});
