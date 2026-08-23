"use client"

import { useMemo, useState } from "react"
import { GripVertical, Copy, Trash2, Clock } from "lucide-react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import { computeLayout } from "@/utils/timeline-builder"
import { cn } from "@/lib/utils"

export default function TimelineTrackList() {
  const project = useTimelineProjectStore((s) => s.project)
  const reorderItems = useTimelineProjectStore((s) => s.reorderItems)
  const removeItem = useTimelineProjectStore((s) => s.removeItem)
  const duplicateItem = useTimelineProjectStore((s) => s.duplicateItem)

  const selectedItemId = useTimelineUiStore((s) => s.selectedItemId)
  const setSelectedItem = useTimelineUiStore((s) => s.setSelectedItem)

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const items = project.items
  const ordered = [...items].sort((a, b) => a.order - b.order)

  // Resolved absolute start times for display
  const startById = useMemo(() => {
    const layout = computeLayout(project)
    const map: Record<string, number> = {}
    for (const e of layout.entries) map[e.item.id] = e.start
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
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">Tracks</span>
        <span className="text-[10px] font-mono text-muted-foreground/60">{items.length} items</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
        {ordered.length === 0 && (
          <div className="text-[11px] text-muted-foreground/70 text-center py-6 px-3 leading-relaxed">
            No animations yet. Add one to begin sequencing.
          </div>
        )}

        {ordered.map((item, index) => {
          const isSelected = selectedItemId === item.id
          const isDragging = dragIndex === index
          const isOver = overIndex === index && !isDragging
          const start = startById[item.id] ?? 0

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
                "group relative flex items-center gap-2 rounded-lg border px-2 py-1.5 cursor-pointer transition-colors select-none overflow-hidden",
                isDragging && "opacity-40",
                isOver && "ring-2 ring-ring/40 ring-offset-0",
                isSelected
                  ? "border-ring/50 bg-accent"
                  : "border-border/70 bg-card hover:border-muted-foreground/40 hover:bg-muted/30",
              )}
            >
              {/* Selection wire — same lime rule used across the app */}
              {isSelected && (
                <span className="absolute left-0 inset-y-1 w-0.5 bg-primary rounded-r-full" />
              )}
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 cursor-grab shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-foreground truncate">{item.label}</div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground/70 truncate">
                  <Clock className="h-2.5 w-2.5 shrink-0" />
                  {start.toFixed(2)}s · {item.duration.toFixed(2)}s
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const newId = duplicateItem(item.id)
                    if (newId) setSelectedItem(newId)
                  }}
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted/70 text-muted-foreground hover:text-foreground"
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
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
