"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { DialTimeline, useDialTimeline } from "dialkit"
import type { TimelineConfig, TransitionConfig } from "dialkit"
import { useTheme } from "next-themes"
import type { gsap } from "gsap"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import { computeLayout } from "@/utils/timeline-builder"
import type { TimelineItem, TimelineProject } from "@/types/timeline"
import type { CustomEaseSpec } from "@/types/animation"
import { easeToCurve } from "@/lib/ease-presets"

export const DIAL_TIMELINE_ID = "texp-timeline"

// ── Ease mapping ─────────────────────────────────────────────────────────────
// Shared with the curve editor (lib/ease-presets): named eases display as
// their cubic-bezier approximation, elastic/bounce as springs. The canvas
// itself stays 100% GSAP.
function transitionFor(item: TimelineItem): TransitionConfig {
  const { spec } = easeToCurve(item.ease ?? item.animation.ease, item.animation.customEase, item.duration)
  if (spec.type === "easing") {
    return { type: "easing", duration: Math.max(0.05, item.duration), ease: spec.ease }
  }
  const { type, ...rest } = spec
  return { type, ...rest }
}

function sameTransition(a: TransitionConfig | undefined, b: TransitionConfig | undefined): boolean {
  if (!a || !b) return a === b
  if (a.type !== b.type) return false
  if (a.type === "easing" && b.type === "easing") {
    return a.ease.every((v, i) => Math.abs(Number(v) - Number(b.ease[i])) < 0.005)
  }
  if (a.type === "spring" && b.type === "spring") {
    const keys = ["stiffness", "damping", "mass", "visualDuration", "bounce"] as const
    return keys.every((k) => Math.abs((a[k] ?? -1) - (b[k] ?? -1)) < 0.01)
  }
  return false
}

// ── Project → DialKit timeline config ─────────────────────────────────────────

/** Clip keys double as dock row labels — DialKit uses config keys verbatim. */
function clipKey(item: TimelineItem, used: Set<string>): string {
  const base = (item.label || item.text || item.id).replace(/\s+/g, " ").trim() || item.id
  let key = base
  let n = 2
  while (used.has(key)) key = `${base} ${n++}`
  used.add(key)
  return key
}

interface BuiltConfig {
  config: TimelineConfig
  /** item.id → clip key, for mapping dock values back to project items. */
  keyOf: Map<string, string>
}

function buildConfig(project: TimelineProject): BuiltConfig {
  const layout = computeLayout(project)
  const total = Number.isFinite(layout.totalDuration) && layout.totalDuration > 0
    ? layout.totalDuration
    : layout.entries.reduce((acc, e) => acc + Math.max(0, e.end - e.start), 0)
  const config: TimelineConfig = { duration: Math.max(1, Math.round(total * 100) / 100) }
  const keyOf = new Map<string, string>()
  const used = new Set<string>()
  for (const e of layout.entries) {
    if (!(e.item.duration > 0)) continue
    const key = clipKey(e.item, used)
    keyOf.set(e.item.id, key)
    config[key] = {
      at: Math.round(Math.max(0, e.start) * 100) / 100,
      duration: e.item.duration,
      transition: transitionFor(e.item),
    }
  }
  return { config, keyOf }
}

// ── Bridge ────────────────────────────────────────────────────────────────────

