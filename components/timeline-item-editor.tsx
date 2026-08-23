"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles, Paintbrush, SlidersHorizontal, Crosshair } from "lucide-react"
import type { TimelineItem, TimelineProject, TimelinePosition } from "@/types/timeline"
import AnimationControls from "@/components/animation-controls"
import SplitTextControls from "@/components/split-text-controls"
import CustomCssControls from "@/components/custom-css-controls"
import { SliderField } from "@/components/animation-controls"
import { useTimelineUiStore } from "@/store/use-timeline-store"
import type { AnimationConfig, SplitTextConfig } from "@/types/animation"

const easingOptions = [
  "none", "power1.out", "power1.in", "power1.inOut",
  "power2.out", "power2.in", "power2.inOut",
  "power3.out", "power3.in", "power3.inOut",
  "power4.out", "power4.in", "power4.inOut",
  "back.out", "back.in", "back.inOut",
  "elastic.out", "elastic.in", "elastic.inOut",
  "bounce.out", "bounce.in", "bounce.inOut",
  "circ.out", "circ.in", "circ.inOut",
  "expo.out", "expo.in", "expo.inOut",
  "sine.out", "sine.in", "sine.inOut",
]

/** One-click entrance effects — applied as a "from" state on the selected item.
 *  Duration stays under the sequencer's control; only the visual recipe changes. */
const QUICK_FX: { label: string; patch: Partial<AnimationConfig> }[] = [
  { label: "Fade", patch: { tweenType: "from", opacity: 0, ease: "power2.out" } },
  { label: "Rise", patch: { tweenType: "from", y: 60, opacity: 0, ease: "power3.out" } },
  { label: "Drop", patch: { tweenType: "from", y: -80, opacity: 0, ease: "bounce.out" } },
  { label: "Slide L", patch: { tweenType: "from", x: -120, opacity: 0, ease: "expo.out" } },
  { label: "Slide R", patch: { tweenType: "from", x: 120, opacity: 0, ease: "expo.out" } },
  { label: "Pop", patch: { tweenType: "from", scale: 0, opacity: 0, ease: "back.out" } },
  { label: "Flip X", patch: { tweenType: "from", rotationX: -90, opacity: 0, ease: "power3.out" } },
  { label: "Flip Y", patch: { tweenType: "from", rotationY: -90, opacity: 0, ease: "power3.out" } },
  { label: "Blur In", patch: { tweenType: "from", scale: 1.15, opacity: 0, filter: { type: "blur", value: 14 }, ease: "expo.out" } },
  { label: "Whip", patch: { tweenType: "from", x: -100, skewX: 45, opacity: 0, ease: "expo.out" } },
  { label: "Tilt", patch: { tweenType: "from", skewY: -16, y: 24, opacity: 0, ease: "back.out" } },
]

const positionLabels: Record<string, string> = {
  start: "Start (0s)",
  afterPrevious: "After Previous",
  withPrevious: "With Previous",
  atTime: "At Time",
  label: "At Label",
}

export interface TimelineItemEditorProps {
  item: TimelineItem
  labels: TimelineProject["labels"]
  onChange: (patch: Partial<TimelineItem>) => void
}

/**
 * A fully controlled editor for a single TimelineItem. Composes the SAME config
 * editors used by the Text Animation Creator (AnimationControls /
 * SplitTextControls / CustomCssControls) via external binding, plus the
 * timeline-specific timing controls (position / offset / duration / ease).
 */
