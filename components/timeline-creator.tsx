"use client"

import { useEffect } from "react"
import { useTimelineUiStore } from "@/store/use-timeline-store"
import TimelinePreview from "@/components/timeline-preview"
import TimelineRuler from "@/components/timeline-ruler"
import TimelineTrackList from "@/components/timeline-track-list"
import TimelineInspector from "@/components/timeline-inspector"
import TimelineSettingsPanel from "@/components/timeline-settings-panel"
import TimelineAddDialog from "@/components/timeline-add-dialog"
import { useTimelineProjectStore } from "@/store/use-timeline-store"

export default function TimelineCreator() {
  const setSelectedItem = useTimelineUiStore((s) => s.setSelectedItem)

  // Delete removes / Ctrl+D duplicates the selected item (guard: not typing in an input)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return
      if ((e.key === "Delete" || e.key === "Backspace") && !e.metaKey && !e.ctrlKey) {
        const sel = useTimelineUiStore.getState().selectedItemId
        if (sel) {
          useTimelineProjectStore.getState().removeItem(sel)
          setSelectedItem(null)
        }
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "d" || e.key === "D")) {
        e.preventDefault()
        const sel = useTimelineUiStore.getState().selectedItemId
        if (sel) {
          const newId = useTimelineProjectStore.getState().duplicateItem(sel)
          if (newId) setSelectedItem(newId)
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setSelectedItem])

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Left panel: add + tracks + settings */}
      <div className="hidden md:flex w-[280px] min-w-[280px] border-r border-border bg-card flex-col">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <TimelineAddDialog />
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <TimelineTrackList />
          </div>
          <div className="h-[240px] min-h-[180px] border-t border-border">
            <TimelineSettingsPanel />
          </div>
        </div>
      </div>

      {/* Center: preview + ruler */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <div className="flex-1 min-h-0 p-4 pb-2">
          <TimelinePreview />
        </div>
        <div className="h-[240px] min-h-[200px] border-t border-border bg-card">
          <TimelineRuler />
        </div>
      </div>

      {/* Right: inspector */}
      <div className="hidden lg:flex w-[340px] min-w-[340px] border-l border-border bg-card flex-col">
        <TimelineInspector />
      </div>
    </div>
  )
}
