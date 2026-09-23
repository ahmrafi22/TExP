"use client"

import { useState, type RefObject } from "react"
import { ANIMATION_PRESETS, PRESET_CATEGORIES } from "@/lib/presets"
import { cn } from "@/lib/utils"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"
import type { PreviewCanvasRef } from "@/components/preview-canvas"
import { Play } from "lucide-react"
import { motion } from "motion/react"

interface PresetSelectorProps {
  canvasRef: RefObject<PreviewCanvasRef | null>
}


const categoryLabel = (category: string) =>
  PRESET_CATEGORIES.find((item) => item.id === category)?.label ?? category

export default function PresetSelector({ canvasRef }: PresetSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const { activePresetId, applyPreset } = usePlaygroundStore(
    useShallow((s) => ({
      activePresetId: s.activePresetId,
      applyPreset: s.applyPreset,
    })),
  )

  const handleSelectPreset = (presetId: string) => {
    applyPreset(presetId)
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.resetAnimation()
        setTimeout(() => {
          canvasRef.current?.playAnimation()
        }, 50)
      }
    }, 50)
  }

  const filtered = activeCategory === "all"
    ? ANIMATION_PRESETS
    : ANIMATION_PRESETS.filter((p) => p.category === activeCategory)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1 rounded-md border border-border p-1 wash-5" role="group" aria-label="Preset category filter">
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
                layoutId="text-preset-category"
                className="absolute inset-0 z-0 rounded-sm border border-muted-foreground/35 wash-12"
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              />
            )}
            <span className="relative z-10">All {ANIMATION_PRESETS.length}</span>
          </button>
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={activeCategory === cat.id}
              className={cn(
                "relative isolate h-7 px-2 rounded-sm border border-transparent text-[10px] font-medium transition-colors",
                activeCategory === cat.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:wash-9 hover:text-foreground",
              )}
            >
              {activeCategory === cat.id && (
                <motion.span
                  layoutId="text-preset-category"
                  className="absolute inset-0 z-0 rounded-sm border border-muted-foreground/35 wash-12"
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
      </div>

      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {activeCategory === "all" ? "All recipes" : categoryLabel(activeCategory)}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground tnum">{filtered.length} shown</span>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {filtered.map((preset) => {
          const isActive = activePresetId === preset.id
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              aria-pressed={isActive}
              className={cn(
                "group relative flex h-10 items-center overflow-hidden rounded-md border px-2.5 pr-10 text-left transition-colors duration-150",
                isActive
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
              {isActive && (
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
