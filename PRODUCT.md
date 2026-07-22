# Product

## Register

brand

## Users

Primarily the maker themselves — this is a personal site that doubles as a
creative playground and technical proving ground, not an audience-optimized
funnel. There is no acquisition goal and no conversion to protect. The implicit
secondary audience is anyone who happens to land on it (peers, other builders,
the occasional curious visitor), but decisions are made for craft and
experimentation first, not for a target segment.

The job to be done: give the maker a canvas to push frontend craft — layered
composition, ambitious motion, futuristic aesthetics — with no client, brand
guideline, or stakeholder to answer to. The site is both the artifact and the
lab.

## Product Purpose

A personal site / portfolio that is unapologetically a demonstration of
frontend capability. It exists to be the place where technique gets tried:
depth, layering, and complex-but-controlled motion, executed to a production
standard rather than left as prototypes. Success is not traffic or leads — it's
that the execution is genuinely impressive on close inspection, holds up as
real working code, and stays a space the maker wants to keep extending.

## Brand Personality

Futuristic, precise, engineered. Three words: **futuristic, precise,
composed.** The voice is confident and technical without being cold — it earns
its ambition through control, not volume. Motion and depth are the primary
expressive tools, but they read as *designed systems* rather than effects. The
emotional target on a visitor: quiet awe at the craft, a sense that every layer
and transition was deliberate. Never busy, never trying too hard.

## Anti-references

- **Generic SaaS / startup**: rounded-card grids, purple gradients,
  hero-metric templates, the AI-slop landing look.
- **Cream / warm minimal-lifestyle**: sand/beige backgrounds, serif headers,
  the "magazine-warm" editorial-restraint cliché.
- **Corporate / stock-photo**: big stock imagery, buzzwords, safe
  blue-and-white enterprise look.
- **Over-animated / flashy**: scroll-jacking, bouncy/elastic easing, motion for
  its own sake. Ambition here is *complexity and layering executed with
  control*, not spectacle. If a motion doesn't reveal structure or reward
  attention, it's cut.

## Design Principles

1. **Craft is the message.** With no audience to convert, the quality of the
   execution is the entire point. Everything ships at production grade —
   beautiful, responsive, fast, bug-free — or it doesn't ship.
2. **Motion with intent.** Complex, layered animation is welcome, but every
   movement must reveal structure, establish depth, or reward attention. No
   decorative flash, no bounce, no scroll-jacking.
3. **Compose in depth.** Think in planes and layers, not flat sections. The
   interface should feel dimensional and engineered — parallax, stacking,
   z-depth used deliberately — while staying legible and performant.
4. **Restraint under ambition.** Futuristic and bold, but disciplined.
   Precision beats spectacle; a few extraordinary moments beat constant
   stimulation.
5. **It's a living lab.** Treat the site as a space to keep experimenting.
   Favor systems and reusable pieces over one-offs so new ideas compound
   instead of accreting.

## Accessibility & Inclusion

Target WCAG 2.1 AA: body text ≥4.5:1, large text ≥3:1, verified in the theme
actually shipped. The design leans dark/futuristic, but contrast is
non-negotiable regardless of theme choice. Because motion is central,
`prefers-reduced-motion` support is mandatory and first-class — every complex
animation needs a meaningful reduced-motion alternative (crossfade or instant
state), never a broken or blank fallback. Content must never be gated behind a
motion trigger. Respect keyboard navigation and focus visibility throughout.
