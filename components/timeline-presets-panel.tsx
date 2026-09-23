"use client"

import { useMemo, useState } from "react"
import { Play } from "lucide-react"
import { motion } from "motion/react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import {
  TIMELINE_PRESETS,
  TIMELINE_PRESET_CATEGORY_LABELS,
  TIMELINE_PRESET_CATEGORY_ORDER,
  buildPresetProject,
} from "@/lib/timeline-presets"
import { cn } from "@/lib/utils"


/** Sequence preset browser shared visually with Text-mode recipes. */
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
      <div className="grid grid-cols-3 gap-1 rounded-md border border-border p-1 wash-5" role="group" aria-label="Sequence preset category filter">
          <button
            onClick={() => setActiveCategory("all")}
            aria-pressed={activeCategory === "all"}
            className={cn(
              "relative isolate h-7 px-2 rounded-sm border border-transparent text-[10px] font-mono font-semibold uppercase tracking-[0.06em] transition-colors",
              activeCategory === "all"
                ? "text-foreground"
                : "text-muted-foreground hover:wash-9 hover:text-foreground",
            )}
          >
            {activeCategory === "all" && (
              <motion.span
                layoutId="timeline-preset-category"
                className="absolute inset-0 z-0 rounded-sm border border-muted-foreground/35 wash-12"
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              />
            )}
            <span className="relative z-10">All {TIMELINE_PRESETS.length}</span>
          </button>
          {TIMELINE_PRESET_CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={cn(
                "relative isolate h-7 px-2 rounded-sm border border-transparent text-[10px] font-medium transition-colors",
                activeCategory === cat
                  ? "text-foreground"
                  : "text-muted-foreground hover:wash-9 hover:text-foreground",
              )}
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="timeline-preset-category"
                  className="absolute inset-0 z-0 rounded-sm border border-muted-foreground/35 wash-12"
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                />
              )}
              <span className="relative z-10">{TIMELINE_PRESET_CATEGORY_LABELS[cat]}</span>
            </button>
          ))}
      </div>

      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {activeCategory === "all" ? "All sequences" : TIMELINE_PRESET_CATEGORY_LABELS[activeCategory as keyof typeof TIMELINE_PRESET_CATEGORY_LABELS]}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground tnum">{filtered.length} shown</span>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {filtered.map((preset) => {
          const isApplied = appliedId === preset.id
          return (
            <button
              key={preset.id}
              onClick={() => apply(preset.id)}
              aria-pressed={isApplied}
              className={cn(
                "group relative flex h-10 items-center overflow-hidden rounded-md border px-2.5 pr-10 text-left transition-colors duration-150",
                isApplied
                  ? "border-muted-foreground/55 wash-12 ring-1 ring-inset ring-border"
                  : "border-border wash-5 hover:wash-9 hover:border-muted-foreground/50",
              )}
            >

              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold leading-tight text-foreground">{preset.name}</span>
                <span className="mt-0.5 block truncate text-[10px] leading-tight text-muted-foreground">
                  {preset.description}
                </span>
              </span>
              {isApplied && (
                <span className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-full border border-muted-foreground/40 text-foreground">
                  <Play className="h-2.5 w-2.5 fill-current" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}