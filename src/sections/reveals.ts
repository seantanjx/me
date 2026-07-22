import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $$, prefersReducedMotion } from "../lib/exports";

gsap.registerPlugin(ScrollTrigger);

/**
 * 02 · APPROACH + generic scroll reveals.
 * - Generic [data-reveal] elements (outside the hero) rise in on enter.
 * - The approach script "lights" line by line as it's pinned through, so the
 *   statement reads as a controlled sequence rather than a wall of text.
 * Reduced-motion: everything is shown at rest, no pinning, no scrub.
 */
export function initReveals(): void {
  const reduced = prefersReducedMotion();

  // Generic reveals (skip the hero — it runs its own load timeline)
  const reveals = $$("[data-reveal]").filter(
    (el) => !el.closest(".section--index"),
  );
  if (reduced) {
    gsap.set(reveals, { opacity: 1, y: 0 });
  } else {
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    });
  }

  // Approach — line-by-line lighting
  const lines = $$("[data-line]");
  if (reduced) {
    gsap.set(lines, { opacity: 1, y: 0 });
    lines.forEach((l) => l.classList.add("is-lit"));
    return;
  }

  lines.forEach((line) => {
    gsap.fromTo(
      line,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: line,
          start: "top 82%",
          end: "top 45%",
          onEnter: () => line.classList.add("is-lit"),
          onLeaveBack: () => line.classList.remove("is-lit"),
        },
      },
    );
  });
}
