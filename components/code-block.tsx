"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  label: string
  icon: React.ReactNode
  code: string
  fileBadge?: string
}

export default function CodeBlock({ label, icon, code, fileBadge }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear the "Copied" reset timer on unmount to avoid a stray state update
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const copy = () => {
    const onDone = () => {
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(onDone).catch(() => {
        // Clipboard unavailable/denied (e.g. insecure context) — no-op feedback
      })
    }
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {fileBadge && <span className="text-[10px] font-mono text-muted-foreground/70">{fileBadge}</span>}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs gap-1.5"
            onClick={copy}
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5 text-ring" /> Copied</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy</>
            )}
          </Button>
        </div>
      </div>
      <pre className="code-panel p-4 text-sm overflow-auto max-h-[350px] min-h-[200px] custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  )
}
