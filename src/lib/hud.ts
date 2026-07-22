import { $, $$ } from "./utils";
import type { Scroller } from "./smooth";

/**
 * The persistent instrument frame: live clock, pointer coordinates,
 * scroll-progress bar, and the active-section readout (via IntersectionObserver).
 */
export function initHud(scroller: Scroller): void {
  const clockEl = $("[data-hud-clock]");
  const coordsEl = $("[data-hud-coords]");
  const coordsMirror = $("[data-hud-coords-mirror]");
  const progressEl = $("[data-hud-progress]");
  const indexEl = $("[data-hud-index]");
  const sectionEl = $("[data-hud-section]");
  const yearEl = $("[data-year]");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Live UTC clock
  const tick = (): void => {
    if (!clockEl) return;
    const d = new Date();
    const p = (n: number): string => String(n).padStart(2, "0");
    clockEl.textContent = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(
      d.getUTCSeconds(),
    )} UTC`;
  };
  tick();
  setInterval(tick, 1000);

  // Pointer coordinates readout
  window.addEventListener(
    "pointermove",
    (e) => {
      if (!coordsEl) return;
      const x = String(Math.round(e.clientX)).padStart(3, "0");
      const y = String(Math.round(e.clientY)).padStart(3, "0");
      coordsEl.textContent = `X ${x} · Y ${y}`;
    },
    { passive: true },
  );

  // Scroll progress
  scroller.onScroll((progress) => {
    if (progressEl) progressEl.style.scale = `${progress.toFixed(4)} 1`;
    if (coordsMirror)
      coordsMirror.textContent = `${(progress * 100).toFixed(1)}% TRAVERSED`;
  });

  // Active-section readout
  const sections = $$<HTMLElement>("section[data-section]");
  // Center-line trigger: fires for whichever section crosses the viewport
  // midline. Works regardless of section height (a threshold-based observer
  // can never fire for sections taller than the viewport).
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        if (indexEl) indexEl.textContent = el.dataset.index ?? "01";
        if (sectionEl) sectionEl.textContent = el.dataset.section ?? "INDEX";
      }
    },
    { threshold: 0, rootMargin: "-50% 0px -50% 0px" },
  );
  sections.forEach((s) => io.observe(s));
}
