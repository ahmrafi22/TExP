"use client"

import { useState } from "react"
import { ANIMATION_PRESETS, PRESET_CATEGORIES } from "@/lib/presets"
import { cn } from "@/lib/utils"

interface PresetSelectorProps {
  activePresetId: string | null
  onSelectPreset: (presetId: string) => void
}

export default function PresetSelector({ activePresetId, onSelectPreset }: PresetSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

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
            "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          All
        </button>
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset.id)}
            className={cn(
              "group relative text-left rounded-lg border p-2.5 transition-all duration-150",
              "hover:border-primary/50 hover:bg-primary/5",
              activePresetId === preset.id
                ? "border-primary bg-primary/10 ring-1 ring-primary/20"
                : "border-border bg-card"
            )}
          >
            <p className={cn(
              "text-xs font-semibold leading-tight",
              activePresetId === preset.id ? "text-primary" : "text-foreground"
            )}>
              {preset.name}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              {preset.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
