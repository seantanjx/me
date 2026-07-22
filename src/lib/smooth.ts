import Lenis from "lenis";
import { prefersReducedMotion } from "./utils";

export interface Scroller {
  lenis: Lenis | null;
  onScroll: (cb: (progress: number, y: number) => void) => void;
}

/**
 * Smooth scroll via Lenis, driven off a single rAF loop.
 * Reduced-motion: Lenis is not started; native scroll is used and we still
 * emit progress so reveals and the HUD keep working.
 */
export function initSmooth(): Scroller {
  const listeners: ((progress: number, y: number) => void)[] = [];
  const emit = (): void => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    const progress = max > 0 ? y / max : 0;
    for (const l of listeners) l(progress, y);
  };

  let lenis: Lenis | null = null;

  if (prefersReducedMotion()) {
    window.addEventListener("scroll", emit, { passive: true });
    window.addEventListener("resize", emit);
    requestAnimationFrame(emit);
  } else {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // ease-out-quart
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenis.on("scroll", emit);
    const raf = (time: number): void => {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // In-page anchor links routed through Lenis
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis?.scrollTo(target as HTMLElement, { offset: 0 });
      });
    });
  }

  return {
    lenis,
    onScroll: (cb) => listeners.push(cb),
  };
}