export default function TimelineItemEditor({ item, labels, onChange }: TimelineItemEditorProps) {
  const handleAnimation = (cfg: AnimationConfig) => onChange({ animation: cfg })
  const handleSplit = (cfg: SplitTextConfig) => onChange({ splitTextConfig: cfg })

  // Live artboard position — while the item is being dragged on the canvas the
  // drag streams into this UI-store channel, so these readouts update in real
  // time (the project store only receives the final value on drop).
  const liveItemPos = useTimelineUiStore((s) => s.liveItemPos)
  const isLiveDrag = liveItemPos?.id === item.id
  const pos = isLiveDrag ? { xp: liveItemPos!.xp, yp: liveItemPos!.yp } : (item.pos ?? { xp: 0, yp: 0 })

  const setPos = (patch: Partial<{ xp: number; yp: number }>) =>
    onChange({ pos: { xp: pos.xp, yp: pos.yp, ...patch } })

  // Quick FX: merge the recipe into a fresh copy of the item's animation and
  // clear the ease override so the effect's own easing takes hold.
  const applyQuickFx = (patch: Partial<AnimationConfig>) => {
    const base: AnimationConfig = JSON.parse(JSON.stringify(item.animation))
    onChange({ animation: { ...base, ...patch }, ease: undefined })
  }

  const positionType = item.position.type
  const hasOffset = positionType !== "start" && positionType !== "atTime" && positionType !== "label"
  const atTimeValue = positionType === "atTime" ? item.position.time : 0
  const labelValue = positionType === "label" ? item.position.label : ""
  const labelOffset = positionType === "label" ? item.position.offset ?? 0 : 0
  const offsetValue = hasOffset ? (item.position as { offset: number }).offset : 0

  const setPosition = (type: TimelinePosition["type"]) => {
    switch (type) {
      case "start":
        onChange({ position: { type: "start" } })
        break
      case "afterPrevious":
        onChange({ position: { type: "afterPrevious", offset: offsetValue } })
        break
      case "withPrevious":
        onChange({ position: { type: "withPrevious", offset: offsetValue } })
        break
      case "atTime":
        onChange({ position: { type: "atTime", time: atTimeValue } })
        break
      case "label":
        onChange({ position: { type: "label", label: labelValue || (labels[0]?.name ?? ""), offset: labelOffset } })
        break
    }
  }

  return (
    <div className="space-y-5">
      {/* Text content + artboard placement */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide">Text Content</Label>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 px-1.5 text-[9px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
            onClick={() => onChange({ pos: { xp: 0, yp: 0 } })}
            title="Recenter this item on the artboard (or drag it there directly)"
          >
            <Crosshair className="h-3 w-3 mr-1" />
            Recenter
          </Button>
        </div>
        <Input
          value={item.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Animation text…"
          className="h-8 text-sm bg-muted/40 border-border focus-visible:ring-ring/40 focus-visible:border-ring/50"
        />
      </div>

      {/* Artboard position — live during canvas drags */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide">
            Artboard Position
            {isLiveDrag && <span className="ml-2 text-[9px] font-mono uppercase tracking-wider text-ring align-middle">live</span>}
          </Label>
          <span className="text-[9px] font-mono text-muted-foreground/70 tnum">{pos.xp.toFixed(0)}% · {pos.yp.toFixed(0)}%</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SliderField label="Offset X" value={pos.xp} min={-48} max={48} step={1} onChange={(n) => setPos({ xp: n })} suffix="%" />
          <SliderField label="Offset Y" value={pos.yp} min={-48} max={48} step={1} onChange={(n) => setPos({ yp: n })} suffix="%" />
        </div>
      </div>

      {/* Quick FX */}
      <div>
        <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">Quick FX</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_FX.map((fx) => (
            <button
              key={fx.label}
              onClick={() => applyQuickFx(fx.patch)}
              className="px-2 py-1 rounded-md text-[10px] font-medium border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:border-ring/50 transition-colors"
            >
              {fx.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timing */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Position</Label>
            <Select value={positionType} onValueChange={(v) => setPosition(v as TimelinePosition["type"])}>
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border hover:bg-muted/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(positionLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SliderField
            label="Duration"
            value={item.duration}
            min={0.1}
            max={20}
            step={0.1}
            onChange={(n) => onChange({ duration: n })}
            suffix="s"
          />
        </div>

        {positionType === "atTime" && (
          <SliderField
            label="Start At"
            value={atTimeValue}
            min={0}
            max={30}
            step={0.1}
            onChange={(n) => onChange({ position: { type: "atTime", time: n } })}
            suffix="s"
          />
        )}

        {positionType === "label" && (
          <div className="grid grid-cols-2 gap-3.5 items-end">
            <div>
              <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Label</Label>
              <Select
                value={labelValue}
                onValueChange={(v) => onChange({ position: { type: "label", label: v, offset: labelOffset } })}
              >
                <SelectTrigger className="h-8 text-xs bg-muted/40 border-border hover:bg-muted/60 transition-colors">
                  <SelectValue placeholder="Select label" />
                </SelectTrigger>
                <SelectContent>
                  {labels.map((l) => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <SliderField
              label="Label Offset"
              value={labelOffset}
              min={-5}
              max={5}
              step={0.1}
              onChange={(n) => onChange({ position: { type: "label", label: labelValue, offset: n } })}
              suffix="s"
            />
          </div>
        )}

        {hasOffset && (
          <SliderField
            label={positionType === "withPrevious" ? "Overlap Offset" : "Gap Offset"}
            value={offsetValue}
            min={-5}
            max={5}
            step={0.1}
            onChange={(n) => onChange({ position: { ...item.position, offset: n } as TimelinePosition })}
            suffix="s"
          />
        )}
      </div>

      {/* Ease */}
      <div>
        <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Ease (override)</Label>
        <Select
          value={item.ease ?? item.animation.ease}
          onValueChange={(v) => onChange({ ease: v === item.animation.ease ? undefined : v })}
        >
          <SelectTrigger className="h-8 text-xs bg-muted/40 border-border hover:bg-muted/60 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {easingOptions.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Full reused config editors */}
      <Tabs defaultValue="anim" className="w-full">
        <TabsList className="w-full grid grid-cols-3 gap-1 bg-muted/25 border border-ring/45 rounded-lg p-1 h-auto">
          <TabsTrigger
            value="anim"
            title="Transforms, easing, filters"
            className="h-9 rounded-md border cursor-pointer text-[11px] font-medium text-muted-foreground border-border bg-muted/50 transition-colors duration-150 hover:bg-accent hover:text-foreground hover:border-muted-foreground/40 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-ring/70 data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)] data-[state=active]:[&>svg]:text-ring"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Animation
          </TabsTrigger>
          <TabsTrigger
            value="split"
            title="Split-text and stagger"
            className="h-9 rounded-md border cursor-pointer text-[11px] font-medium text-muted-foreground border-border bg-muted/50 transition-colors duration-150 hover:bg-accent hover:text-foreground hover:border-muted-foreground/40 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-ring/70 data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)] data-[state=active]:[&>svg]:text-ring"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Split
          </TabsTrigger>
          <TabsTrigger
            value="style"
            title="Typography and colors"
            className="h-9 rounded-md border cursor-pointer text-[11px] font-medium text-muted-foreground border-border bg-muted/50 transition-colors duration-150 hover:bg-accent hover:text-foreground hover:border-muted-foreground/40 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-ring/70 data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)] data-[state=active]:[&>svg]:text-ring"
          >
            <Paintbrush className="h-3.5 w-3.5" />
            Style
          </TabsTrigger>
        </TabsList>
        <TabsContent value="anim" className="mt-4 space-y-4">
          <AnimationControls config={item.animation} onChange={handleAnimation} />
        </TabsContent>
        <TabsContent value="split" className="mt-4">
          <SplitTextControls config={item.splitTextConfig} setSplitTextConfig={handleSplit} />
        </TabsContent>
        <TabsContent value="style" className="mt-4">
          <CustomCssControls config={item.animation} onChange={handleAnimation} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
