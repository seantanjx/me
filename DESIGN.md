---
name: Sean Tan — The Instrument
description: A dark-native personal site built as a living instrument — luminous signal-green light on a deep field, precise HUD chrome, layered motion.
colors:
  signal: "oklch(0.82 0.17 142)"
  signal-bright: "oklch(0.90 0.19 140)"
  signal-deep: "oklch(0.62 0.15 145)"
  bone: "oklch(0.92 0.035 92)"
  bg: "oklch(0.09 0 0)"
  bg-deep: "oklch(0.055 0 0)"
  surface: "oklch(0.13 0.006 150)"
  surface-2: "oklch(0.17 0.008 150)"
  ink: "oklch(0.95 0.008 150)"
  ink-dim: "oklch(0.82 0.01 150)"
  muted: "oklch(0.64 0.015 150)"
  faint: "oklch(0.58 0.012 150)"
  line: "oklch(0.28 0.01 150 / 0.7)"
  line-soft: "oklch(0.28 0.01 150 / 0.32)"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(3.4rem, 0.9rem + 12vw, 9.5rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.6rem + 3vw, 4rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.05rem + 0.75vw, 1.6rem)"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(0.95rem, 0.9rem + 0.25vw, 1.075rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Martian Mono Variable, Martian Mono, ui-monospace, monospace"
    fontSize: "clamp(0.72rem, 0.68rem + 0.2vw, 0.8rem)"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
rounded:
  sm: "3px"
  pill: "50%"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  block: "clamp(5rem, 12vh, 11rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.sm}"
    padding: "0.6rem 1rem"
  tag-label:
    textColor: "{colors.signal}"
    typography: "{typography.label}"
  link-row:
    textColor: "{colors.ink-dim}"
    padding: "1.25rem 0"
  link-row-hover:
    textColor: "{colors.ink}"
    padding: "1.25rem 0 1.25rem 0.8rem"
  disclosure-row:
    textColor: "{colors.muted}"
    padding: "1.9rem 0"
---

# Design System: Sean Tan — The Instrument

## 1. Overview

**Creative North Star: "The Instrument"**

This is a personal site conceived as a living instrument — not a page you read,
a panel you operate. A luminous signal-green reads like transmission light
against a deep, near-black field; a persistent HUD frame (hairline corner
brackets, a live UTC clock, pointer coordinates, a section readout, a
scroll-progress rail) wraps every screen so the whole experience is seen through
one lens. Depth is the organizing idea: layered translucent planes, a receding
WebGL signal field, and cursor-aware parallax give the interface z-axis without
ever fighting the content. Motion is structural — one orchestrated page-load,
line-by-line reveals, magnetic focus-pulls — never decorative flash.

The system is dark by nature, not by fashion. The mood is an aerospace / signals
console at night: cold precision, a single warm-cool tension between the green
signal and a bone highlight, quiet until you touch it. It is unapologetically a
demonstration of craft — the execution *is* the message — so restraint and
polish outrank spectacle at every turn.

It explicitly rejects the generic SaaS look (rounded-card grids, purple
gradients, hero-metric templates), the warm cream / lifestyle-minimal aesthetic,
corporate stock-photo blandness, and over-animated scroll-jacking. Ambition here
means *complexity and layering executed with control*, not more movement.

**Key Characteristics:**
- Dark-native field (near-black, chroma 0) with one committed signal-green voice
- A persistent HUD/instrument frame as the cohesion device across all sections
- Depth through layering: WebGL field + translucent planes + pointer parallax
- Structural motion with a first-class `prefers-reduced-motion` fallback
- Sans display (Archivo) paired with a mono instrument voice (Martian Mono)
- OKLCH throughout; contrast verified to WCAG AA against the shipped dark theme

## 2. Colors

A monochrome-dark field carrying a single luminous green voice, with a bone
highlight held in reserve as the one warm note.

### Primary
- **Lichen Glow** (`oklch(0.82 0.17 142)`): The signal color. Transmission
  light — used for the HUD live-dot and readouts, section tags, the emphasized
  words in prose, link labels and arrows, the disclosure `+` marks, and the one
  filled CTA (the skip link). It glows against the dark; it is never a large
  fill behind body text.
- **Lichen Glow Bright** (`oklch(0.90 0.19 140)`): A hotter step for the tightest
  highlights and the core of the WebGL field's cursor glow.
