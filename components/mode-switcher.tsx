"use client"

import { Type, ListVideo } from "lucide-react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { cn } from "@/lib/utils"

const chipBase =
  "relative z-10 flex min-w-0 items-center justify-center gap-1.5 px-3 py-2 rounded-md cursor-pointer text-xs transition-colors duration-200 [&>svg]:transition-colors"
const chipIdle = "text-muted-foreground hover:text-foreground"
const chipActive = "text-foreground font-semibold [&>svg]:text-ring"

export default function ModeSwitcher() {
  const activeMode = usePlaygroundStore((s) => s.activeMode)
  const setActiveMode = usePlaygroundStore((s) => s.setActiveMode)

  return (
    <div
      role="group"
      aria-label="Workspace mode"
      className="relative grid grid-cols-2 items-center gap-1 bg-background/60 border border-border rounded-lg p-1 overflow-hidden"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-md border border-ring/35 bg-popover transition-transform duration-200 ease-[var(--ease-out-soft)]"
        style={{
          width: "calc((100% - 0.75rem) / 2)",
          transform: activeMode === "timeline" ? "translateX(calc(100% + 0.25rem))" : "translateX(0)",
        }}
      />
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
