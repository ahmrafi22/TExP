"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import {
  Undo2,
  Redo2,
  Trash2,
  Clock,
  Type,
  Wand2,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Pick a small icon per action family from the recorded label.
function iconForLabel(label: string) {
  if (label === "Update text") return Type
  if (label.startsWith("Apply preset")) return Wand2
  if (label.toLowerCase().includes("reset")) return RotateCcw
  return Sparkles
}

export default function HistoryPanel() {
  const history = usePlaygroundStore((s) => s.history)
  const historyIndex = usePlaygroundStore((s) => s.historyIndex)
  const undo = usePlaygroundStore((s) => s.undo)
  const redo = usePlaygroundStore((s) => s.redo)
  const jumpToHistory = usePlaygroundStore((s) => s.jumpToHistory)
  const clearHistory = usePlaygroundStore((s) => s.clearHistory)

  // Timestamps are formatted with locale/timezone — render them only after
  // mount to avoid SSR/client hydration mismatches.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Keep the current state's row visible as history grows or jumps.
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => {
    rowRefs.current[historyIndex]?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [historyIndex, history.length])

  return (
    <div className="flex flex-col h-full bg-card min-h-0">
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-border shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-foreground">History</h3>
            <span className="px-1.5 py-0.5 rounded-md wash-5 border border-border/60 text-[9px] font-mono tnum text-muted-foreground">
              {history.length}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Jump between recorded edits</p>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:wash-9"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:wash-9"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-3.5 bg-border/60 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Clear history"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Timeline list */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-3 py-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground/60">
            <Clock className="h-5 w-5" />
            <p className="text-[10px]">No actions recorded yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* spine */}
            <div className="absolute left-[14px] top-3 bottom-3 w-px bg-border/70" />
            <ul className="space-y-0.5">
              {history.map((entry, index) => {
                const isCurrent = index === historyIndex
                const isFuture = index > historyIndex
                const Icon = iconForLabel(entry.label)
                const timeStr = new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

                return (
                  <li key={entry.id} className="relative">
                    {/* node dot on the spine */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-[10px] top-1/2 -translate-y-1/2 z-10 rounded-full transition-all",
                        isCurrent
                          ? "h-[9px] w-[9px] bg-foreground ring-[3px] ring-foreground/10"
                          : "h-[5px] w-[5px] bg-muted-foreground/40",
                      )}
                    />
                    <button
                      ref={(el) => { rowRefs.current[index] = el }}
                      onClick={() => jumpToHistory(index)}
                      title={`Jump to “${entry.label}”`}
                      className={cn(
                        "group w-full min-h-11 flex items-center gap-2 pl-8 pr-2 py-1.5 rounded-md border text-left cursor-pointer transition-colors duration-150",
                        isCurrent
                          ? "border-muted-foreground/45 wash-12"
                          : "border-transparent hover:border-border hover:wash-5",
                        isFuture && "border-dashed text-muted-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-colors",
                          isCurrent ? "text-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground",
                        )}
                      />
                      <span className="flex-1 min-w-0 flex flex-col">
                        <span
                          className={cn(
                            "text-xs truncate",
                            isCurrent ? "font-semibold text-foreground" : "text-muted-foreground group-hover:text-foreground",
                          )}
                        >
                          {entry.label}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground/50 truncate">
                          “{entry.state.text}”
                        </span>
                      </span>
                      <span className="shrink-0 text-[9px] font-mono tnum text-muted-foreground/50">
                        {mounted ? timeStr : ""}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
