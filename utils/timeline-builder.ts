// Pure (non-React) mapping between TimelineProject data and a gsap.core.Timeline.
// Consumes the shared animation engine so preview + export always stay in sync.

import { gsap } from "gsap"
import type {
  TimelineItem,
  TimelinePosition,
  TimelineProject,
  TimelineLayout,
  TimelineLayoutEntry,
} from "@/types/timeline"
import { buildFromVars, buildTweenVars } from "@/lib/animation-engine"

// ── Effective duration estimation ─────────────────────────────────────────────

/** Number of split targets an item will animate (approximation for ruler math). */
export function estimateSplitCount(item: TimelineItem): number {
  const stc = item.splitTextConfig
  if (!stc?.enabled) return 1
  if (stc.type === "chars") return Math.max(1, Array.from(item.text).length)
  if (stc.type === "words") return Math.max(1, item.text.split(/\s+/).filter(Boolean).length)
  // Line count depends on rendered layout — not knowable statically.
  return 1
}

/**
 * Visual duration of an item on the ruler (a single repeat cycle), accounting
 * for stagger spread across split elements. Per-item `animation.delay` is
 * intentionally NOT included: the sequencer owns timing (positions/offsets),
 * and buildGsapTimeline strips delay from the tween vars to match.
 */
export function itemCycleDuration(item: TimelineItem): number {
  const stc = item.splitTextConfig
  const base = Math.max(0.01, item.duration)
  let staggerExtra = 0
  if (stc?.enabled && stc.stagger > 0) {
    const count = estimateSplitCount(item)
    const spread = stc.staggerFrom === "center" || stc.staggerFrom === "edges" ? 0.5 : 1
    staggerExtra = stc.stagger * Math.max(0, count - 1) * spread
  }
  return base + staggerExtra
}

/**
 * Full playback footprint including repeat cycles (∞ for infinite repeats).
 */
export function itemFullDuration(item: TimelineItem): number {
  const cycle = itemCycleDuration(item)
  const r = item.animation.repeat ?? 0
  if (r < 0) return Infinity
  if (r === 0) return cycle
  // Per-item yoyo does not change total time; nested repeatDelay not modelled.
  return cycle * (r + 1)
}

// ── Layout resolution ─────────────────────────────────────────────────────────

/**
 * Resolves every item's absolute start/end sequentially (same semantics as
 * adding tweens one-by-one to a GSAP timeline):
 *  - start          → 0
 *  - afterPrevious  → current timeline end + offset
 *  - withPrevious   → previous item's start + offset
 *  - atTime         → absolute
 *  - label          → label time + offset (missing labels fall back to end)
 */
export function computeLayout(project: TimelineProject): TimelineLayout {
  const sorted = [...project.items].sort((a, b) => a.order - b.order)

  const labelTimes = new Map<string, number>()
  for (const l of project.labels) {
    if (!labelTimes.has(l.name)) labelTimes.set(l.name, l.time)
  }

  const entries: TimelineLayoutEntry[] = []
  let cursorEnd = 0
  let prevStart = 0

  for (const item of sorted) {
    let start = 0
    const pos: TimelinePosition = item.position
    switch (pos.type) {
      case "start":
        start = 0
        break
      case "afterPrevious":
        start = cursorEnd + (pos.offset || 0)
        break
      case "withPrevious":
        start = prevStart + (pos.offset || 0)
        break
      case "atTime":
        start = pos.time
        break
      case "label":
        start = (labelTimes.get(pos.label) ?? cursorEnd) + (pos.offset ?? 0)
        break
    }
    start = Math.max(0, start)

    const end = start + itemFullDuration(item)
    entries.push({ item, start, end })
    cursorEnd = Math.max(cursorEnd, end)
    prevStart = start
  }

  entries.sort((a, b) => a.start - b.start || a.item.order - b.item.order)

  const finiteEnds = entries.map((e) => e.end).filter((n) => Number.isFinite(n))
  const totalDuration = entries.some((e) => !Number.isFinite(e.end))
    ? Infinity
    : Number(Math.max(0, ...finiteEnds).toFixed(4))

  return { entries, totalDuration }
}

