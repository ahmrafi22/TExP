"use client"

import { useState } from "react"
import { Flag, Plus, Trash2, Settings2 } from "lucide-react"
import { useTimelineProjectStore, useTimelineUiStore } from "@/store/use-timeline-store"
import { SliderField, ToggleField } from "@/components/dial-controls"
import { Input } from "@/components/ui/input"
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
    <>
      {/* Playback settings */}
      <div className="px-1 pt-3 pb-2 flex items-center gap-2">
        <Settings2 className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">Playback</span>
      </div>
      <div className="flex flex-col gap-1.5">
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
          <ToggleField label="Yoyo Loop" checked={project.yoyo} onChange={(c) => updateSettings({ yoyo: c })} />
        </div>

        {/* Labels */}
        <div className="px-1 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="h-3 w-3 text-warning" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">Labels</span>
          </div>
          <span className="h-4 min-w-4 px-1 rounded-full wash-5 border border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-center tnum">
            {project.labels.length}
          </span>
        </div>

        <div>
          <div className="flex gap-1.5">
            <Input
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              placeholder={`Add label at ${currentTime.toFixed(2)}s`}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddLabel() }}
              className="h-8 text-xs wash-5 border-border/80 focus-visible:ring-primary/40 flex-1"
            />
            <Button
              onClick={handleAddLabel}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 shrink-0"
              title="Add label at current playhead"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {project.labels.length === 0 ? (
            <p className="text-[10px] text-muted-foreground/60 leading-relaxed mt-2 px-0.5">
              Labels are markers you can attach animations to via <span className="font-mono">At Label</span> positioning.
            </p>
          ) : (
            <div className="mt-2 flex flex-col gap-1.5">
              {project.labels.map((label) => (
                <div key={label.id} className="group flex items-center gap-1.5 rounded-md px-1.5 h-8 wash-5 hover:wash-9 transition-colors duration-150">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[3px] bg-warning/30 border border-warning/70" aria-hidden />
                  <input
                    value={label.name}
                    onChange={(e) => updateLabel(label.id, { name: e.target.value })}
                    className="flex-1 min-w-0 bg-transparent text-xs font-medium focus:outline-none text-foreground"
                  />
                  <input
                    type="number"
                    step={0.1}
                    value={label.time}
                    onChange={(e) => updateLabel(label.id, { time: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-14 h-6 text-center font-mono text-[10px] wash-5 border border-border/70 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/40 tnum [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[9px] font-mono text-muted-foreground/60 shrink-0">s</span>
                  <button
                    onClick={() => removeLabel(label.id)}
                    className="h-6 w-6 shrink-0 flex items-center justify-center rounded text-muted-foreground/70 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                    title="Remove label"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
    </>
  )
}
