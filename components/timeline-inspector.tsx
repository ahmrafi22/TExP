"use client"

import { useMemo } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import TimelineItemEditor from "@/components/timeline-item-editor"
import { Button } from "@/components/ui/button"

export default function TimelineInspector() {
  const project = useTimelineProjectStore((s) => s.project)
  const updateItem = useTimelineProjectStore((s) => s.updateItem)
  const selectedItemId = useTimelineUiStore((s) => s.selectedItemId)
  const setSelectedItem = useTimelineUiStore((s) => s.setSelectedItem)

  const item = useMemo(
    () => project.items.find((i) => i.id === selectedItemId) ?? null,
    [project.items, selectedItemId],
  )

  if (!item) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="px-3 py-2 border-b border-border flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">Inspector</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-[11px] text-muted-foreground/70 text-center leading-relaxed">
            Select a track or block on the timeline to edit its animation, split and timing.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground truncate">{item.label}</span>
        </div>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setSelectedItem(null)} title="Deselect">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <TimelineItemEditor
          item={item}
          labels={project.labels}
          onChange={(patch) => updateItem(item.id, patch)}
        />
      </div>
    </div>
  )
}
