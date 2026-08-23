"use client"

import { memo, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

interface TimelineBlockProps {
  id: string
  label: string
  start: number
  duration: number
  color: string
  scale: number
  selected: boolean
  snapTimes: number[]
  snapEnabled: boolean
  onSelect: (id: string) => void
  onCommit: (id: string, patch: { start?: number; duration?: number }) => void
  onDragEnd: () => void
}

type DragMode = "move" | "resizeL" | "resizeR"

// Individually memoized (primitive props) so dragging one block doesn't
// re-render all blocks.
function TimelineBlockInner({
  id,
  label,
  start,
  duration,
  color,
  scale,
  selected,
  snapTimes,
  snapEnabled,
  onSelect,
  onCommit,
  onDragEnd,
}: TimelineBlockProps) {
  const startPx = start * scale
  const widthPx = Math.max(8, duration * scale)
  const dragState = useRef<{ type: DragMode; startClientX: number; origStart: number; origDuration: number } | null>(null)

  const applySnap = useCallback(
    (time: number) => {
      if (!snapEnabled || snapTimes.length === 0) return time
      const threshold = 8 / scale
      let best = time
      let bestDist = threshold
      for (const t of snapTimes) {
        const d = Math.abs(time - t)
        if (d < bestDist) {
          bestDist = d
          best = t
        }
      }
      return Math.round(best * 100) / 100
    },
    [snapEnabled, snapTimes, scale],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, type: DragMode) => {
      e.preventDefault()
      e.stopPropagation()
      dragState.current = { type, startClientX: e.clientX, origStart: start, origDuration: duration }

      const handleMove = (ev: PointerEvent) => {
        const s = dragState.current
        if (!s) return
        const dxSec = (ev.clientX - s.startClientX) / scale
        if (s.type === "move") {
          onCommit(id, { start: applySnap(Math.max(0, s.origStart + dxSec)) })
        } else if (s.type === "resizeR") {
          onCommit(id, { duration: applySnap(Math.max(0.1, s.origDuration + dxSec)) })
        } else {
          const newStart = applySnap(Math.max(0, s.origStart + dxSec))
          const newDuration = applySnap(Math.max(0.1, s.origDuration - (newStart - s.origStart)))
          onCommit(id, { start: newStart, duration: newDuration })
        }
      }
      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove)
        window.removeEventListener("pointerup", handleUp)
        dragState.current = null
        onDragEnd()
      }
      window.addEventListener("pointermove", handleMove)
      window.addEventListener("pointerup", handleUp)
    },
    [id, start, duration, scale, applySnap, onCommit, onDragEnd],
  )

  return (
    <div
      className={cn(
        "absolute top-1 h-[calc(100%-8px)] rounded-md border cursor-grab active:cursor-grabbing select-none flex items-center overflow-hidden transition-colors",
        selected ? "border-ring ring-1 ring-ring/50" : "border-white/15 hover:border-white/30",
      )}
      style={{
        left: startPx,
        width: widthPx,
        background: `linear-gradient(135deg, ${color}cc, ${color}66)`,
      }}
      onPointerDown={(e) => {
        onSelect(id)
        onPointerDown(e, "move")
      }}
      title={`${label} · ${start.toFixed(2)}s → ${(start + duration).toFixed(2)}s`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize bg-black/20 hover:bg-black/40"
        onPointerDown={(e) => onPointerDown(e, "resizeL")}
      />
      <div className="flex-1 min-w-0 px-3 text-[10px] font-medium text-white truncate text-center drop-shadow">
        {label}
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize bg-black/20 hover:bg-black/40"
        onPointerDown={(e) => onPointerDown(e, "resizeR")}
      />
    </div>
  )
}

const TimelineBlock = memo(TimelineBlockInner)

export default TimelineBlock