- **Lichen Glow Deep** (`oklch(0.62 0.15 145)`): The recessed step — gradient
  tails on the progress rail, the scrollbar thumb, deep field structure.

### Secondary
- **Bone** (`oklch(0.92 0.035 92)`): The single warm highlight, held in reserve
  as counter-tension to the cold green. A rare accent, never a surface.

### Neutral
- **Field** (`oklch(0.09 0 0)`): The body background. Near-black at chroma 0 —
  no hidden warmth. The canvas the signal glows on.
- **Field Deep** (`oklch(0.055 0 0)`): The darkest step; text color on filled
  signal elements, deepest vignette.
- **Surface / Surface-2** (`oklch(0.13 0.006 150)` / `oklch(0.17 0.008 150)`):
  Barely-tinted panels for any raised material. Same hue family as the field.
- **Ink** (`oklch(0.95 0.008 150)`): Primary text — headings, the hero name,
  lit prose. 17.9:1 on Field.
- **Ink Dim** (`oklch(0.82 0.01 150)`): Secondary prose (ledes, link values).
  11.9:1 on Field.
- **Muted** (`oklch(0.64 0.015 150)`): Tertiary text — resting disclosure
  titles, HUD section label. 6.2:1 on Field.
- **Faint** (`oklch(0.58 0.012 150)`): Instrument-dim metadata — footer, HUD
  coordinates, capability meta tags. The floor: 4.86:1 on Field, still AA.
- **Line / Line-soft** (`oklch(0.28 0.01 150 / 0.7)` / `/ 0.32`): Hairline
  borders, dividers, HUD corner brackets.

### Named Rules
**The Signal-Is-Light Rule.** Lichen Glow is treated as emitted light, not
paint: glow, hairline, small mark, single word, one filled control. It never
becomes a large fill behind text. Its rarity is what makes it read as signal.

**The Chroma-Zero Field Rule.** The background is pure neutral (chroma 0). Warmth
lives only in the Bone accent and the green's own hue — never tinted into the
surface. A warm-tinted dark bg would make this the AI-default dark theme.

## 3. Typography

**Display / Body Font:** Archivo Variable (with Archivo, system-ui fallback)
**Label / Mono Font:** Martian Mono Variable (with ui-monospace fallback)

**Character:** A precise, slightly mechanical grotesque (Archivo) carries every
heading and all body copy; a distinctive mono (Martian Mono) is reserved for
instrumentation — HUD readouts, section tags, meta, coordinates. The pairing is
a true contrast axis (grotesque vs. mono), so the mono reads as *instrument
labeling*, never as page body.

### Hierarchy
- **Display** (800, `clamp(3.4rem … 9.5rem)`, lh 0.86, ls -0.04em): The hero
  name only. Set in solid Ink; emphasis is size and weight, never gradient.
- **Headline** (700–800, `clamp(2.2rem … 4rem)`, lh 1): Section titles and the
  contact statement. The contact keyword sits in Lichen Glow.
- **Title** (500–650, `clamp(1.2rem … 2.6rem)`): Disclosure names, link values,
  the hero lede.
- **Body** (400, `clamp(0.95rem … 1.075rem)`, lh 1.5): Prose. Measure capped
  at ~44–56ch for reveal lines and disclosure copy.
- **Label** (500, `clamp(0.72rem … 0.8rem)`, ls 0.18em, UPPERCASE): Martian
  Mono. Section tags, HUD chrome, eyebrows, meta.

### Named Rules
**The Mono-Is-Instrumentation Rule.** Martian Mono appears only where the UI is
acting as an instrument — readouts, coordinates, tags, labels. It is forbidden
for body copy or headings; mono-as-costume would turn precision into pastiche.

**The Solid-Display Rule.** Display and headline text is a single solid color.
Gradient-clipped text is prohibited, even a subtle tonal one — hierarchy comes
from size, weight, and the field glow behind, not from painted letters.

## 4. Elevation

Flat by default; there are no drop shadows anywhere. Depth is conveyed
*optically*, not with box-shadows: an ambient WebGL signal field with a receding
horizon and a soft cursor glow, translucent HUD chrome layered over content, and
pointer/scroll parallax that moves layers at different rates. "Elevation" here is
z-position in a rendered scene, not a Material shadow ramp. Light — the green
glow and the field's luminance — is the only elevation material.

### Named Rules
**The No-Shadow Rule.** Box-shadows are prohibited. If an element needs to feel
lifted, it moves in z (parallax), catches the field's glow, or gains a hairline
— it never drops a shadow. A shadow would import a light-mode, document-paper
mental model this dark instrument doesn't have.

