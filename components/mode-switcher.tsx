"use client"

import { Type, ListVideo } from "lucide-react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { cn } from "@/lib/utils"

const chipBase =
  "flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer text-xs transition-all duration-150 [&>svg]:transition-colors"
const chipIdle = "bg-card/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
const chipActive =
  "bg-popover text-foreground font-semibold shadow-md ring-1 ring-primary/25 [&>svg]:text-ring"

export default function ModeSwitcher() {
  const activeMode = usePlaygroundStore((s) => s.activeMode)
  const setActiveMode = usePlaygroundStore((s) => s.setActiveMode)

  return (
    <div
      role="group"
      aria-label="Workspace mode"
      className="inline-flex items-center gap-1 bg-background/60 border border-border/60 rounded-xl p-1"
    >
      <button
        onClick={() => setActiveMode("text")}
        title="Text animation workspace"
        aria-pressed={activeMode === "text"}
        className={cn(chipBase, activeMode === "text" ? chipActive : chipIdle)}
      >
        <Type className="h-3.5 w-3.5" />
        Text Animation
      </button>
      <button
        onClick={() => setActiveMode("timeline")}
        title="Timeline sequence workspace"
        aria-pressed={activeMode === "timeline"}
        className={cn(chipBase, activeMode === "timeline" ? chipActive : chipIdle)}
      >
        <ListVideo className="h-3.5 w-3.5" />
        Timeline Animation
      </button>
    </div>
  )
}
