import "./styles/index.css";

import { initSmooth } from "./lib/smooth";
import { initField } from "./lib/field";
import { initCursor } from "./lib/cursor";
import { initHud } from "./lib/hud";
import { initHero } from "./sections/hero";
import { initReveals } from "./sections/reveals";
import { initSystems } from "./sections/systems";
import { initContact } from "./sections/contact";

/**
 * Orchestrator. Each subsystem is independent and defensively guarded, so a
 * failure in one (e.g. no WebGL) never takes down the rest. The <html> starts
 * with a `.no-js` fallback that CSS uses to keep content visible; we drop it
 * once the runtime is live.
 */
function boot(): void {
  document.documentElement.classList.remove("no-js");

  const scroller = initSmooth();
  initHud(scroller);
  initField(scroller);
  initCursor();

  initHero();
  initReveals();
  initSystems();
  initContact();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
