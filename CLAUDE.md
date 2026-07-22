# CLAUDE.md — Operating Manual for This Repo

This is **Sean Tan's personal site** — a "living lab" personal portfolio built as
an award-winning-grade interactive experience. It is a **design-led** project:
craft, motion, and visual precision are the product, not an afterthought.

---

## 0. Required reading — before any work, every session

Do this **first**, in order, before writing or editing a single line:

1. **[`PRODUCT.md`](./PRODUCT.md)** — strategic brief: register (`brand`), users,
   purpose, brand personality, anti-references, design principles, a11y bar.
   Non-negotiable context for every design/code decision.
2. **[`DESIGN.md`](./DESIGN.md)** — the visual system (palette, type, motion,
   components). _Create it via `/impeccable document` if it does not exist yet._
3. **The `impeccable` skill** — this project was scaffolded with it. For any UI
   design/redesign/critique/polish task, invoke `/impeccable <command>` rather
   than free-handing. It re-loads PRODUCT.md/DESIGN.md and the brand register
   reference automatically.

If you skip step 0, you will produce off-brand work. The anti-references in
`PRODUCT.md` (generic SaaS, cream/lifestyle, corporate stock, over-animated
flash) are hard boundaries.

---

## 1. Roles — orchestrator vs. executors

This repo runs a **two-tier model**:

### Main agent (Opus 4.8) = **Orchestrator**
The main session is the **planner, reviewer, and integrator** — not the primary
typist. Its job:

- Read the required context (§0) and hold the design intent.
- Decompose work into well-scoped, self-contained coding tasks.
- **Spawn Sonnet subagents to execute** each coding task (see §2).
- Review returned diffs against `PRODUCT.md`, `DESIGN.md`, and the impeccable
  production bar. Run the build, inspect the result, and iterate.
- Own the user conversation, the design gates, and final quality sign-off.

Keep the orchestrator's own hands-on editing minimal: reserve it for planning,
wiring subagent output together, quick fixes, and review. Substantial feature
implementation should be delegated.

### Subagents (Sonnet) = **Executors**
Executors are **pinned to `claude-sonnet-5`** (the latest Sonnet) via the custom
agent definition in [`.claude/agents/executor.md`](./.claude/agents/executor.md).
Spawn them by name so the pinned model is used:

```
Agent(
  subagent_type: "executor",   // pinned to claude-sonnet-5
  description: "<3-5 word task>",
  prompt: "<self-contained task: see §2 checklist>"
)
```

> The `Agent` tool's inline `model` field only accepts aliases
> (`sonnet`/`opus`/`haiku`/`fable`), so exact-ID pinning lives in the agent
> definition's frontmatter (`model: claude-sonnet-5`). To repoint executors at a
> different Sonnet build, edit that one file.

Executors do the bulk of the coding: implement a section, wire an interaction,
build a component, fix a bug, add a shader, etc.

---

## 2. How the orchestrator briefs an executor

Every executor prompt must be **self-contained** — a fresh Sonnet subagent has
none of this conversation's context. Include:

1. **Required reading pointer:** "Read `PRODUCT.md`, `DESIGN.md`, and the
   existing code in `src/` before starting."
2. **The exact task** and its acceptance criteria.
3. **The relevant files** to touch and the conventions to follow (see §3).
4. **The design constraints** that apply: dark-native, OKLCH tokens only, the
   signal-green light language, `prefers-reduced-motion` is mandatory and
   first-class, WCAG AA contrast, no dead links / no fake content.
5. **"Run `npm run build` and confirm it passes; report the diff."**

Prefer **a few larger, coherent tasks** over many tiny ones (each subagent
starts cold and re-derives context — that is the expensive path). Only spawn
when the user asks for orchestration or the task is genuinely a chunk of
implementation; trivial edits the orchestrator can do inline.

Do **not** fabricate or predict a pending subagent's results — wait for the
completion notification.

---

## 3. Project conventions

- **Stack:** Vite + TypeScript. `npm run dev` (server), `npm run build` (tsc +
  vite build — must pass with zero errors, `noUnusedLocals`/`noUnusedParameters`
  are on).
- **Structure:**
  - `index.html` — semantic markup, all sections, HUD, canvas.
  - `src/styles/` — `tokens.css` (OKLCH design tokens — the source of truth),
    `base.css`, `hud.css`, `sections.css`. Imported via `src/styles/index.css`.
  - `src/lib/` — shared runtime: `field.ts` (WebGL signal field), `cursor.ts`,
    `hud.ts`, `smooth.ts` (Lenis), `utils.ts`.
  - `src/sections/` — one module per section, each owning its interaction.
  - `src/main.ts` — orchestrates module init, respects reduced-motion.
- **Tokens only.** Never hardcode a color — use the `--*` custom properties in
  `tokens.css`. All color is OKLCH. New color needs a new token.
- **Motion vocabulary** is shared: use the `--ease-*` and `--dur-*` tokens. No
  bounce/elastic. Every animation needs a reduced-motion path.
- **Accessibility:** semantic HTML, keyboard paths, focus-visible, ARIA on
  interactive widgets, alt text, contrast verified against the shipped theme.
- **No new dependencies** without a clear reason; prefer the existing
  GSAP / Lenis / raw-WebGL toolkit.

---

## 4. Definition of done (the impeccable bar)

Real content (no lorem, no fake metrics, no dead links) · deliberate spacing &
hierarchy · every interactive state covered (hover/focus/active/reduced-motion/
mobile) · responsive (composes, not shrinks) · `npm run build` green · no
console errors · no layout shift · motion smooth and purposeful · WCAG AA.

Ship production-grade or don't ship. Detector/QA output is evidence, never proof
of done — inspect the real result in a browser.
