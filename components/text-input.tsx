"use client"

import { Input } from "@/components/ui/input"
import { Type } from "lucide-react"

interface TextInputProps {
  text: string
  onChange: (text: string) => void
}

export default function TextInput({ text, onChange }: TextInputProps) {
  return (
    <div className="relative">
      <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter animation text..."
        className="pl-9 h-10 text-sm bg-background border-border focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  )
}
