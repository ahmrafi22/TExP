"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Check, Wand2 } from "lucide-react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import TimelineItemEditor from "@/components/timeline-item-editor"
import { ANIMATION_PRESETS } from "@/lib/presets"
import {
  defaultAnimationConfig,
  defaultSplitTextConfig,
} from "@/store/use-playground-store"
import type { TimelineItem } from "@/types/timeline"
import { cn } from "@/lib/utils"

function draftItem(): TimelineItem {
  return {
    id: "draft",
    label: "New Animation",
    text: "Hello GSAP!",
    animation: JSON.parse(JSON.stringify(defaultAnimationConfig)),
    splitTextConfig: JSON.parse(JSON.stringify(defaultSplitTextConfig)),
    duration: 1,
    position: { type: "afterPrevious", offset: 0 },
    order: 0,
  }
}

export default function TimelineAddDialog() {
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState<TimelineItem>(draftItem)

  const project = useTimelineProjectStore((s) => s.project)
  const addItem = useTimelineProjectStore((s) => s.addItem)
  const setSelectedItem = useTimelineUiStore((s) => s.setSelectedItem)

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (o) setItem(draftItem())
  }

  const applyPreset = (id: string) => {
    const preset = ANIMATION_PRESETS.find((p) => p.id === id)
    if (!preset) return
    setItem((prev) => ({
      ...prev,
      label: preset.name,
      animation: {
        ...JSON.parse(JSON.stringify(defaultAnimationConfig)),
        ...JSON.parse(JSON.stringify(preset.animationConfig)),
        customStyles: {
          ...prev.animation.customStyles,
          ...(preset.animationConfig.customStyles ?? {}),
        },
      },
      splitTextConfig: {
        enabled: preset.splitTextConfig.enabled ?? false,
        type: preset.splitTextConfig.type ?? "chars",
        stagger: preset.splitTextConfig.stagger ?? 0.1,
        staggerFrom: preset.splitTextConfig.staggerFrom ?? "start",
      },
    }))
  }

  const handleAdd = () => {
    if (!item.text.trim()) return
    const id = addItem({
      label: item.label || item.text.slice(0, 24),
      text: item.text,
      animation: item.animation,
      splitTextConfig: item.splitTextConfig,
      duration: item.duration,
      position: item.position,
      ease: item.ease,
    })
    setSelectedItem(id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Animation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4 text-ring" />
            Add Animation to Timeline
          </DialogTitle>
        </DialogHeader>

        {/* Quick preset chips */}
        <div className="mt-2 mb-4">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2 flex items-center gap-1.5">
            <Wand2 className="h-3 w-3" />
            Quick presets
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ANIMATION_PRESETS.slice(0, 12).map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-medium border transition-colors",
                  item.label === preset.name
                    ? "border-ring bg-primary/10 text-ring"
                    : "border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/40",
                )}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <TimelineItemEditor item={item} labels={project.labels} onChange={(patch) => setItem((prev) => ({ ...prev, ...patch }))} />

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-6">
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleAdd} disabled={!item.text.trim()}>
            <Check className="h-3.5 w-3.5" />
            Add to Timeline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
