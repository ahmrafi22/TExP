"use client"

import { useMemo, useState } from "react"
import { Check, Play } from "lucide-react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import {
  TIMELINE_PRESETS,
  TIMELINE_PRESET_CATEGORY_LABELS,
  TIMELINE_PRESET_CATEGORY_ORDER,
  buildPresetProject,
} from "@/lib/timeline-presets"
import { cn } from "@/lib/utils"

/**
 * Sequence preset browser for the Timeline Creator. Mirrors the Text-mode
 * preset selector (category pills + 2-up card grid, accent wire, check/play
 * affordance) so both modes read as one product; the only addition is the
 * layer count, which is meaningful here because a preset is a whole sequence.
 */
export default function TimelinePresetsPanel() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [appliedId, setAppliedId] = useState<string | null>(null)

  const loadProject = useTimelineProjectStore((s) => s.loadProject)
  const setSelectedItem = useTimelineUiStore((s) => s.setSelectedItem)
  const setIsPlaying = useTimelineUiStore((s) => s.setIsPlaying)
  const requestAutoplay = useTimelineUiStore((s) => s.requestAutoplay)

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? TIMELINE_PRESETS
        : TIMELINE_PRESETS.filter((p) => p.category === activeCategory),
    [activeCategory],
  )

  const apply = (id: string) => {
    const preset = TIMELINE_PRESETS.find((p) => p.id === id)
    if (!preset) return
    setSelectedItem(null)
    setIsPlaying(false)
    loadProject(buildPresetProject(preset))
    // Play immediately once the preview rebuilds, like clicking a text preset.
    requestAutoplay()
    setAppliedId(id)
  }

  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-2.5 h-6 inline-flex items-center rounded-md border text-[11px] font-medium transition-colors",
            activeCategory === "all"
              ? "border-ring bg-primary/10 text-ring"
              : "border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/40",
          )}
        >
          All
        </button>
        {TIMELINE_PRESET_CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-2.5 h-6 inline-flex items-center rounded-md border text-[11px] font-medium transition-colors",
              activeCategory === cat
                ? "border-ring bg-primary/10 text-ring"
                : "border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/40",
            )}
          >
            {TIMELINE_PRESET_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((preset) => {
          const isApplied = appliedId === preset.id
          return (
            <button
              key={preset.id}
              onClick={() => apply(preset.id)}
              className={cn(
                "group relative text-left rounded-lg border p-2.5 overflow-hidden transition-colors duration-150",
                isApplied
                  ? "border-ring bg-accent ring-1 ring-ring/40"
                  : "border-border wash-5 hover:wash-9 hover:border-muted-foreground/40",
              )}
            >
              {/* Live wire: the accent rule marks the applied preset only */}
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-0.5 bg-primary transition-opacity",
                  isApplied ? "opacity-100" : "opacity-0 group-hover:opacity-30",
                )}
              />
              <div className="flex items-start justify-between gap-1.5">
                <p className="text-xs font-semibold leading-tight text-foreground">{preset.name}</p>
                {isApplied ? (
                  <Check className="h-3 w-3 text-ring shrink-0 mt-0.5" />
                ) : (
                  <Play className="h-2.5 w-2.5 text-muted-foreground/0 group-hover:text-muted-foreground/60 shrink-0 mt-0.5 transition-colors" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                {preset.description}
              </p>
              <p className="text-[9px] font-mono uppercase tracking-[0.08em] text-muted-foreground/60 mt-1.5">
                {preset.items.length} layers
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}