export function getItemStartMap(project: TimelineProject): Record<string, number> {
  const layout = computeLayout(project)
  const map: Record<string, number> = {}
  for (const e of layout.entries) map[e.item.id] = e.start
  return map
}

// ── Validation ────────────────────────────────────────────────────────────────

export interface ValidationIssue {
  level: "error" | "warning"
  message: string
}

export function validateProject(project: TimelineProject): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const nameCounts = new Map<string, number>()
  for (const l of project.labels) nameCounts.set(l.name, (nameCounts.get(l.name) ?? 0) + 1)
  for (const [name, count] of nameCounts) {
    if (count > 1) issues.push({ level: "error", message: `Duplicate label "${name}"` })
  }

  const knownLabels = new Set(project.labels.map((l) => l.name))
  for (const item of project.items) {
    if (!(item.duration > 0)) {
      // Warning, not error — the item is simply skipped; it shouldn't block
      // playback of everything else on the timeline.
      issues.push({ level: "warning", message: `"${item.label}" has zero duration — it is skipped` })
    }
    if (item.position.type === "label" && !knownLabels.has(item.position.label)) {
      issues.push({ level: "warning", message: `"${item.label}" points at missing label "${item.position.label}"` })
    }
    if (!item.text.trim()) {
      issues.push({ level: "warning", message: `"${item.label}" has empty text` })
    }
  }

  return issues
}

// ── Position serialization (for generated export code) ───────────────────────

function trimNum(n: number): string {
  return String(parseFloat(n.toFixed(4)))
}

/**
 * Emits a GSAP position parameter string/number literal expressing the user's
 * intent. Semantic forms are used where GSAP resolves them identically to the
 * in-app layout; ambiguous cases fall back to the resolved absolute time.
 */
export function serializePositionLiteral(
  pos: TimelinePosition,
  resolvedStart: number,
  isFirstInOrder: boolean,
): string {
  switch (pos.type) {
    case "start":
      return "0"
    case "atTime":
      return trimNum(pos.time)
    case "label":
      return typeof pos.offset === "number" && pos.offset !== 0
        ? `"${pos.label}+=${trimNum(pos.offset)}"`
        : `"${pos.label}"`
    case "afterPrevious":
      if (isFirstInOrder) return trimNum(Math.max(0, resolvedStart))
      return pos.offset ? `"+=${trimNum(pos.offset)}"` : '">"'
    case "withPrevious":
      if (isFirstInOrder) return "0"
      if (!pos.offset) return '"<"'
      return trimNum(Math.max(0, resolvedStart))
  }
}

// ── GSAP timeline construction ────────────────────────────────────────────────

/**
 * Builds a configured gsap.core.Timeline from the project data.
 * Targets must be keyed by item id. Invalid items (zero duration / missing
 * target element) are skipped — run validateProject() first to surface them.
 */
export function buildGsapTimeline(
  project: TimelineProject,
  targets: Record<string, Element | Element[]>,
): gsap.core.Timeline {
  const tl = gsap.timeline({
    repeat: project.repeat,
    repeatDelay: project.repeatDelay,
    yoyo: project.yoyo,
    paused: true,
  })

  for (const l of project.labels) {
    tl.addLabel(l.name, l.time)
  }

  const layout = computeLayout(project)

  for (const entry of layout.entries) {
    const item = entry.item
    if (!(item.duration > 0)) continue
    const target = targets[item.id]
    if (!target || (Array.isArray(target) && target.length === 0)) continue

    const cfg = item.animation
    const vars = buildTweenVars(cfg, item.splitTextConfig)
    // Timeline-level overrides — the sequencer owns timing. `duration` comes
    // from the item; `delay` must be stripped or the tween would start at
    // entry.start + delay and drift out of sync with the ruler (and exports).
    vars.duration = item.duration
    delete vars.delay
    if (item.ease) vars.ease = item.ease

    if (cfg.tweenType === "fromTo" && cfg.fromValues) {
      tl.fromTo(target as gsap.TweenTarget, buildFromVars(cfg), vars, entry.start)
    } else if (cfg.tweenType === "from") {
      tl.from(target as gsap.TweenTarget, vars, entry.start)
    } else {
      tl.to(target as gsap.TweenTarget, vars, entry.start)
    }
  }

  return tl
}
