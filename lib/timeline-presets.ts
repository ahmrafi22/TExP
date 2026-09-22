// Timeline sequence presets — composed, multi-layer starting points for the
// Timeline Creator.
//
// A preset is a *composition*, not a single tween: buildPresetProject() expands
// it into a complete TimelineProject (items + labels) so applying one is a
// single loadProject() call. Recipes are authored in the same
// AnimationConfig / SplitTextConfig shapes the item editor writes and are merged
// over the playground defaults here, so this file stays terse and can never
// drift from the engine's defaults.
//
// Authoring notes (matching how the sequencer consumes items):
//  - The sequencer owns timing: per-item `animation.delay` is stripped, so
//    staging is expressed with `position` (start / afterPrevious / withPrevious /
//    atTime / label) plus `duration`.
//  - `tweenType: "from"` means the listed values are the START state and the
//    item settles into its natural (visible) state.
//  - `customStyles.overflowHidden` clips the item's own box, which is what makes
//    masked line reveals read as true wipes instead of slides.
//  - Colors use design tokens (`var(--primary)`, `var(--chart-2)`, …) so presets
//    follow the active theme instead of hardcoding palette values.

import type {
  TimelineItem,
  TimelineLabel,
  TimelinePreset,
  TimelinePresetCategory,
  TimelineProject,
} from "@/types/timeline"
import type { AnimationConfig, SplitTextConfig } from "@/types/animation"
import { defaultAnimationConfig, defaultSplitTextConfig } from "@/store/use-playground-store"

export const TIMELINE_PRESET_CATEGORY_LABELS: Record<TimelinePresetCategory, string> = {
  title: "Title",
  editorial: "Editorial",
  kinetic: "Kinetic",
  broadcast: "Broadcast",
  social: "Social",
  "3d": "3D",
}

export const TIMELINE_PRESET_CATEGORY_ORDER: TimelinePresetCategory[] = [
  "title",
  "editorial",
  "kinetic",
  "broadcast",
  "social",
  "3d",
]

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

type PresetAnimationPatch = TimelinePreset["items"][number]["animation"]

/** Merge a partial recipe over the app defaults. `customStyles` merges deeply. */
function anim(patch: PresetAnimationPatch): AnimationConfig {
  const { customStyles, ...rest } = patch
  const base = clone(defaultAnimationConfig)
  Object.assign(base, rest)
  if (customStyles) base.customStyles = { ...base.customStyles, ...customStyles }
  return base
}

function split(patch?: Partial<SplitTextConfig>): SplitTextConfig {
  return { ...clone(defaultSplitTextConfig), ...(patch ?? {}) }
}

