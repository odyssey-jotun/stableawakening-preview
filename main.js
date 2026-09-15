// Mobile menu
const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  const setOpen = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
}

// Fade sections in as they scroll into view
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add("in"));
}

// Video carousel: pages of three on desktop, one card at a time on phones
const GAP = 16;
const isPhone = () => window.matchMedia("(max-width: 640px)").matches;
const stepFor = (track) => {
  if (isPhone()) {
    const card = track.querySelector(".video-card");
    return card ? card.offsetWidth + GAP : track.clientWidth;
  }
  return track.clientWidth + GAP;
};

document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const track = document.getElementById(btn.getAttribute("aria-controls"));
    if (track) track.scrollBy({ left: Number(btn.dataset.scroll) * stepFor(track), behavior: "smooth" });
  });
});

document.querySelectorAll(".dots[data-for]").forEach((dots) => {
  const track = document.getElementById(dots.dataset.for);
  if (!track) return;
  const pages = track.querySelectorAll(".slide");
  const buttons = [...pages].map((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Show videos ${i * 3 + 1}–${Math.min((i + 1) * 3, track.querySelectorAll(".video-card").length)}`);
    b.addEventListener("click", () => track.scrollTo({ left: i * (track.clientWidth + GAP), behavior: "smooth" }));
    dots.appendChild(b);
    return b;
  });
  const update = () => {
    const i = Math.round(track.scrollLeft / (track.clientWidth + GAP));
    buttons.forEach((b, j) => b.classList.toggle("active", j === i));
  };
  track.addEventListener("scroll", update, { passive: true });
  update();
});

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
