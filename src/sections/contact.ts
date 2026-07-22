import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$, isFinePointer, prefersReducedMotion } from "../lib/exports";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ▚▞░▓/\\<>=+*";

/**
 * 04 · CONTACT — a cursor-reactive "transmit" endpoint.
 * The word "channel" resolves out of a character-scramble when it first enters
 * view and again on hover — a signal locking in. Links pull magnetically toward
 * the cursor. Reduced-motion: the word is simply present, links are static.
 */
export function initContact(): void {
  const word = $("[data-transmit]");

  if (word && !prefersReducedMotion()) {
    const finalText = word.textContent ?? "";
    const scramble = (duration = 620): void => {
      const start = performance.now();
      const len = finalText.length;
      const step = (now: number): void => {
        const t = Math.min((now - start) / duration, 1);
        const settled = Math.floor(t * len);
        let out = "";
        for (let i = 0; i < len; i++) {
          out +=
            i < settled
              ? finalText[i]
              : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        word.textContent = out;
        if (t < 1) requestAnimationFrame(step);
        else word.textContent = finalText;
      };
      requestAnimationFrame(step);
    };

    ScrollTrigger.create({
      trigger: word,
      start: "top 80%",
      once: true,
      onEnter: () => scramble(),
    });
    word.closest(".contact__title")?.addEventListener("pointerenter", () => scramble(420));
  }

  // Magnetic links
  if (!isFinePointer() || prefersReducedMotion()) return;
  $$<HTMLElement>(".contact__links .link").forEach((link) => {
    link.addEventListener("pointermove", (e) => {
      const r = link.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(link, { x: x * 16, y: y * 8, duration: 0.5, ease: "power2.out" });
    });
    link.addEventListener("pointerleave", () => {
      gsap.to(link, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    });
  });
}
