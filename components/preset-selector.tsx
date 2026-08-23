"use client"

import { useState, type RefObject } from "react"
import { ANIMATION_PRESETS, PRESET_CATEGORIES } from "@/lib/presets"
import { cn } from "@/lib/utils"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"
import type { PreviewCanvasRef } from "@/components/preview-canvas"
import { Play, Check } from "lucide-react"

interface PresetSelectorProps {
  canvasRef: RefObject<PreviewCanvasRef | null>
}

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
      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          All
        </button>
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((preset) => {
          const isActive = activePresetId === preset.id
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={cn(
                "group relative text-left rounded-md border p-2.5 overflow-hidden transition-colors duration-150",
                "hover:border-muted-foreground/40",
                isActive
                  ? "border-ring bg-accent ring-1 ring-ring/40"
                  : "border-border bg-card"
              )}
            >
              {/* Live wire: the accent rule marks the selected preset only */}
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-0.5 bg-primary transition-opacity",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                )}
              />
              <div className="flex items-start justify-between gap-1.5">
                <p className={cn(
                  "text-xs font-semibold leading-tight",
                  isActive ? "text-foreground" : "text-foreground"
                )}>
                  {preset.name}
                </p>
                {isActive ? (
                  <Check className="h-3 w-3 text-ring shrink-0 mt-0.5" />
                ) : (
                  <Play className="h-2.5 w-2.5 text-muted-foreground/0 group-hover:text-muted-foreground/60 shrink-0 mt-0.5 transition-colors" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                {preset.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
