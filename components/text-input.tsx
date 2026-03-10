"use client"

import { Type } from "lucide-react"
import { usePlaygroundStore } from "@/store/use-playground-store"

export default function TextInput() {
  const text = usePlaygroundStore((s) => s.text)
  const setText = usePlaygroundStore((s) => s.setText)

  return (
    <div className="flex items-center gap-2 h-9 px-3 bg-muted/30 border border-gray-600 rounded-full hover:border-gray-600 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <Type className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter animation text..."
        className="flex-1 bg-transparent text-sm text-center focus:outline-none placeholder:text-muted-foreground/50 "
      />
      <div className="h-3.5 w-3.5 shrink-0" />
    </div>
  )
}
