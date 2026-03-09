"use client"

import { Type } from "lucide-react"

interface TextInputProps {
  text: string
  onChange: (text: string) => void
}

export default function TextInput({ text, onChange }: TextInputProps) {
  return (
    <div className="flex items-center gap-2 h-9 px-3 bg-muted/30 border border-border/60 rounded-full hover:border-border focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <Type className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <input
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter animation text..."
        className="flex-1 bg-transparent text-sm text-center focus:outline-none placeholder:text-muted-foreground/50"
      />
      <div className="h-3.5 w-3.5 shrink-0" />
    </div>
  )
}