interface DialTimelineBridgeProps {
  /** Live GSAP preview timeline — the playback master. */
  getTl: () => gsap.core.Timeline | null
  /** In-card slot the portaled dock is aligned over. */
  slotRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Mounts DialKit's timeline dock for the active sequence and keeps three
 * channels in sync with epsilon guards (no echo loops):
 *  1. project data → dock clips (config rebuild per revision)
 *  2. dock playhead ↔ GSAP playhead (GSAP stays master; the dock's own
 *     transport buttons are forwarded to it, so speed/repeat/yoyo still work)
 *  3. dock clip edits (move / resize / curve) → project store
 */
export default function DialTimelineBridge({ getTl, slotRef }: DialTimelineBridgeProps) {
  const project = useTimelineProjectStore((s) => s.project)
  const revision = useTimelineProjectStore((s) => s.revision)
  const updateItem = useTimelineProjectStore((s) => s.updateItem)
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "light" ? "light" : resolvedTheme === "dark" ? "dark" : "system"

  const { config, keyOf } = useMemo(() => buildConfig(project), [project, revision])
  const tl = useDialTimeline("Sequence", config, { id: DIAL_TIMELINE_ID, autoplay: false })

  const tlRef = useRef(tl)
  tlRef.current = tl
  const getTlRef = useRef(getTl)
  getTlRef.current = getTl

  // 2a. GSAP → dock: mirror the preview playhead into the dock.
  useEffect(() => {
    return useTimelineUiStore.subscribe((s, prev) => {
      if (s.currentTime === prev.currentTime) return
      const t = tlRef.current
      if (Math.abs(t.time - s.currentTime) > 0.015) t.seek(s.currentTime)
    })
  }, [])

  // 2b. Dock → GSAP: the dock's play/pause/scrub drives the canvas timeline.
  const prevPlaying = useRef(false)
  useEffect(() => {
    const g = getTlRef.current()
    if (!g) return
    if (tl.playing && !prevPlaying.current) {
      tlRef.current.pause() // the dock never self-advances — GSAP owns playback
      g.play()
    } else if (!tl.playing && prevPlaying.current) {
      g.pause()
    } else if (!tl.playing && !g.isActive() && Math.abs(g.time() - tl.time) > 0.015) {
      g.pause(tl.time) // scrub
    }
    prevPlaying.current = tl.playing
  }, [tl.time, tl.playing])

  // 3. Dock edits → project store: compare live clip values against the
  // mapped config; any drift is a user edit (move / resize / curve).
  useEffect(() => {
    const values = tl as unknown as Record<string, { at: number; duration: number; transition?: TransitionConfig } | undefined>
    const mapped = config as unknown as Record<string, { at: number; duration: number; transition: TransitionConfig } | undefined>
    for (const item of project.items) {
      const key = keyOf.get(item.id)
      if (!key) continue
      const v = values[key]
      const m = mapped[key]
      if (!v || !m) continue
      const patch: Partial<TimelineItem> = {}
      if (Math.abs(v.at - m.at) > 0.015) {
        patch.position = { type: "atTime", time: Math.round(v.at * 100) / 100 }
      }
      if (Math.abs(v.duration - m.duration) > 0.015) {
        patch.duration = Math.round(v.duration * 100) / 100
      }
      if (v.transition && !sameTransition(v.transition, m.transition)) {
        const t = v.transition
        const spec: CustomEaseSpec = t.type === "easing"
          ? { type: "easing", ease: t.ease }
          : t.visualDuration !== undefined
            ? { type: "spring", visualDuration: t.visualDuration, bounce: t.bounce }
            : { type: "spring", stiffness: t.stiffness, damping: t.damping, mass: t.mass }
        patch.ease = "custom"
        patch.animation = { ...item.animation, customEase: spec }
      }
      if (Object.keys(patch).length > 0) updateItem(item.id, patch)
    }
  }, [tl, config, keyOf, project, updateItem])

  // Align the portaled, fixed-positioned dock over the in-card slot: the slot
  // reserves the dock's height via --dial-tl-h, and the dock tracks the slot's
  // viewport rect. Observing both sides converges (slot grows → dock re-aligns
  // at the same height; lanes added → dock grows → slot grows).
  useEffect(() => {
    let dock: HTMLElement | null = null
    let raf = 0
    let ro: ResizeObserver | null = null
    let revealed = false
    const sync = () => {
      const slot = slotRef.current
      if (!dock) dock = document.querySelector<HTMLElement>(".dialkit-timeline")
      if (!slot || !dock) {
        raf = requestAnimationFrame(sync)
        return
      }
      const r = slot.getBoundingClientRect()
      dock.style.left = `${Math.round(r.left)}px`
      dock.style.top = `${Math.round(r.top)}px`
      dock.style.width = `${Math.round(r.width)}px`
      document.documentElement.style.setProperty("--dial-tl-h", `${Math.round(dock.getBoundingClientRect().height)}px`)
      if (!revealed) {
        revealed = true
        dock.style.visibility = "visible"
        ro = new ResizeObserver(() => sync())
        ro.observe(slot)
        ro.observe(dock)
      }
    }
    const onWin = () => sync()
    window.addEventListener("resize", onWin)
    sync()
    return () => {
      cancelAnimationFrame(raf)
      ro?.disconnect()
      window.removeEventListener("resize", onWin)
      document.documentElement.style.removeProperty("--dial-tl-h")
      if (dock) dock.style.visibility = ""
    }
  }, [slotRef])

  // The dock IS the timeline now (the old custom ruler section was removed),
  // so it stays expanded; users can still collapse it via its chevron.
  // Client-only mount: the dock's motion internals don't SSR-hydrate cleanly.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <DialTimeline theme={theme} productionEnabled defaultVisible defaultOpen />
}
