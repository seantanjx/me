import { $, $$ } from "./utils";
import type { Scroller } from "./smooth";

/**
 * The persistent instrument frame: live clock, pointer coordinates,
 * scroll-progress bar, and the active-section readout (via IntersectionObserver).
 */
export function initHud(scroller: Scroller): void {
  const clockEl = $("[data-hud-clock]");
  const coordsEl = $("[data-hud-coords]");
  const progressEl = $("[data-hud-progress]");
  const progressVal = $("[data-hud-progress-val]");
  const indexEl = $("[data-hud-index]");
  const sectionEl = $("[data-hud-section]");
  const yearEl = $("[data-year]");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Live Singapore clock (SGT, UTC+8, no DST) via the IANA time zone so it
  // stays correct regardless of the viewer's own locale.
  const sgtTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const tick = (): void => {
    if (!clockEl) return;
    clockEl.textContent = `${sgtTime.format(new Date())} SGT`;
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

  // Scroll progress — rail fill + anchored numeric readout in the HUD
  scroller.onScroll((progress) => {
    if (progressEl) progressEl.style.scale = `${progress.toFixed(4)} 1`;
    if (progressVal)
      progressVal.textContent = `${String(Math.round(progress * 100)).padStart(3, "0")}%`;
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
