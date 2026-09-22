"use client"

import { useMemo, useState, type ReactNode } from "react"
import { GripVertical, Copy, Trash2, Layers } from "lucide-react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import { computeLayout, blockColorFor } from "@/utils/timeline-builder"
import { cn } from "@/lib/utils"

export default function TimelineTrackList({ action, footer }: { action?: ReactNode; footer?: ReactNode }) {
  const project = useTimelineProjectStore((s) => s.project)
  const reorderItems = useTimelineProjectStore((s) => s.reorderItems)
  const removeItem = useTimelineProjectStore((s) => s.removeItem)
  const duplicateItem = useTimelineProjectStore((s) => s.duplicateItem)

  const selectedItemId = useTimelineUiStore((s) => s.selectedItemId)
  const setSelectedItem = useTimelineUiStore((s) => s.setSelectedItem)

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const items = project.items
  const ordered = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items])

  // Resolved absolute start/end times for display
  const boundsById = useMemo(() => {
    const layout = computeLayout(project)
    const map: Record<string, { start: number; end: number }> = {}
    for (const e of layout.entries) map[e.item.id] = { start: e.start, end: Number.isFinite(e.end) ? e.end : e.start + e.item.duration }
    return map
  }, [project])

  const handleDrop = (toIndex: number) => {
    if (dragIndex !== null && dragIndex !== toIndex) {
      reorderItems(dragIndex, toIndex)
    }
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Section header — same chrome as the inspector: py-2 + hairline rule */}
      <div className="px-3 py-2 border-b border-border shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">Tracks</span>
          <span className="h-4 min-w-4 px-1 rounded-full wash-5 border border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-center tnum">
            {items.length}
          </span>
        </div>
        {action}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pt-2 pb-2">
        {ordered.length === 0 ? (
          <div className="mt-1 rounded-lg border border-dashed border-border/80 px-3 py-6 text-center">
            <p className="text-[11px] font-medium text-muted-foreground">No tracks yet</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1 leading-relaxed">
              Use <span className="font-mono text-muted-foreground">Presets</span> to drop in a finished sequence, or the
              <span className="font-mono text-muted-foreground"> + </span> above to add your first layer.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {ordered.map((item, index) => {
              const isSelected = selectedItemId === item.id
              const isDragging = dragIndex === index
              const isOver = overIndex === index && dragIndex !== null && dragIndex !== index
              const bounds = boundsById[item.id] ?? { start: 0, end: item.duration }
              const hue = blockColorFor(index)

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setOverIndex(index)
                  }}
                  onDragLeave={() => setOverIndex((o) => (o === index ? null : o))}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => {
                    setDragIndex(null)
                    setOverIndex(null)
                  }}
                  onClick={() => setSelectedItem(item.id)}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-md pl-2 pr-1.5 h-[30px] cursor-pointer transition-colors duration-150 select-none overflow-hidden",
                    isDragging && "opacity-40",
                    isOver && "before:absolute before:inset-x-1 before:-top-px before:h-0.5 before:rounded-full before:bg-primary",
                    isSelected
                      ? "wash-12"
                      : "wash-5 hover:wash-9",
                  )}
                >
                  {/* Selection wire — same lime rule used across the app */}
                  {isSelected && (
                    <span className="absolute left-0 inset-y-1.5 w-0.5 rounded-r-full bg-primary" />
                  )}

                  <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60 cursor-grab active:cursor-grabbing transition-colors" />

                  {/* Block-hue swatch — matches the clip on the timeline */}
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[3px] border"
                    style={{ background: `${hue}59`, borderColor: hue }}
                    aria-hidden
                  />

                  <span className="text-[10px] font-mono text-muted-foreground/50 tnum w-3.5 shrink-0">{index + 1}</span>

                  <div className="flex-1 min-w-0">
                    <span className={cn("block text-xs font-medium truncate", isSelected ? "text-foreground" : "text-foreground/90")}>
                      {item.label}
                    </span>
                  </div>

                  {/* Right slot: timing readout, overlaid by actions on hover */}
                  <div className="relative shrink-0 flex items-center justify-end">
                    <span className="text-[10px] font-mono text-muted-foreground/60 tnum transition-opacity group-hover:opacity-0">
                      {bounds.start.toFixed(2)}–{bounds.end.toFixed(2)}s
                    </span>
                    <div className="absolute right-0 flex items-center gap-px opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const newId = duplicateItem(item.id)
                          if (newId) setSelectedItem(newId)
                        }}
                        className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground/70 hover:text-foreground hover:bg-muted/70 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeItem(item.id)
                          if (selectedItemId === item.id) setSelectedItem(null)
                        }}
                        className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {footer && <div className="mt-3 border-t border-border pt-1">{footer}</div>}
      </div>
    </div>
  )
}
