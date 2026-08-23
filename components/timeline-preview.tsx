"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { Play, Pause, RotateCcw, Gauge } from "lucide-react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import { Button } from "@/components/ui/button"
import { buildGsapTimeline, computeLayout, itemCycleDuration, validateProject } from "@/utils/timeline-builder"
import { computeTextStyles, resetAndPrepareElement, resolveTargets } from "@/lib/animation-engine"
import { cn } from "@/lib/utils"
import type { TimelineItem } from "@/types/timeline"

/** Default placement when an item has no stored pos — even vertical stack. */
function fallbackPos(index: number, total: number): { xp: number; yp: number } {
  const yp = total <= 1 ? 0 : ((index + 0.5) / total) * 72 - 36
  return { xp: 0, yp: Math.round(yp * 100) / 100 }
}

function clampPct(n: number): number {
  return Math.min(48, Math.max(-48, n))
}

export default function TimelinePreview() {
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const itemElsRef = useRef<Record<string, HTMLElement>>({})
  const lastSyncRef = useRef(0)
  const canvasRef = useRef<HTMLDivElement>(null)

  const project = useTimelineProjectStore((s) => s.project)
  const revision = useTimelineProjectStore((s) => s.revision)
  const updateItem = useTimelineProjectStore((s) => s.updateItem)

  const currentTime = useTimelineUiStore((s) => s.currentTime)
  const isPlaying = useTimelineUiStore((s) => s.isPlaying)
  const setCurrentTime = useTimelineUiStore((s) => s.setCurrentTime)
  const setIsPlaying = useTimelineUiStore((s) => s.setIsPlaying)
  const speed = useTimelineUiStore((s) => s.speed)
  const setSpeed = useTimelineUiStore((s) => s.setSpeed)
  const selectedItemId = useTimelineUiStore((s) => s.selectedItemId)
  const setSelectedItem = useTimelineUiStore((s) => s.setSelectedItem)
  const setLiveItemPos = useTimelineUiStore((s) => s.setLiveItemPos)

  // Live drag override — committed to the store once on pointerup so the GSAP
  // timeline isn't rebuilt on every pointermove.
  const [dragPos, setDragPos] = useState<{ id: string; xp: number; yp: number } | null>(null)

  const { errors, sortedItems, layout } = useMemo(() => {
    const errs = validateProject(project)
    const l = computeLayout(project)
    const items = [...project.items].sort((a, b) => a.order - b.order).filter((i) => i.duration > 0)
    return { errors: errs, sortedItems: items, layout: l }
  }, [project])

  const hasItems = project.items.length > 0
  // Infinite repeats (repeat:-1) make totalDuration = ∞ — fall back to the sum of
  // per-item cycle durations so play/scrub still work with a finite reference.
  const totalDisplay = Number.isFinite(layout.totalDuration)
    ? layout.totalDuration
    : layout.entries.reduce((acc, e) => acc + (Number.isFinite(e.end - e.start) ? e.end - e.start : itemCycleDuration(e.item)), 0)
  const canPlay = hasItems && totalDisplay > 0 && errors.every((e) => e.level !== "error")

  // Throttled → syncs playhead + play-state into the UI store (~30fps)
  const refreshPlayhead = useCallback(() => {
    const t = performance.now()
    if (t - lastSyncRef.current < 32) return
    lastSyncRef.current = t
    const tl = tlRef.current
    if (tl) {
      setCurrentTime(tl.time())
      setIsPlaying(tl.isActive())
    } else {
      setIsPlaying(false)
    }
  }, [setCurrentTime, setIsPlaying])

  // ── Rebuild the GSAP timeline when the project data actually changes ──────
  useEffect(() => {
    const previous = tlRef.current
    if (previous) {
      try { previous.kill() } catch { /* noop */ }
      tlRef.current = null
    }
    gsap.ticker.remove(refreshPlayhead)

    if (!canPlay) {
      setCurrentTime(0)
      setIsPlaying(false)
      return
    }

    // Prepare every element to a clean base state (styles + split DOM)
    const targets: Record<string, Element | Element[]> = {}
    for (const item of sortedItems) {
      const el = itemElsRef.current[item.id]
      if (!el) continue
      resetAndPrepareElement(el, computeTextStyles(item.animation.customStyles), item.text, item.splitTextConfig)
      const target = resolveTargets(el, item.splitTextConfig)
      if (target && (!Array.isArray(target) || target.length > 0)) targets[item.id] = target
    }

    const nextTl = buildGsapTimeline(project, targets)
    tlRef.current = nextTl
    nextTl.eventCallback("onComplete", () => {
      setCurrentTime(nextTl.duration())
      setIsPlaying(false)
    })

    gsap.ticker.add(refreshPlayhead)
    setCurrentTime(0)
    setIsPlaying(false)

    return () => {
      gsap.ticker.remove(refreshPlayhead)
      try { nextTl.kill() } catch { /* noop */ }
      if (tlRef.current === nextTl) tlRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision, canPlay, setCurrentTime, setIsPlaying])

  // ── Transport (drives the actual gsap instance) ──────────────────────────
  const play = useCallback(() => {
    const tl = tlRef.current
    if (!tl) return
    setIsPlaying(true)
    if (tl.progress() >= 1) tl.progress(0).pause()
    tl.timeScale(speed)
    tl.play()
  }, [speed, setIsPlaying])

  const pause = useCallback(() => {
    const tl = tlRef.current
    if (!tl) return
    tl.pause()
    setIsPlaying(false)
  }, [setIsPlaying])

  const restart = useCallback(() => {
    const tl = tlRef.current
    if (!tl) return
    setIsPlaying(true)
    tl.timeScale(speed)
    tl.progress(0).play()
  }, [speed, setIsPlaying])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const handleScrub = useCallback((value: number) => {
    const tl = tlRef.current
    if (!tl) return
    tl.pause()
    tl.timeScale(speed)
    const safe = Math.min(1, Math.max(0, value / Math.max(0.001, totalDisplay)))
    tl.progress(safe)
    setCurrentTime(tl.time())
  }, [totalDisplay, speed, setCurrentTime])

  // Keyboard space → toggle (skip when typing in inputs)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return
      if (e.code === "Space") {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggle])

  // Apply speed changes to a running/paused timeline immediately
  useEffect(() => {
    tlRef.current?.timeScale(speed)
  }, [speed])

  // ── Artboard item selection + free dragging ───────────────────────────────
  const startItemDrag = useCallback(
    (item: TimelineItem, index: number, total: number, e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setSelectedItem(item.id)

      const container = canvasRef.current
      if (!container || e.button !== 0) return
      const rect = container.getBoundingClientRect()
      const startX = e.clientX
      const startY = e.clientY
      const base = item.pos ?? fallbackPos(index, total)
      let moved = false

      const handleMove = (ev: PointerEvent) => {
        if (!moved && Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < 4) return
        moved = true
        const dxp = ((ev.clientX - startX) / rect.width) * 100
        const dyp = ((ev.clientY - startY) / rect.height) * 100
        const xp = clampPct(base.xp + dxp)
        const yp = clampPct(base.yp + dyp)
        setDragPos({ id: item.id, xp, yp })
        // Mirror into the UI store so the inspector's X/Y readouts update live
        setLiveItemPos({ id: item.id, xp, yp })
      }
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove)
        window.removeEventListener("pointerup", handleUp)
        setLiveItemPos(null)
        setDragPos((cur: { id: string; xp: number; yp: number } | null) => {
          if (cur && cur.id === item.id && moved) {
            updateItem(item.id, {
              pos: { xp: Math.round(cur.xp * 100) / 100, yp: Math.round(cur.yp * 100) / 100 },
            })
          }
          return null
        })
      }
      window.addEventListener("pointermove", handleMove)
      window.addEventListener("pointerup", handleUp)
    },
    [setSelectedItem, updateItem, setLiveItemPos],
  )
  const progressPct = totalDisplay > 0 ? (currentTime / totalDisplay) * 100 : 0
  const total = sortedItems.length

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Artboard */}
      <div
        ref={canvasRef}
        className="relative flex-1 min-h-0 rounded-lg border border-border bg-canvas-bg canvas-grid overflow-hidden"
        onPointerDown={(e) => {
          // Click empty canvas → deselect
          if (e.target === e.currentTarget) setSelectedItem(null)
        }}
      >
        {hasItems ? (
          sortedItems.map((item, index) => {
            const override = dragPos && dragPos.id === item.id ? dragPos : null
            const pos = override ?? item.pos ?? fallbackPos(index, total)
            const isSelected = selectedItemId === item.id
            // Style-tab overflow toggles — clip the text element's box so split
            // children and masked reveals stay inside it (artboard itself is
            // always clipped, which covers the container-overflow case too).
            const clipText = item.animation.customStyles.overflowHidden || item.animation.customStyles.containerOverflow
            return (
              /* Positioning wrapper — owns layout placement so GSAP can own the
                 animation transforms on the inner element without conflicts */
              <div
                key={item.id}
                className="absolute max-w-full"
                style={{
                  left: `${50 + pos.xp}%`,
                  top: `${50 + pos.yp}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  onPointerDown={(e) => startItemDrag(item, index, total, e)}
                  className={cn(
                    "relative cursor-grab active:cursor-grabbing select-none",
                    isSelected &&
                      "after:absolute after:-inset-2 after:border after:border-ring/70 after:rounded-md after:pointer-events-none"
                  )}
                  title={item.label}
                >
                  {/* Static clip layer — stays put while GSAP animates the
                      element inside it, producing true masked reveals */}
                  <div className={cn("w-fit", clipText && "overflow-hidden")}>
                    <div
                      data-timeline-item-id={item.id}
                      ref={(el) => {
                        if (el) itemElsRef.current[item.id] = el
                        else delete itemElsRef.current[item.id]
                      }}
                      className="timeline-item text-center max-w-full"
                      style={computeTextStyles(item.animation.customStyles)}
                    >
                      {!item.splitTextConfig.enabled && item.text}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-muted-foreground/70 text-center max-w-xs leading-relaxed">
              Pick an animation preset from the left panel to begin composing your sequence.
            </div>
          </div>
        )}
      </div>

      {/* Validation strip */}
      {errors.length > 0 && (
        <div className="px-3 py-1.5 rounded-lg text-[11px] bg-warning/10 border border-warning/25 text-warning space-y-0.5">
          {errors.map((e, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full", e.level === "error" ? "bg-destructive" : "bg-warning")} />
              {e.message}
            </div>
          ))}
        </div>
      )}

      {/* Transport */}
      <div className="flex items-center gap-3 bg-card/90 border border-border rounded-xl px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="ghost" onClick={toggle} disabled={!canPlay} className="h-8 w-8 p-0" title="Play / Pause (Space)">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={restart} disabled={!canPlay} className="h-8 w-8 p-0" title="Restart">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(0.001, totalDisplay)}
          step={0.01}
          value={Math.min(currentTime, totalDisplay)}
          onChange={(e) => handleScrub(parseFloat(e.target.value))}
          disabled={!canPlay}
          className="flex-1 h-1.5 cursor-pointer "
          aria-label="Scrub"
          style={{ background: `linear-gradient(to right, var(--primary) ${progressPct}%, var(--border) ${progressPct}%)` }}
        />

        <div className="text-[11px] font-mono text-muted-foreground whitespace-nowrap tabular-nums">
          {formatTime(currentTime)} / {Number.isFinite(layout.totalDuration) ? formatTime(layout.totalDuration) : "∞"}
        </div>

        <div className="flex items-center gap-1">
          <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-medium transition-all",
                speed === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "∞"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toFixed(1).padStart(4, "0")}`
}
