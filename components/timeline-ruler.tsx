"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { ZoomIn, ZoomOut, Magnet, Flag, Plus } from "lucide-react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import { computeLayout, itemCycleDuration } from "@/utils/timeline-builder"
import TimelineBlock from "@/components/timeline-block"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { TimelineItem } from "@/types/timeline"

// Muted functional hues (cycle of 5) so blocks stay distinguishable
// without fighting the acid accent. Aligned with the chart tokens.
const BLOCK_COLORS = [
  "#96c04f", "#5faec9", "#d2a54e", "#c9719f", "#56b199",
]

export default function TimelineRuler() {
  const project = useTimelineProjectStore((s) => s.project)
  const updateItem = useTimelineProjectStore((s) => s.updateItem)

  const currentTime = useTimelineUiStore((s) => s.currentTime)
  const zoomLevel = useTimelineUiStore((s) => s.zoomLevel)
  const setZoomLevel = useTimelineUiStore((s) => s.setZoomLevel)
  const snapEnabled = useTimelineUiStore((s) => s.snapEnabled)
  const setSnapEnabled = useTimelineUiStore((s) => s.setSnapEnabled)
  const selectedItemId = useTimelineUiStore((s) => s.selectedItemId)
  const setSelectedItem = useTimelineUiStore((s) => s.setSelectedItem)

  const scrollRef = useRef<HTMLDivElement>(null)

  // Live drag overrides — updated on pointermove without touching the store,
  // flushed to the store once on pointerup to avoid per-move timeline rebuilds.
  const [dragOverrides, setDragOverrides] = useState<Record<string, { start?: number; duration?: number }>>({})

  const { entries, totalDuration } = useMemo(() => computeLayout(project), [project])
  const sorted = useMemo(() => [...project.items].sort((a, b) => a.order - b.order), [project.items])

  // Snap reference points: 0, labels, and every item start/end
  const snapTimes = useMemo(() => {
    const set = new Set<number>([0])
    for (const l of project.labels) set.add(l.time)
    for (const e of entries) {
      set.add(Math.max(0, e.start))
      if (Number.isFinite(e.end)) set.add(e.end)
    }
    return Array.from(set).sort((a, b) => a - b)
  }, [project.labels, entries])

  const scale = zoomLevel
  const contentWidth = Math.max(400, (Number.isFinite(totalDuration) ? totalDuration : 0) * scale + 120)

  const colorById = useMemo(() => {
    const map: Record<string, string> = {}
    project.items.forEach((it, i) => {
      map[it.id] = BLOCK_COLORS[i % BLOCK_COLORS.length]
    })
    return map
  }, [project.items])

  // ── Block interactions ───────────────────────────────────────────────────
  // Visual drag/resize expresses absolute timing — converted to atTime.
  const handleCommit = useCallback((id: string, patch: { start?: number; duration?: number }) => {
    setDragOverrides((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...patch } }))
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragOverrides((prev) => {
      for (const [id, patch] of Object.entries(prev)) {
        const updates: Partial<TimelineItem> = {}
        if (patch.duration !== undefined) updates.duration = Math.max(0.1, patch.duration)
        if (patch.start !== undefined) updates.position = { type: "atTime", time: Math.max(0, patch.start) }
        if (Object.keys(updates).length > 0) updateItem(id, updates)
      }
      return {}
    })
  }, [updateItem])

  // ── Zoom helpers ──────────────────────────────────────────────────────────
  const zoomIn = useCallback(() => setZoomLevel(Math.min(400, zoomLevel * 1.35)), [zoomLevel, setZoomLevel])
  const zoomOut = useCallback(() => setZoomLevel(Math.max(14, zoomLevel * 0.75)), [zoomLevel, setZoomLevel])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.12 : 0.89
    setZoomLevel(Math.min(400, Math.max(14, zoomLevel * factor)))
  }, [zoomLevel, setZoomLevel])

  const playheadPx = currentTime * scale

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
        <Button size="sm" variant="ghost" onClick={zoomOut} className="h-6 w-6 p-0" title="Zoom out">
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <span className="text-[10px] font-mono text-muted-foreground w-12 text-center">{Math.round(zoomLevel)}px/s</span>
        <Button size="sm" variant="ghost" onClick={zoomIn} className="h-6 w-6 p-0" title="Zoom in">
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          onClick={() => setSnapEnabled(!snapEnabled)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all border",
            snapEnabled
              ? "bg-primary/10 text-ring border-ring/40"
              : "text-muted-foreground border-border hover:text-foreground",
          )}
          title="Toggle magnetic snapping"
        >
          <Magnet className="h-3 w-3" />
          Snap
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <span className="text-[10px] font-mono text-muted-foreground">
          {project.items.length} items · {Number.isFinite(totalDuration) ? totalDuration.toFixed(2) : "∞"}s
        </span>
      </div>

      {/* Timeline canvas */}
      <div
        className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden custom-scrollbar relative"
        onWheel={handleWheel}
        ref={scrollRef}
      >
        <div className="relative h-full" style={{ width: contentWidth }}>
          {/* Time axis */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-muted/40 border-b border-border">
            {renderTicks(totalDuration, scale)}
          </div>

          {/* Label markers */}
          {project.labels.map((label) => (
            <LabelMarker
              key={label.id}
              name={label.name}
              x={label.time * scale}
            />
          ))}

          {/* Playhead — the live wire */}
          <div
            className="absolute top-0 bottom-0 w-px bg-primary z-20 pointer-events-none"
            style={{ left: playheadPx }}
          >
            <div className="absolute -top-0.5 -left-1.5 w-3 h-3 rounded-sm bg-primary rotate-45" />
          </div>

          {/* Blocks layer */}
          <div className="absolute top-6 left-0 right-0 bottom-0">
            {sorted.map((item) => {
              const entry = entries.find((e) => e.item.id === item.id)
              if (!entry) return null
              const override = dragOverrides[item.id] ?? {}
              const start = override.start ?? entry.start
              const duration = override.duration ?? itemCycleDuration(item)
              return (
                <TimelineBlock
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  start={start}
                  duration={duration}
                  color={colorById[item.id] ?? BLOCK_COLORS[0]}
                  scale={scale}
                  selected={selectedItemId === item.id}
                  snapTimes={snapTimes}
                  snapEnabled={snapEnabled}
                  onSelect={setSelectedItem}
                  onCommit={handleCommit}
                  onDragEnd={handleDragEnd}
                />
              )
            })}
          </div>

          {/* Empty hint */}
          {project.items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-[11px] text-muted-foreground/60">
              <span className="flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add an animation to place it on the timeline
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function renderTicks(total: number, scale: number): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // adaptive step: pick a "nice" interval so ticks don't crowd
  const pxStep = 60
  const step = niceStep(pxStep / Math.max(1, scale))
  const limit = Number.isFinite(total) ? Math.ceil(total / step) : 1000
  for (let i = 0; i <= limit; i++) {
    const t = i * step
    const x = t * scale
    const major = i % 2 === 0
    nodes.push(
      <div key={i} className="absolute top-0 bottom-0" style={{ left: x }}>
        <div className={cn("w-px bg-border", major ? "h-full" : "h-2")} />
        <span className="absolute top-0.5 left-1 text-[9px] font-mono text-muted-foreground/70">
          {formatTick(t)}
        </span>
      </div>,
    )
  }
  return nodes
}

function niceStep(minStep: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(minStep)))
  const candidates = [1, 2, 5, 10]
  for (const c of candidates) {
    if (c * pow >= minStep) return c * pow
  }
  return 10 * pow
}

function formatTick(t: number): string {
  if (t === 0) return "0s"
  if (t < 10) return `${t.toFixed(1)}`
  return `${Math.round(t)}`
}

function LabelMarker({ name, x }: { name: string; x: number }) {
  return (
    <div className="absolute top-6 bottom-0 z-10 pointer-events-none" style={{ left: x }}>
      <div className="w-px h-full bg-warning/50" />
      <div className="absolute top-0 left-1 text-[9px] font-mono text-warning bg-warning/10 border border-warning/30 rounded px-1 py-0.5 whitespace-nowrap">
        <Flag className="h-2.5 w-2.5 inline mr-0.5" />
        {name}
      </div>
    </div>
  )
}
