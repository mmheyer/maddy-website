const placeholderButton = document.getElementById("open-placeholder");
const placeholder = document.getElementById("ai-placeholder");

document.body.classList.add("js-enabled");

if (placeholderButton && placeholder) {
  placeholderButton.addEventListener("click", () => {
    placeholder.hidden = !placeholder.hidden;
    placeholderButton.textContent = placeholder.hidden
      ? "Preview placeholder"
      : "Hide placeholder";
  });
}

const panels = document.querySelectorAll(".panel");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -10% 0px" }
);

panels.forEach((panel) => observer.observe(panel));

const progressBar = document.getElementById("scroll-progress");
const updateProgress = () => {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const height =
    document.documentElement.scrollHeight - window.innerHeight || 1;
  const ratio = Math.min(1, scrollTop / height);
  progressBar.style.transform = `scaleX(${ratio})`;
};

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });

const heroLights = document.querySelectorAll(".hero-light");
let lightFrame;

if (heroLights.length) {
  window.addEventListener("pointermove", (event) => {
    if (lightFrame) cancelAnimationFrame(lightFrame);
    lightFrame = requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * 18;
      heroLights.forEach((light, idx) => {
        const depth = idx === 0 ? 1.2 : 1.6;
        light.style.transform = `translate(${x / depth}px, ${y / depth}px)`;
      });
    });
  });
}
