# Sean Tan — The Instrument

A personal site built as a living instrument: a dark-native, multi-section
interactive experience where each section introduces its own interaction
paradigm, unified by one signal-green light language, a persistent HUD frame,
and layered, structural motion.

**Stack:** [Vite](https://vitejs.dev) · TypeScript · raw WebGL (GLSL) ·
[GSAP](https://gsap.com) + ScrollTrigger · [Lenis](https://lenis.darkroom.engineering)
· self-hosted [Fontsource](https://fontsource.org) fonts (Archivo · Martian Mono).
No UI framework, no runtime CSS-in-JS — just fast, hand-written code.

---

## Prerequisites

- **Node.js 18+** (developed on Node 20 / 24; CI builds on Node 20)
- **npm** (ships with Node)

Check with `node -v`.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot reload) → http://localhost:5173
npm run dev
```

That's it. Open the printed URL and the site is running locally.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot module reload. |
| `npm run build` | Type-check (`tsc`) then build the production bundle into `dist/`. |
| `npm run preview` | Serve the built `dist/` locally to sanity-check the production build. |

A typical loop: `npm run dev` while working; `npm run build && npm run preview`
before deploying to catch anything the dev server hides.

## Project structure

```
index.html              # Semantic markup — all sections, HUD, canvas
src/
  main.ts               # Orchestrator: boots each subsystem, respects reduced-motion
  styles/
    index.css           # Imports the cascade below
    tokens.css          # OKLCH design tokens — the source of truth for color/type/motion
    base.css            # Reset, canvas, atmosphere (field mask, grain, skip link)
    hud.css             # Persistent instrument frame + custom cursor
    sections.css        # Per-section layout and states
  lib/
    field.ts            # Ambient WebGL signal field (raw GLSL fragment shader)
    smooth.ts           # Lenis smooth scroll (+ reduced-motion native fallback)
    cursor.ts           # Custom trailing cursor (fine-pointer only)
    hud.ts              # Live clock, coordinates, scroll progress, section readout
    utils.ts / exports.ts
  sections/
    hero.ts             # 01 · Index — page-load choreography + pointer parallax
    reveals.ts          # 02 · Approach — line-by-line scroll reveals
    systems.ts          # 03 · Systems — accessible disclosure list + magnetic drift
    contact.ts          # 04 · Contact — scramble reveal + magnetic links
```

Design intent lives in three root docs, read them before making changes:
- **[`PRODUCT.md`](./PRODUCT.md)** — strategic brief (who/what/why, anti-references).
- **[`DESIGN.md`](./DESIGN.md)** — the visual system (palette, type, motion, components).
- **[`CLAUDE.md`](./CLAUDE.md)** — conventions and the production bar.

## Accessibility & motion

Motion is central but never mandatory. Every animation has a first-class
`prefers-reduced-motion` fallback (instant states / static field), content is
visible by default (reveals enhance, never gate), and color contrast is verified
to **WCAG AA** against the shipped dark theme. Keyboard paths and
`:focus-visible` are wired throughout.

---

## Deploying to GitHub Pages

This repo ships a GitHub Actions workflow
([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)) that builds
and deploys to GitHub Pages on every push to `main` / `master` — no `gh-pages`
branch to manage by hand. Vite's `base` is set to `./` (relative), so the build
works from a project subpath (`https://<user>.github.io/<repo>/`) without
hardcoding the repo name.

### One-time setup

1. **Create the repo and push** (there's no remote yet):

   ```bash
   git add -A
   git commit -m "Initial commit"
   # create a GitHub repo named e.g. "me", then:
   git remote add origin https://github.com/<user>/me.git
   git push -u origin master
   ```

2. **Enable Pages from Actions:** on GitHub, go to
   **Settings → Pages → Build and deployment → Source** and select
   **GitHub Actions**.

3. **Push** (or re-run the workflow from the **Actions** tab). The workflow
   builds `dist/` and publishes it. When it finishes, the live URL appears in
   the workflow run and under Settings → Pages — typically
   `https://<user>.github.io/<repo>/`.

That's the whole loop: after setup, every push to the default branch
redeploys automatically.

### Notes

- **User/org site** (repo named `<user>.github.io`): the relative `base` still
  works; the site serves from the domain root.
- **Custom domain:** add it under Settings → Pages; no config change needed
  thanks to the relative `base`.
- **Deploy manually anytime:** Actions tab → *Deploy to GitHub Pages* →
  *Run workflow*.
