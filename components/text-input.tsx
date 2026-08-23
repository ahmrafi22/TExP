"use client"

import { Type, X } from "lucide-react"
import { usePlaygroundStore } from "@/store/use-playground-store"

export default function TextInput() {
  const text = usePlaygroundStore((s) => s.text)
  const setText = usePlaygroundStore((s) => s.setText)

  return (
    <div className="group flex items-center gap-2 h-9 px-3 bg-card/95 border border-border rounded-full shadow-float backdrop-blur-md hover:border-muted-foreground/40 focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/25 focus-within:bg-background transition-colors">
      <Type className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter animation text..."
        className="flex-1 min-w-0 bg-transparent text-sm text-center focus:outline-none placeholder:text-muted-foreground/50"
      />
      {text ? (
        <button
          onClick={() => setText("")}
          aria-label="Clear text"
          className="h-5 w-5 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted-foreground/10 flex items-center justify-center transition-colors shrink-0"
        >
          <X className="h-3 w-3" />
        </button>
      ) : (
        <div className="h-5 w-5 shrink-0" />
      )}
    </div>
  )
}
