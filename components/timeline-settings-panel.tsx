"use client"

import { useState } from "react"
import { Flag, Plus, Trash2, Repeat, MoveVertical } from "lucide-react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import { SliderField } from "@/components/animation-controls"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function TimelineSettingsPanel() {
  const project = useTimelineProjectStore((s) => s.project)
  const addLabel = useTimelineProjectStore((s) => s.addLabel)
  const removeLabel = useTimelineProjectStore((s) => s.removeLabel)
  const updateLabel = useTimelineProjectStore((s) => s.updateLabel)
  const updateSettings = useTimelineProjectStore((s) => s.updateSettings)

  const currentTime = useTimelineUiStore((s) => s.currentTime)

  const [labelName, setLabelName] = useState("")

  const handleAddLabel = () => {
    addLabel(labelName.trim() || `Label ${project.labels.length + 1}`, Math.round(currentTime * 100) / 100)
    setLabelName("")
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">Timeline Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
        {/* Playback settings */}
        <div className="space-y-4">
          <SliderField
            label="Repeat"
            value={project.repeat}
            min={-1}
            max={20}
            step={1}
            onChange={(n) => updateSettings({ repeat: Math.round(n) })}
            suffix="-1 = ∞"
          />
          <SliderField
            label="Repeat Delay"
            value={project.repeatDelay}
            min={0}
            max={10}
            step={0.1}
            onChange={(n) => updateSettings({ repeatDelay: n })}
            suffix="s"
          />
          <div className="flex items-center justify-between h-9 px-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all">
            <Label htmlFor="tl-yoyo" className="text-[11px] font-medium text-muted-foreground cursor-pointer">Yoyo Loop</Label>
            <Switch
              id="tl-yoyo"
              checked={project.yoyo}
              onCheckedChange={(c) => updateSettings({ yoyo: c })}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Labels */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Flag className="h-3.5 w-3.5 text-warning" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">Labels</span>
          </div>

          <div className="flex gap-1.5">
            <Input
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              placeholder={`Add label at ${currentTime.toFixed(2)}s`}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddLabel() }}
              className="h-8 text-xs bg-muted/40 border-border/80 focus-visible:ring-primary/40 flex-1"
            />
            <Button
              onClick={handleAddLabel}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              title="Add label at current playhead"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {project.labels.length === 0 && (
            <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
              Labels are markers you can attach animations to via "At Label" positioning.
            </p>
          )}

          <div className="space-y-1.5">
            {project.labels.map((label) => (
              <div key={label.id} className="flex items-center gap-2 bg-muted/30 border border-border/70 rounded-lg px-2 py-1.5">
                <MoveVertical className="h-3 w-3 text-warning shrink-0" />
                <input
                  value={label.name}
                  onChange={(e) => updateLabel(label.id, { name: e.target.value })}
                  className="flex-1 min-w-0 bg-transparent text-[11px] font-medium focus:outline-none text-foreground"
                />
                <input
                  type="number"
                  step={0.1}
                  value={label.time}
                  onChange={(e) => updateLabel(label.id, { time: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-16 h-6 text-center font-mono text-[10px] bg-background border border-border/70 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[9px] font-mono text-muted-foreground">s</span>
                <button
                  onClick={() => removeLabel(label.id)}
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  title="Remove label"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
