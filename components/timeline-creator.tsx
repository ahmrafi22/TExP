"use client"

import { useEffect, useState } from "react"
import { Layers, Plus, Wand2 } from "lucide-react"
import { useTimelineUiStore, useTimelineProjectStore } from "@/store/use-timeline-store"
import TimelinePreview from "@/components/timeline-preview"
import TimelineTrackList from "@/components/timeline-track-list"
import TimelineInspector from "@/components/timeline-inspector"
import TimelineSettingsPanel from "@/components/timeline-settings-panel"
import TimelineAddDialog from "@/components/timeline-add-dialog"
import TimelinePresetsPanel from "@/components/timeline-presets-panel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

/**
 * Timeline workspace. The left sidebar mirrors Text mode: a 32px vertical
 * icon rail with one panel per item (Tracks / Presets). Playback + label
 * settings live at the bottom of the Tracks panel — no separate settings tab.
 */
export default function TimelineCreator() {
  const setSelectedItem = useTimelineUiStore((s) => s.setSelectedItem)
  const [panel, setPanel] = useState("tracks")

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

  const railTrigger = "h-7 w-7 p-0 rounded-md cursor-pointer text-muted-foreground wash-5 transition-all duration-150 hover:wash-9 hover:text-foreground data-[state=active]:bg-popover data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/25"

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Left Sidebar — vertical icon rail + Tracks / Presets panels */}
      <div className="hidden md:flex w-[280px] min-w-[280px] border-r border-border bg-card flex-row">
        <Tabs value={panel} onValueChange={setPanel} className="flex flex-row flex-1 min-h-0 w-full">
          <div className="w-8 min-w-8 shrink-0 border-r border-border/60 bg-background/60 flex flex-col items-center gap-1 py-2">
            <TabsList className="flex flex-col items-center gap-1 w-auto h-auto p-0 bg-transparent rounded-none">
              <TabsTrigger value="tracks" title="Tracks panel" aria-label="Tracks" className={railTrigger}>
                <Layers className="h-3.5 w-3.5" />
              </TabsTrigger>
              <TabsTrigger value="presets" title="Sequence presets" aria-label="Presets" className={railTrigger}>
                <Wand2 className="h-3.5 w-3.5" />
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 min-w-0 min-h-0 overflow-hidden flex flex-col">
            <TabsContent value="tracks" className="h-full m-0 data-[state=active]:flex flex-col overflow-hidden">
              <TimelineTrackList
                action={
                  <TimelineAddDialog
                    trigger={
                      <button
                        title="Add animation"
                        aria-label="Add animation"
                        className="h-6 w-6 flex items-center justify-center rounded-md border border-border wash-5 text-muted-foreground hover:wash-9 hover:border-muted-foreground/40 hover:text-foreground transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    }
                  />
                }
                footer={<TimelineSettingsPanel />}
              />
            </TabsContent>
            <TabsContent value="presets" className="h-full m-0 data-[state=active]:flex flex-col overflow-hidden">
              <div className="px-3 py-2 border-b border-border shrink-0 flex items-center gap-2">
                <Wand2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">Presets</span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 py-4">
                <TimelinePresetsPanel />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Center: preview — the DialKit dock below is the timeline */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <div className="flex-1 min-h-0 p-4">
          <TimelinePreview />
        </div>
      </div>

      {/* Right: inspector */}
      <div className="hidden lg:flex w-[340px] min-w-[340px] border-l border-border bg-card flex-col">
        <TimelineInspector />
      </div>
    </div>
  )
}
