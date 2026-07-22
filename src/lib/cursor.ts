import { isFinePointer, lerp, prefersReducedMotion } from "./utils";

/**
 * Custom cursor with trailing ring + contextual label.
 * Enhancement only: enabled on fine pointers, degrades to the native cursor
 * otherwise. The ring eases toward the pointer; the dot tracks it exactly.
 */
export function initCursor(): void {
  const el = document.querySelector<HTMLElement>(".cursor");
  if (!el || !isFinePointer()) return;

  const ring = el.querySelector<HTMLElement>(".cursor__ring")!;
  const dot = el.querySelector<HTMLElement>(".cursor__dot")!;
  const labelEl = el.querySelector<HTMLElement>("[data-cursor-label]")!;

  document.body.style.cursor = "none";
  el.classList.add("cursor--on");

  const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { ...target };
  const reduced = prefersReducedMotion();

  window.addEventListener(
    "pointermove",
    (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    },
    { passive: true },
  );

  const render = (): void => {
    const t = reduced ? 1 : 0.18;
    ringPos.x = lerp(ringPos.x, target.x, t);
    ringPos.y = lerp(ringPos.y, target.y, t);
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  // Interactive-affordance detection via event delegation
  const interactive = 'a, button, [data-cursor], [role="button"]';
  const setLabel = (text: string): void => {
    labelEl.textContent = text;
    el.classList.toggle("cursor--labelled", text.length > 0);
  };

  document.addEventListener("pointerover", (e) => {
    const hit = (e.target as Element).closest<HTMLElement>(interactive);
    if (!hit) return;
    el.classList.add("cursor--hover");
    setLabel(hit.dataset.cursor ?? "");
  });
  document.addEventListener("pointerout", (e) => {
    const hit = (e.target as Element).closest<HTMLElement>(interactive);
    if (!hit) return;
    const to = (e.relatedTarget as Element | null)?.closest(interactive);
    if (to) return;
    el.classList.remove("cursor--hover");
    setLabel("");
  });

  document.addEventListener("pointerdown", () => ring.style.setProperty("scale", "0.82"));
  document.addEventListener("pointerup", () => ring.style.removeProperty("scale"));
}
