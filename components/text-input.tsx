"use client"

import { Type, X } from "lucide-react"
import { usePlaygroundStore } from "@/store/use-playground-store"

export default function TextInput() {
  const text = usePlaygroundStore((s) => s.text)
  const setText = usePlaygroundStore((s) => s.setText)

  return (
    <div className="group flex h-10 items-center gap-2.5 rounded-lg border border-border bg-card/95 px-3 shadow-float backdrop-blur-md transition-colors hover:border-muted-foreground/50 focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/20 focus-within:bg-background">
      <Type className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Animation text"
        placeholder="Enter animation text..."
        className="flex-1 min-w-0 bg-transparent text-sm text-left focus:outline-none placeholder:text-muted-foreground/50"
      />
      {text ? (
        <button
          onClick={() => setText("")}
          aria-label="Clear text"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <X className="h-3 w-3" />
        </button>
      ) : (
        <div className="h-8 w-8 shrink-0" />
      )}
    </div>
  )
}
