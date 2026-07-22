import { gsap } from "gsap";
import { $, $$, prefersReducedMotion } from "../lib/exports";

/**
 * 01 · INDEX — the page-load choreography.
 * Glyphs assemble out of depth, then the supporting lines rise in.
 * This is the one big orchestrated entrance the brand invites.
 */
export function initHero(): void {
  const title = $("[data-assemble]");
  const glyphs = $$(".index__glyph");
  const reveals = $$('.section--index [data-reveal]');

  if (prefersReducedMotion()) {
    gsap.set([...glyphs, ...reveals], { opacity: 1, y: 0, clearProps: "transform" });
    return;
  }

  gsap.set(glyphs, {
    yPercent: 120,
    opacity: 0,
    rotateX: -80,
    filter: "blur(12px)",
  });
  gsap.set(reveals, { opacity: 0, y: 22 });

  const tl = gsap.timeline({ delay: 0.25, defaults: { ease: "expo.out" } });
  tl.to(glyphs, {
    yPercent: 0,
    opacity: 1,
    rotateX: 0,
    filter: "blur(0px)",
    duration: 1.35,
    stagger: { each: 0.055, from: "start" },
  })
    .to(
      reveals,
      { opacity: 1, y: 0, duration: 1, stagger: 0.12 },
      "-=0.7",
    );

  // Gentle pointer parallax on the title block (depth cue)
  if (title) {
    const stage = title.closest<HTMLElement>(".index__stage")!;
    window.addEventListener(
      "pointermove",
      (e) => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 2;
        const dy = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(stage, {
          x: dx * 14,
          y: dy * 10,
          rotateY: dx * 2.4,
          rotateX: -dy * 2.4,
          duration: 0.9,
          ease: "power2.out",
          transformPerspective: 900,
        });
      },
      { passive: true },
    );
  }
}
