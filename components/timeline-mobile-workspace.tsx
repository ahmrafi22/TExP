"use client"

import { Layers, Plus, SlidersHorizontal, Wand2 } from "lucide-react"
import TimelineAddDialog from "@/components/timeline-add-dialog"
import TimelineInspector from "@/components/timeline-inspector"
import TimelinePresetsPanel from "@/components/timeline-presets-panel"
import TimelineSettingsPanel from "@/components/timeline-settings-panel"
import TimelineTrackList from "@/components/timeline-track-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const triggerClass =
  "h-9 gap-1.5 rounded-md border border-transparent text-[11px] text-muted-foreground data-[state=active]:border-muted-foreground/40 data-[state=active]:wash-12 data-[state=active]:text-foreground"

export default function TimelineMobileWorkspace() {
  return (
    <Tabs defaultValue="tracks" className="flex min-h-0 flex-1 flex-col">
      <TabsList className="mx-4 mt-3 grid h-auto grid-cols-3 gap-1 rounded-lg border border-border bg-muted/25 p-1">
        <TabsTrigger value="tracks" className={triggerClass}>
          <Layers className="h-3.5 w-3.5" /> Tracks
        </TabsTrigger>
        <TabsTrigger value="presets" className={triggerClass}>
          <Wand2 className="h-3.5 w-3.5" /> Presets
        </TabsTrigger>
        <TabsTrigger value="inspector" className={triggerClass}>
          <SlidersHorizontal className="h-3.5 w-3.5" /> Inspector
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tracks" className="mt-3 min-h-0 flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col">
        <TimelineTrackList
          action={
            <TimelineAddDialog
              trigger={
                <button
                  title="Add animation"
                  aria-label="Add animation"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground wash-5 transition-colors hover:border-muted-foreground/50 hover:text-foreground hover:wash-9"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              }
            />
          }
          footer={<TimelineSettingsPanel />}
        />
      </TabsContent>

      <TabsContent value="presets" className="mt-3 min-h-0 flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        <TimelinePresetsPanel />
      </TabsContent>

      <TabsContent value="inspector" className="mt-3 min-h-0 flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col">
        <TimelineInspector />
      </TabsContent>
    </Tabs>
  )
}
