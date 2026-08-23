// Timeline Animation Creator types.
// Extends — never redefines — the existing text-animation types.

import type { AnimationConfig, SplitTextConfig } from "@/types/animation"

// ── Positioning ───────────────────────────────────────────────────────────────

export type TimelinePosition =
  | { type: "start" }                          // absolute 0
  | { type: "afterPrevious"; offset: number }  // previous item's end + offset
  | { type: "withPrevious"; offset: number }   // previous item's start + offset
  | { type: "atTime"; time: number }           // absolute seconds
  | { type: "label"; label: string; offset?: number }

export const POSITION_TYPES = ["start", "afterPrevious", "withPrevious", "atTime", "label"] as const
export type PositionType = (typeof POSITION_TYPES)[number]

// ── Entities ──────────────────────────────────────────────────────────────────

export interface TimelineItem {
  id: string                     // uuid
  label: string                  // user-facing name shown in the track list
  text: string                   // this item's own target text content
  animation: AnimationConfig     // FULL reuse of the existing config shape
  splitTextConfig: SplitTextConfig // FULL reuse of the existing split config shape
  duration: number               // seconds (timeline-level tween duration override)
  position: TimelinePosition
  ease?: string                  // optional per-item ease overriding animation.ease
  order: number                  // stable sort / drag-reorder index
  pos?: TimelinePos              // free-form artboard placement (% offsets from center)
}

/** Artboard placement as percent offsets from the artboard center (-50..50). */
export interface TimelinePos {
  xp: number
  yp: number
}

export interface TimelineLabel {
  id: string
  name: string
  time: number // absolute seconds on the ruler
}

export interface TimelineProject {
  id: string
  name: string
  items: TimelineItem[]
  labels: TimelineLabel[]
  repeat: number      // -1 = infinite
  repeatDelay: number
  yoyo: boolean
  totalDuration: number // derived — computed from items/labels, never edited manually
}

// ── Derived layout model (computed, not persisted) ───────────────────────────

export interface TimelineLayoutEntry {
  item: TimelineItem
  start: number       // resolved absolute start time
  end: number         // start + effective visual duration (incl. stagger/repeat estimate)
}

export interface TimelineLayout {
  entries: TimelineLayoutEntry[]   // sorted by resolved start
  totalDuration: number
}
