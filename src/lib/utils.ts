/** Shared helpers. */

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = (): boolean =>
  window.matchMedia("(pointer: fine)").matches;

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Map v from [inMin,inMax] to [outMin,outMax], clamped. */
export const mapClamp = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
};

export const $ = <T extends Element = HTMLElement>(
  sel: string,
  root: ParentNode = document,
): T | null => root.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(
  sel: string,
  root: ParentNode = document,
): T[] => Array.from(root.querySelectorAll<T>(sel));