## 5. Components

Component philosophy: **precise and instrument-like.** Hairline borders, mono
labels, coordinate readouts; quiet at rest, resolving toward light and Ink on
interaction. Every interactive element has a real `:focus-visible` path and a
`prefers-reduced-motion` fallback.

### Buttons
- **Shape:** Near-square (3px radius). Rounded corners are almost absent by
  design — this is instrument chrome, not app UI.
- **Primary (the skip link / filled CTA):** Lichen Glow fill, Field-Deep text,
  mono label, `0.6rem 1rem` padding. The only place green is a fill.
- **Hover / Focus:** 2px Lichen Glow focus ring at 3px offset, system-wide.
  Motion uses the shared ease-out curves; no bounce, no elastic.

### Links (Contact rows)
- **Style:** Full-width rows on a hairline grid — mono Lichen Glow label, Ink-Dim
  value, Lichen Glow arrow. No underlines.
- **Hover / Focus:** Value brightens to Ink, the row insets ~0.8rem, the arrow
  translates. On fine pointers the row is also magnetic (drifts toward cursor).

### Disclosure list (Systems)
- **Style:** An accessible `aria-expanded` accordion on hairline dividers. Row =
  mono index (`/01`), Muted title, mono meta, a `+` toggle in Lichen Glow.
- **State:** One open at a time; the body expands via `grid-template-rows: 0fr →
  1fr`. Open/hover/focus brightens the title Muted → Ink. On fine pointers the
  title drifts magnetically toward the cursor.

### HUD (signature component)
- The persistent instrument frame: hairline corner brackets, brand mark with a
  Lichen Glow glyph, a pulsing live-dot + live UTC clock, a section readout
  (`02 / 04 APPROACH`) driven by a viewport-center IntersectionObserver, pointer
  coordinates, and a centered scroll-progress rail. Fixed, `pointer-events:
  none`, mono throughout. Coordinates and progress rail hide below 640px.

### Custom cursor (signature component)
- A trailing ring (eased) + exact-tracking dot + contextual mono label. Fine
  pointers only; hidden for touch and reduced-motion, where the native cursor
  returns. Enhancement, never required for function.

### Ambient signal field (signature component)
- A full-screen raw-WebGL/GLSL fragment shader: layered flow noise, receding
  depth lines, and a cursor-reactive glow, tinted Lichen Glow, masked by a radial
  vignette so the center stays legible. Restrained by mandate — atmosphere, not
  screensaver. Reduced-motion draws one static frame; no-WebGL degrades to the
  CSS field + grain.

## 6. Do's and Don'ts

### Do:
- **Do** keep the field pure neutral (chroma 0) and let Lichen Glow and the Bone
  accent carry all warmth/coolness.
- **Do** treat Lichen Glow as light — small marks, hairlines, single words, one
  filled control. Keep it off large text backgrounds.
- **Do** verify contrast against the shipped dark theme: body ≥4.5:1, large
  ≥3:1. Faint (`0.58`) is the dim floor at 4.86:1 — never dim metadata further.
- **Do** give every animation a first-class `prefers-reduced-motion` path, and
  keep content visible by default (reveals enhance, never gate).
- **Do** reserve Martian Mono for instrumentation — readouts, tags, labels.
- **Do** convey depth with layering, parallax, and glow.

### Don't:
- **Don't** use gradient-clipped text, even a subtle tonal one — display type is
  a single solid color; emphasis comes from size and weight.
- **Don't** add box-shadows or glassmorphism-by-default — depth is optical
  (field, parallax, glow), not paper-drop-shadow.
- **Don't** tint the background warm or cool "because the brand feels that way" —
  that produces the AI-default dark theme.
- **Don't** drift into the **generic SaaS / startup** look: rounded-card grids,
  purple gradients, the hero-metric template.
- **Don't** go **cream / warm minimal-lifestyle** (sand backgrounds, serif
  headers) or **corporate / stock-photo** blandness.
- **Don't** over-animate: no scroll-jacking, no bounce/elastic easing, no motion
  for its own sake. If a movement doesn't reveal structure or reward attention,
  cut it.
- **Don't** use Martian Mono for body copy or headings — mono-as-costume.
- **Don't** put numbered eyebrows on every section; the numeric readouts here are
  a deliberate HUD instrument system, not decorative kickers.
