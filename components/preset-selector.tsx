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

const categoryAccent: Record<string, string> = {
  entrance: "from-violet-500/15 to-violet-500/0",
  emphasis: "from-amber-500/15 to-amber-500/0",
  "3d": "from-cyan-500/15 to-cyan-500/0",
  text: "from-pink-500/15 to-pink-500/0",
  creative: "from-emerald-500/15 to-emerald-500/0",
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
            "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          All
        </button>
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
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
          const accent = categoryAccent[preset.category] ?? "from-primary/10 to-transparent"
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={cn(
                "group relative text-left rounded-lg border p-2.5 overflow-hidden transition-all duration-150",
                "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm",
                isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border bg-card"
              )}
            >
              <div className={cn(
                "absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-0 transition-opacity",
                accent,
                isActive ? "opacity-100" : "group-hover:opacity-60"
              )} />
              <div className="flex items-start justify-between gap-1.5">
                <p className={cn(
                  "text-xs font-semibold leading-tight",
                  isActive ? "text-primary" : "text-foreground"
                )}>
                  {preset.name}
                </p>
                {isActive ? (
                  <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />
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
