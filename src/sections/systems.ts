import { $$, isFinePointer, prefersReducedMotion } from "../lib/exports";

/**
 * 03 · SYSTEMS — an accessible disclosure list with a magnetic focus-pull.
 * Clicking/keyboard-activating a row expands its detail in place (one open at a
 * time). On fine pointers the rows drift subtly toward the cursor — the
 * "instrument responds to your hand" read — with no effect on layout or a11y.
 */
export function initSystems(): void {
  const discs = $$<HTMLElement>("[data-disc]");

  discs.forEach((disc) => {
    const btn = disc.querySelector<HTMLButtonElement>(".disc__row")!;
    btn.addEventListener("click", () => {
      const isOpen = disc.hasAttribute("data-open");
      // collapse siblings for a single-focus reading rhythm
      discs.forEach((d) => {
        if (d !== disc) {
          d.removeAttribute("data-open");
          d.querySelector(".disc__row")?.setAttribute("aria-expanded", "false");
        }
      });
      if (isOpen) {
        disc.removeAttribute("data-open");
        btn.setAttribute("aria-expanded", "false");
      } else {
        disc.setAttribute("data-open", "");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Magnetic drift — enhancement only
  if (!isFinePointer() || prefersReducedMotion()) return;

  discs.forEach((disc) => {
    const name = disc.querySelector<HTMLElement>(".disc__name")!;
    disc.addEventListener("pointermove", (e) => {
      const rect = disc.getBoundingClientRect();
      const rel = (e.clientX - rect.left) / rect.width - 0.5;
      name.style.transform = `translateX(${rel * 14}px)`;
    });
    disc.addEventListener("pointerleave", () => {
      name.style.transform = "";
    });
  });
}
