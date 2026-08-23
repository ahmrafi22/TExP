"use client"

import React, { useEffect, useState } from "react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { History, Undo2, Redo2, RotateCcw, Clock, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header controls */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center">
            <History className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider">Action History</h3>
            <p className="text-[10px] text-muted-foreground">{history.length} recorded actions</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="h-7 w-7 p-0"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="h-7 w-7 p-0"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="h-7 px-2 text-[10px] text-muted-foreground hover:text-destructive"
            title="Clear history"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* History Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            No history recorded yet.
          </div>
        ) : (
          history.map((entry, index) => {
            const isCurrent = index === historyIndex
            const timeStr = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

            return (
              <div
                key={entry.id}
                onClick={() => jumpToHistory(index)}
                className={`group relative flex items-start gap-3 p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-accent border-ring/50 text-foreground"
                    : "bg-background/40 border-border/60 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Active indicator bar */}
                {isCurrent && (
                  <div className="absolute left-0 inset-y-1 w-1 bg-primary rounded-r-full" />
                )}

                <div className="mt-0.5 shrink-0">
                  {isCurrent ? (
                    <CheckCircle2 className="h-4 w-4 text-ring" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-medium truncate ${isCurrent ? "font-semibold" : ""}`}>
                      {entry.label}
                    </span>
                    <span className="text-[10px] opacity-50 shrink-0 font-mono">
                      {mounted ? timeStr : "--:--:--"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground truncate max-w-[180px]">
                      Text: "{entry.state.text}"
                    </span>
                    {entry.state.splitTextConfig.enabled && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                        Split: {entry.state.splitTextConfig.type}
                      </Badge>
                    )}
                  </div>
                </div>

                {!isCurrent && (
                  <div className="opacity-0 group-hover:opacity-100 self-center transition-opacity">
                    <ArrowRight className="h-3.5 w-3.5 text-ring" />
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <div className="p-3 border-t border-border bg-muted/20 text-center">
        <p className="text-[11px] text-muted-foreground">
          Click any action to jump instantly to that state.
        </p>
      </div>
    </div>
  )
}
