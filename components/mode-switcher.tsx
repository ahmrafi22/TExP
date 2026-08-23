"use client"

import { Type, ListVideo } from "lucide-react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { cn } from "@/lib/utils"

const chipBase =
  "flex items-center gap-1.5 px-3 py-2 rounded-md border cursor-pointer text-xs transition-colors duration-150 [&>svg]:transition-colors"
const chipIdle = "border-border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground hover:border-muted-foreground/40"
const chipActive =
  "bg-card text-foreground font-semibold border-ring/70 shadow-[inset_0_-2px_0_0_var(--primary)] [&>svg]:text-ring"

export default function ModeSwitcher() {
  const activeMode = usePlaygroundStore((s) => s.activeMode)
  const setActiveMode = usePlaygroundStore((s) => s.setActiveMode)

  return (
    <div
      role="group"
      aria-label="Workspace mode"
      className="inline-flex items-center gap-1 bg-muted/25 border border-ring/45 rounded-lg p-1 shadow-[inset_0_1px_0_0_var(--card)]"
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
