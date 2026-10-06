# TExP launch film — BRIEF

## Business
TExP is a free, browser-based playground for GSAP text animation. You type text, pick a preset or tune
tween/ease/split settings, watch it live on a canvas, sequence several animations on a timeline, and
export the code.

## Buyer
Frontend developers and designers who want polished text motion on their sites without hand-tuning
GSAP tweens, staggers and split-text DOM.

## Viewer's problem
Good text motion means lots of trial and error: hand-written tweens, split-text markup, magic numbers
for stagger and easing, then rewiring it all per framework.

## The single action (CTA)
Open TExP and start animating (repo: github.com/ahmrafi22/TExP).

## Provably true (verified in code, 2026-10-05)
| Claim | Source |
|---|---|
| 27 animation presets (Bounce In, Elastic Pop, 3D Flip, Glitch, Wave, Typewriter, Matrix, Cinematic, Spiral In, Curtain...) | `lib/presets.ts` |
| Categories: entrance, emphasis, 3D, text, creative | `types/animation.ts` |
| Split text by chars / words / lines; stagger from start, center, end, random, edges | `SplitTextConfig` |
| Tween types from / to / fromTo; x, y, scale, rotation, rotationX/Y, skew, opacity, blur/brightness/contrast/saturate filters; repeat, yoyo | `AnimationConfig` |
| Custom easing curves + spring (DialKit) | `CustomEaseSpec` |
| 71 Google Fonts | `lib/fonts.ts` |
| Backgrounds: solid, linear/radial gradient, image | `BackgroundConfig` |
| Code export: Vanilla / React / Vue × JS / TS; "Animation Only" and "Complete Component" | `components/code-generator.tsx` |
| Two modes: Text Animation and Timeline Animation (tracks, sequence presets, inspector, export) | `mode-switcher.tsx`, `timeline-creator.tsx` |
| Undo / redo history, layers panel | `history-panel.tsx`, `layers-panel.tsx` |
| Built on GSAP | `package.json` |

## Never claim
- Ratings, user counts, testimonials, "used by" logos, speed numbers ("10x faster").
- "MIT licensed" / "open source" as a headline: README says MIT but there is no LICENSE file in the repo.
- "Free forever", pricing, accounts. The repo is public and the app needs no sign-up, but say only what the UI shows.
- Version numbers on screen.

## Real assets
- Live app (dev server) → real screenshots for reference.
- Real preset configs from `lib/presets.ts` drive the film's own type animation, so the motion on
  screen IS the product's output.
- Real generated code from `utils/code-generator.ts`.
- Logo: `components/texp-logo.tsx` (always black or white).

## Format
- 1920×1080, 60 fps master, ~26 s. Sound-off readable. Music + sparse SFX mix, music-only fallback.

## Brand ("Obsidian Instrument", `app/globals.css`)
- Surfaces (dark): bg oklch(0.148 0.006 260), card 0.185, popover 0.215, border 0.29.
- Foreground oklch(0.95 0.004 140). Muted fg oklch(0.70 0.010 260).
- ONE accent: acid lime oklch(0.87 0.20 128) — only for live / selected / focused / playhead.
- Type: Archivo (voice), JetBrains Mono (instrument readouts).
- Logo: black/white only, never lime.
- Brightness note: brand is dark by design. Keep it from going near-black: lit surfaces, lime light,
  high-contrast type.

## Done means
Passes `references/quality-bar.md`: frozen time ≤ ~1 s, no hold > 0.6 s except CTA, frame 0 finished,
no text collisions, lead subject 60–85 %, CTA readable ≥ 1.5 s, a muted viewer can say what TExP does.