export const TIMELINE_PRESETS: TimelinePreset[] = [
  // ── Title ───────────────────────────────────────────────────────────────────
  {
    id: "cinematic-title",
    name: "Cinematic Title",
    description: "Eyebrow, masked hero word and a soft subtitle, staged like a film card.",
    category: "title",
    labels: [{ name: "title", time: 0.5 }],
    items: [
      {
        label: "Eyebrow",
        text: "Texp studio presents",
        animation: {
          tweenType: "from",
          y: 12,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          customStyles: {
            fontSize: "sm",
            fontWeight: "medium",
            letterSpacing: "widest",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.08, staggerFrom: "start" },
        duration: 0.6,
        position: { type: "start" },
        pos: { xp: 0, yp: -22 },
      },
      {
        label: "Hero",
        text: "Obsidian",
        animation: {
          tweenType: "from",
          // Percent, not px: a fixed offset would leave the 9xl glyph partly
          // visible through the overflowHidden mask at the start of the tween.
          y: "110%",
          rotationX: 40,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          customStyles: {
            fontSize: "7xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
            overflowHidden: true,
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.035, staggerFrom: "center" },
        duration: 1.1,
        position: { type: "afterPrevious", offset: 0.05 },
        pos: { xp: 0, yp: -2 },
      },
      {
        label: "Subtitle",
        text: "A study in motion",
        animation: {
          tweenType: "from",
          y: 18,
          opacity: 0,
          filter: { type: "blur", value: 10 },
          duration: 0.8,
          ease: "power2.out",
          customStyles: { fontSize: "xl", fontWeight: "light", letterSpacing: "wide" },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.07, staggerFrom: "start" },
        duration: 0.8,
        position: { type: "afterPrevious", offset: 0.2 },
        pos: { xp: 0, yp: 18 },
      },
    ],
  },

  // ── Editorial ───────────────────────────────────────────────────────────────
  {
    id: "editorial-stack",
    name: "Editorial Stack",
    description: "Three masked lines rise into place beneath a small index mark.",
    category: "editorial",
    items: [
      {
        label: "Index",
        text: "01 — Feature",
        animation: {
          tweenType: "from",
          x: -14,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          customStyles: {
            fontSize: "xs",
            fontWeight: "medium",
            letterSpacing: "widest",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.02, staggerFrom: "start" },
        duration: 0.5,
        position: { type: "start" },
        pos: { xp: -30, yp: -30 },
      },
      {
        label: "Line 1",
        text: "Designed in silence",
        animation: {
          tweenType: "from",
          // Diagonal masked wipe: the horizontal settle reads against the rise,
          // so each line feels hand-placed rather than conveyor-fed. The 3D
          // hinge (rotationX) tilts the line open as it clears the mask.
          x: -22,
          y: "110%",
          rotationX: 55,
          duration: 0.9,
          ease: "power4.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "semibold",
            lineHeight: "tight",
            overflowHidden: true,
          },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.06, staggerFrom: "start" },
        duration: 0.9,
        position: { type: "afterPrevious", offset: 0.1 },
        pos: { xp: 0, yp: -12 },
      },
      {
        label: "Line 2",
        text: "Built for motion",
        animation: {
          tweenType: "from",
          x: 22,
          y: "110%",
          rotationX: 55,
          duration: 0.9,
          ease: "power4.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "semibold",
            lineHeight: "tight",
            overflowHidden: true,
          },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.06, staggerFrom: "start" },
        duration: 0.9,
        position: { type: "afterPrevious", offset: 0.1 },
        pos: { xp: 0, yp: 4 },
      },
      {
        label: "Line 3",
        text: "Felt in an instant",
        animation: {
          tweenType: "from",
          x: -22,
          y: "110%",
          rotationX: 55,
          duration: 0.9,
          ease: "power4.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "semibold",
            lineHeight: "tight",
            overflowHidden: true,
          },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.06, staggerFrom: "start" },
        duration: 0.9,
        position: { type: "afterPrevious", offset: 0.1 },
        pos: { xp: 0, yp: 20 },
      },
    ],
  },
  {
    id: "pull-quote",
    name: "Pull Quote",
    description: "A slow blurred quote resolving into focus, signed with a mono credit.",
    category: "editorial",
    items: [
      {
        label: "Quote",
        text: "Motion is the message.",
        animation: {
          tweenType: "from",
          y: 16,
          opacity: 0,
          filter: { type: "blur", value: 16 },
          duration: 1.1,
          ease: "power2.out",
          customStyles: { fontSize: "6xl", fontWeight: "light", lineHeight: "snug" },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.08, staggerFrom: "start" },
        duration: 1.1,
        position: { type: "start" },
        pos: { xp: 0, yp: -8 },
      },
      {
        label: "Attribution",
        text: "— Texp design notes",
        animation: {
          tweenType: "from",
          opacity: 0,
          duration: 0.5,
          ease: "none",
          customStyles: {
            fontSize: "sm",
            fontWeight: "medium",
            letterSpacing: "wide",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.015, staggerFrom: "start" },
        duration: 0.5,
        position: { type: "afterPrevious", offset: 0.4 },
        pos: { xp: 0, yp: 24 },
      },
    ],
  },

  // ── Kinetic ─────────────────────────────────────────────────────────────────
  {
    id: "kinetic-cascade",
    name: "Kinetic Cascade",
    description: "Three skewed words crash in from alternating sides and lock together.",
    category: "kinetic",
    items: [
      {
        label: "Word 1",
        text: "Kinetic",
        animation: {
          tweenType: "from",
          x: -70,
          skewX: 45,
          opacity: 0,
          duration: 0.6,
          ease: "expo.out",
          customStyles: {
            fontSize: "6xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.04, staggerFrom: "start" },
        duration: 0.6,
        position: { type: "start" },
        pos: { xp: 0, yp: -14 },
      },
      {
        label: "Word 2",
        text: "Type",
        animation: {
          tweenType: "from",
          x: 85,
          skewX: -45,
          opacity: 0,
          duration: 0.6,
          ease: "expo.out",
          customStyles: {
            fontSize: "6xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.04, staggerFrom: "end" },
        duration: 0.6,
        position: { type: "withPrevious", offset: 0.12 },
        pos: { xp: 0, yp: 2 },
      },
      {
        label: "Word 3",
        text: "System",
        animation: {
          tweenType: "from",
          scale: 1.5,
          opacity: 0,
          filter: { type: "blur", value: 14 },
          duration: 0.8,
          ease: "expo.out",
          customStyles: {
            fontSize: "6xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.03, staggerFrom: "center" },
        duration: 0.8,
        position: { type: "withPrevious", offset: 0.12 },
        pos: { xp: 0, yp: 18 },
      },
    ],
  },
  {
    id: "velocity-whip",
    name: "Velocity Whip",
    description: "A stack of words snapped across the frame with a hard skew whip.",
    category: "kinetic",
    items: [
      {
        label: "Whip 1",
        text: "Fast",
        animation: {
          tweenType: "from",
          // Parallax speed ramp: the top line travels the farthest in the same
          // time and each line clears the mask with a small counter-drift, so
          // the stack reads as one whip with depth instead of a conveyor.
          x: -260,
          y: -12,
          skewX: 45,
          opacity: 0,
          duration: 0.55,
          ease: "expo.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "black",
            letterSpacing: "tight",
            lineHeight: "none",
            textTransform: "uppercase",
            overflowHidden: true,
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.015, staggerFrom: "start" },
        duration: 0.55,
        position: { type: "start" },
        pos: { xp: 0, yp: -16 },
      },
      {
        label: "Whip 2",
        text: "Forward",
        animation: {
          tweenType: "from",
          x: -210,
          skewX: 45,
          opacity: 0,
          duration: 0.55,
          ease: "expo.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "black",
            letterSpacing: "tight",
            lineHeight: "none",
            textTransform: "uppercase",
            overflowHidden: true,
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.015, staggerFrom: "start" },
        duration: 0.55,
        position: { type: "withPrevious", offset: 0.14 },
        pos: { xp: 0, yp: 0 },
      },
      {
        label: "Whip 3",
        text: "Motion",
        animation: {
          tweenType: "from",
          x: -160,
          y: 12,
          skewX: 45,
          opacity: 0,
          duration: 0.55,
          ease: "expo.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "black",
            letterSpacing: "tight",
            lineHeight: "none",
            textTransform: "uppercase",
            overflowHidden: true,
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.015, staggerFrom: "start" },
        duration: 0.55,
        position: { type: "withPrevious", offset: 0.14 },
        pos: { xp: 0, yp: 16 },
      },
    ],
  },
  {
    id: "pendulum-swing",
    name: "Pendulum",
    description: "An elastic swing that settles, with a soft caption drifting in behind it.",
    category: "kinetic",
    items: [
      {
        label: "Swing",
        text: "Swing",
        animation: {
          tweenType: "from",
          y: 30,
          rotation: -22,
          opacity: 0,
          duration: 1.2,
          ease: "elastic.out",
          customStyles: {
            fontSize: "6xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.05, staggerFrom: "center" },
        duration: 1.2,
        position: { type: "start" },
        pos: { xp: 0, yp: -6 },
      },
      {
        label: "Caption",
        text: "grace in motion",
        animation: {
          tweenType: "from",
          rotation: 8,
          opacity: 0,
          filter: { type: "blur", value: 8 },
          duration: 0.8,
          ease: "power2.out",
          customStyles: {
            fontSize: "lg",
            fontWeight: "light",
            letterSpacing: "wide",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.06, staggerFrom: "start" },
        duration: 0.8,
        position: { type: "withPrevious", offset: 0.35 },
        pos: { xp: 0, yp: 18 },
      },
    ],
  },

  // ── Broadcast ───────────────────────────────────────────────────────────────
  {
    id: "broadcast-lower-third",
    name: "Broadcast Lower Third",
    description: "Accent chip, headline and mono ticker building down the lower frame.",
    category: "broadcast",
    items: [
      {
        label: "Chip",
        text: "Live update",
        animation: {
          tweenType: "from",
          x: -18,
          scale: 0.85,
          opacity: 0,
          duration: 0.45,
          ease: "back.out",
          customStyles: {
            fontSize: "sm",
            fontWeight: "bold",
            letterSpacing: "wider",
            textTransform: "uppercase",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          },
        },
        splitTextConfig: { enabled: false },
        duration: 0.45,
        position: { type: "start" },
        pos: { xp: -30, yp: 22 },
      },
      {
        label: "Headline",
        text: "Motion ships today",
        animation: {
          tweenType: "from",
          // Masked rise behind the line box — broadcast lower-thirds wipe on,
          // they don't fade.
          y: "115%",
          duration: 0.6,
          ease: "power3.out",
          customStyles: {
            fontSize: "3xl",
            fontWeight: "semibold",
            letterSpacing: "tight",
            overflowHidden: true,
          },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.05, staggerFrom: "start" },
        duration: 0.6,
        position: { type: "withPrevious", offset: 0.12 },
        pos: { xp: 2, yp: 31 },
      },
      {
        label: "Ticker",
        text: "Texp · Timeline · GSAP · Sequencing ·",
        animation: {
          tweenType: "from",
          opacity: 0,
          duration: 0.5,
          ease: "none",
          customStyles: {
            fontSize: "xs",
            fontWeight: "normal",
            letterSpacing: "wide",
            color: "var(--muted-foreground)",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.02, staggerFrom: "start" },
        duration: 0.5,
        position: { type: "afterPrevious", offset: 0.25 },
        pos: { xp: 0, yp: 41 },
      },
    ],
  },
  {
    id: "terminal-boot",
    name: "Terminal Boot",
    description: "Monospaced boot log typed character by character, with a blinking cursor.",
    category: "broadcast",
    labels: [{ name: "boot", time: 0 }],
    items: [
      {
        label: "Command",
        text: "$ texp init --timeline",
        animation: {
          tweenType: "from",
          opacity: 0,
          duration: 0.04,
          ease: "none",
          customStyles: { fontSize: "base", fontWeight: "normal", fontFamily: "mono" },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.035, staggerFrom: "start" },
        duration: 0.04,
        position: { type: "start" },
        pos: { xp: -6, yp: -20 },
      },
      {
        label: "Compile",
        text: "> compiling sequences",
        animation: {
          tweenType: "from",
          opacity: 0,
          duration: 0.03,
          ease: "none",
          customStyles: {
            fontSize: "base",
            fontWeight: "normal",
            fontFamily: "mono",
            color: "var(--muted-foreground)",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.03, staggerFrom: "start" },
        duration: 0.03,
        position: { type: "afterPrevious", offset: 0.3 },
        pos: { xp: -2, yp: -8 },
      },
      {
        label: "Ready",
        text: "✓ ready in 1.2s",
        animation: {
          tweenType: "from",
          opacity: 0,
          duration: 0.03,
          ease: "none",
          customStyles: {
            fontSize: "base",
            fontWeight: "normal",
            fontFamily: "mono",
            color: "var(--primary)",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.03, staggerFrom: "start" },
        duration: 0.03,
        position: { type: "afterPrevious", offset: 0.35 },
        pos: { xp: -4, yp: 4 },
      },
      {
        label: "Cursor",
        text: "▌",
        animation: {
          tweenType: "from",
          opacity: 0,
          duration: 0.35,
          ease: "none",
          repeat: 6,
          yoyo: true,
          customStyles: {
            fontSize: "base",
            fontWeight: "normal",
            fontFamily: "mono",
            color: "var(--primary)",
          },
        },
        splitTextConfig: { enabled: false },
        duration: 0.35,
        position: { type: "withPrevious", offset: 0 },
        pos: { xp: 26, yp: 4 },
      },
    ],
  },
  {
    id: "glitch-broadcast",
    name: "Glitch Broadcast",
    description: "Chromatic split — two offset colour ghosts under a white signal word.",
    category: "broadcast",
    items: [
      {
        label: "Ghost · Cyan",
        text: "Signal lost",
        animation: {
          tweenType: "from",
          // Wide chromatic separation that snaps shut — the ghosts read as a
          // broadcast channel re-syncing instead of a plain fade-in.
          x: -26,
          rotation: -2,
          filter: { type: "blur", value: 6 },
          opacity: 0,
          duration: 0.5,
          ease: "power4.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
            color: "var(--chart-2)",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.02, staggerFrom: "random" },
        duration: 0.5,
        position: { type: "start" },
        pos: { xp: -0.6, yp: -2 },
      },
      {
        label: "Ghost · Magenta",
        text: "Signal lost",
        animation: {
          tweenType: "from",
          x: 26,
          rotation: 2,
          filter: { type: "blur", value: 6 },
          opacity: 0,
          duration: 0.5,
          ease: "power4.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
            color: "var(--chart-4)",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.02, staggerFrom: "random" },
        duration: 0.5,
        position: { type: "withPrevious", offset: 0 },
        pos: { xp: 0.6, yp: 2 },
      },
      {
        label: "Signal",
        text: "Signal lost",
        animation: {
          tweenType: "from",
          scale: 1.06,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.02, staggerFrom: "random" },
        duration: 0.55,
        position: { type: "withPrevious", offset: 0 },
        pos: { xp: 0, yp: 0 },
      },
      {
        label: "Status",
        text: "// reconnecting",
        animation: {
          tweenType: "from",
          y: 10,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          customStyles: {
            fontSize: "sm",
            fontWeight: "normal",
            fontFamily: "mono",
            letterSpacing: "wide",
            color: "var(--muted-foreground)",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.03, staggerFrom: "start" },
        duration: 0.4,
        position: { type: "afterPrevious", offset: 0.25 },
        pos: { xp: 0, yp: 24 },
      },
    ],
  },

  // ── Social ──────────────────────────────────────────────────────────────────
  {
    id: "punch-in",
    name: "Punch In",
    description: "Oversized punch with a blur kick, topped by a lime kicker.",
    category: "social",
    items: [
      {
        label: "Kicker",
        text: "New drop",
        animation: {
          tweenType: "from",
          y: -10,
          opacity: 0,
          duration: 0.45,
          ease: "power2.out",
          customStyles: {
            fontSize: "sm",
            fontWeight: "bold",
            letterSpacing: "widest",
            textTransform: "uppercase",
            color: "var(--primary)",
          },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.07, staggerFrom: "start" },
        duration: 0.45,
        position: { type: "start" },
        pos: { xp: 0, yp: -24 },
      },
      {
        label: "Punch",
        text: "Move fast",
        animation: {
          tweenType: "from",
          scale: 1.7,
          opacity: 0,
          filter: { type: "blur", value: 18 },
          duration: 0.7,
          ease: "back.out",
          customStyles: {
            fontSize: "6xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.02, staggerFrom: "center" },
        duration: 0.7,
        position: { type: "afterPrevious", offset: 0.08 },
        pos: { xp: 0, yp: 0 },
      },
      {
        label: "Tail",
        text: "no easing back",
        animation: {
          tweenType: "from",
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          customStyles: { fontSize: "lg", fontWeight: "light", letterSpacing: "wide" },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.06, staggerFrom: "start" },
        duration: 0.6,
        position: { type: "afterPrevious", offset: 0.18 },
        pos: { xp: 0, yp: 22 },
      },
    ],
  },
  {
    id: "caption-stack",
    name: "Caption Stack",
    description: "Short-form captions popping in one after another down the frame.",
    category: "social",
    items: [
      {
        label: "Caption 1",
        text: "wait for it…",
        animation: {
          tweenType: "from",
          y: 26,
          scale: 0.92,
          opacity: 0,
          duration: 0.35,
          ease: "back.out",
          customStyles: { fontSize: "3xl", fontWeight: "semibold", lineHeight: "tight" },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.04, staggerFrom: "start" },
        duration: 0.35,
        position: { type: "start" },
        pos: { xp: 0, yp: 6 },
      },
      {
        label: "Caption 2",
        text: "this changes everything",
        animation: {
          tweenType: "from",
          y: 26,
          scale: 0.92,
          opacity: 0,
          duration: 0.35,
          ease: "back.out",
          customStyles: { fontSize: "3xl", fontWeight: "semibold", lineHeight: "tight" },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.04, staggerFrom: "start" },
        duration: 0.35,
        position: { type: "afterPrevious", offset: 0.2 },
        pos: { xp: 0, yp: 20 },
      },
      {
        label: "Caption 3",
        text: "watch it loop",
        animation: {
          tweenType: "from",
          y: 26,
          scale: 0.92,
          opacity: 0,
          duration: 0.35,
          ease: "back.out",
          customStyles: { fontSize: "3xl", fontWeight: "semibold", lineHeight: "tight" },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.04, staggerFrom: "start" },
        duration: 0.35,
        position: { type: "afterPrevious", offset: 0.2 },
        pos: { xp: 0, yp: 34 },
      },
    ],
  },
  {
    id: "bounce-drop",
    name: "Bounce Drop",
    description: "Gravity drop from above with a bounce settle, plus a mono sign-off.",
    category: "social",
    items: [
      {
        label: "Drop",
        text: "Drop it",
        animation: {
          tweenType: "from",
          y: -180,
          rotation: -8,
          scale: 1.12,
          opacity: 0,
          duration: 0.9,
          ease: "bounce.out",
          customStyles: {
            fontSize: "7xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.05, staggerFrom: "edges" },
        duration: 0.9,
        position: { type: "start" },
        pos: { xp: 0, yp: -6 },
      },
      {
        label: "Sign-off",
        text: "// 2026",
        animation: {
          tweenType: "from",
          opacity: 0,
          duration: 0.4,
          ease: "none",
          customStyles: {
            fontSize: "sm",
            fontWeight: "normal",
            fontFamily: "mono",
            letterSpacing: "wide",
            color: "var(--muted-foreground)",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.04, staggerFrom: "start" },
        duration: 0.4,
        position: { type: "afterPrevious", offset: 0.25 },
        pos: { xp: 0, yp: 26 },
      },
    ],
  },

  // ── 3D ──────────────────────────────────────────────────────────────────────
  {
    id: "depth-flip",
    name: "Depth Flip",
    description: "Two lines hinging open on different 3D axes into a stacked lockup.",
    category: "3d",
    items: [
      {
        label: "Flip Y",
        text: "Depth",
        animation: {
          tweenType: "from",
          x: -40,
          rotationY: -90,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          customStyles: {
            fontSize: "6xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.05, staggerFrom: "start" },
        duration: 0.8,
        position: { type: "start" },
        pos: { xp: 0, yp: -12 },
      },
      {
        label: "Flip X",
        text: "Perception",
        animation: {
          tweenType: "from",
          y: 40,
          rotationX: -80,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          customStyles: {
            fontSize: "5xl",
            fontWeight: "semibold",
            letterSpacing: "wider",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.04, staggerFrom: "center" },
        duration: 0.9,
        position: { type: "withPrevious", offset: 0.25 },
        pos: { xp: 0, yp: 14 },
      },
    ],
  },
  {
    id: "orbit-in",
    name: "Orbit In",
    description: "Characters spiral in from depth and unwind into a soft orbit line.",
    category: "3d",
    items: [
      {
        label: "Orbit",
        text: "Orbit",
        animation: {
          tweenType: "from",
          scale: 0,
          rotation: 200,
          rotationX: 60,
          opacity: 0,
          duration: 1,
          ease: "back.out",
          customStyles: {
            fontSize: "6xl",
            fontWeight: "black",
            letterSpacing: "tighter",
            lineHeight: "none",
            textTransform: "uppercase",
          },
        },
        splitTextConfig: { enabled: true, type: "chars", stagger: 0.05, staggerFrom: "center" },
        duration: 1,
        position: { type: "start" },
        pos: { xp: 0, yp: -10 },
      },
      {
        label: "Caption",
        text: "everything revolves",
        animation: {
          tweenType: "from",
          rotation: -12,
          opacity: 0,
          filter: { type: "blur", value: 12 },
          duration: 0.85,
          ease: "power2.out",
          customStyles: { fontSize: "xl", fontWeight: "light", letterSpacing: "wide" },
        },
        splitTextConfig: { enabled: true, type: "words", stagger: 0.07, staggerFrom: "start" },
        duration: 0.85,
        position: { type: "withPrevious", offset: 0.3 },
        pos: { xp: 0, yp: 18 },
      },
    ],
  },
]

/**
 * Expands a preset into a loadable TimelineProject. Items are returned complete
 * (full AnimationConfig + SplitTextConfig) so `loadProject()` can accept the
 * result directly and its sanitizer has nothing to patch up.
 */
export function buildPresetProject(preset: TimelinePreset): TimelineProject {
  const total = preset.items.length

  const items: TimelineItem[] = preset.items.map((entry, index) => ({
    id: `tl-item-${preset.id}-${index}`,
    label: entry.label,
    text: entry.text,
    animation: anim(entry.animation),
    splitTextConfig: split(entry.splitTextConfig),
    duration: entry.duration,
    position: entry.position,
    ease: entry.ease,
    order: index,
    pos:
      entry.pos ??
      (total <= 1
        ? { xp: 0, yp: 0 }
        : { xp: 0, yp: Math.round((((index + 0.5) / total) * 72 - 36) * 100) / 100 }),
  }))

  const labels: TimelineLabel[] = (preset.labels ?? []).map((label, index) => ({
    id: `tl-label-${preset.id}-${index}`,
    name: label.name,
    time: label.time,
  }))

  return {
    id: `tl-project-${preset.id}`,
    name: preset.name,
    items,
    labels,
    repeat: 0,
    repeatDelay: 0,
    yoyo: false,
    totalDuration: 0,
  }
}
