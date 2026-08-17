"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { AnimationConfig } from "@/types/animation"
import { useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"

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

const filterOptions = [
  { value: "blur", label: "Blur", unit: "px", min: 0, max: 50, step: 0.5 },
  { value: "brightness", label: "Brightness", unit: "%", min: 0, max: 300, step: 1 },
  { value: "contrast", label: "Contrast", unit: "%", min: 0, max: 300, step: 1 },
  { value: "saturate", label: "Saturate", unit: "%", min: 0, max: 300, step: 1 },
]

// ── Figma-style slider + number input ─────────────────────────────────────────
export interface SliderFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (n: number) => void
  suffix?: string
  className?: string
}

export function SliderField({ label, value, min, max, step, onChange, suffix, className = "" }: SliderFieldProps) {
  const [str, setStr] = useState(String(value))
  const focused = useRef(false)

  // Sync from outside only when not actively editing
  useEffect(() => {
    if (!focused.current) setStr(String(value))
  }, [value])

  const safe = isNaN(value) ? min : value
  const clamped = Math.min(max, Math.max(min, safe))
  const pct = max === min ? 0 : ((clamped - min) / (max - min)) * 100

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide">{label}</Label>
        {suffix && <span className="text-[10px] font-mono text-muted-foreground/60">{suffix}</span>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 h-7 flex items-center group">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={clamped}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Custom track */}
          <div 
            className="w-full h-[3px] rounded-full relative pointer-events-none transition-colors" 
            style={{ 
              background: `linear-gradient(to right, hsl(var(--primary)) ${pct}%, hsl(var(--border) / 0.8) ${pct}%)` 
            }}
          >
            {/* Custom thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-background border-[2.5px] border-primary shadow-sm pointer-events-none transition-transform duration-75 group-hover:scale-110 active:scale-95"
              style={{ left: `calc(${pct}% - 7px)` }}
            />
          </div>
        </div>
        <input
          type="number"
          step={step}
          value={str}
          onFocus={() => { focused.current = true }}
          onChange={(e) => {
            setStr(e.target.value)
            const n = parseFloat(e.target.value)
            if (!isNaN(n)) onChange(n)
          }}
          onBlur={() => {
            focused.current = false
            const n = parseFloat(str)
            if (!isNaN(n)) {
              const c = Math.min(max, Math.max(min, n))
              onChange(c)
              setStr(String(c))
            } else {
              setStr(String(value))
            }
          }}
          className="w-14 h-7 text-center font-mono text-[10px] bg-muted/40 border border-border/70 rounded-md
            px-1 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 hover:bg-muted/60 transition-all
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  )
}

// ── Position field: slider + input + px/% toggle ──────────────────────────────
interface PosSliderFieldProps {
  label: string
  value: number | string
  unit: "px" | "%"
  onUnitChange: (u: "px" | "%") => void
  onChange: (v: number | string) => void
}

function PosSliderField({ label, value, unit, onUnitChange, onChange }: PosSliderFieldProps) {
  const numVal = typeof value === "string"
    ? (parseFloat(value.replace(/[^\d.-]/g, "")) || 0)
    : (value ?? 0)
  const min = unit === "%" ? -200 : -500
  const max = unit === "%" ? 200 : 500
  const step = unit === "%" ? 0.5 : 1

  const [str, setStr] = useState(String(numVal))
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setStr(String(numVal))
  }, [numVal])

  const safe = isNaN(numVal) ? 0 : numVal
  const clamped = Math.min(max, Math.max(min, safe))
  const pct = ((clamped - min) / (max - min)) * 100

  const commit = (n: number) => onChange(unit === "%" ? `${n}%` : n)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide">{label}</Label>
        <div className="flex bg-muted/50 p-0.5 rounded-md border border-border/40 leading-none">
          <button
            type="button"
            onClick={() => { onUnitChange("px"); onChange(numVal) }}
            className={`px-1.5 py-0.5 text-[9px] font-medium rounded transition-all ${unit === "px" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground/60 hover:text-foreground"}`}
          >px</button>
          <button
            type="button"
            onClick={() => { onUnitChange("%"); onChange(`${numVal}%`) }}
            className={`px-1.5 py-0.5 text-[9px] font-medium rounded transition-all ${unit === "%" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground/60 hover:text-foreground"}`}
          >%</button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 h-7 flex items-center group">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={clamped}
            onChange={(e) => commit(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Custom track */}
          <div 
            className="w-full h-[3px] rounded-full relative pointer-events-none transition-colors" 
            style={{ 
              background: `linear-gradient(to right, hsl(var(--primary)) ${pct}%, hsl(var(--border) / 0.8) ${pct}%)` 
            }}
          >
            {/* Custom thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-background border-[2.5px] border-primary shadow-sm pointer-events-none transition-transform duration-75 group-hover:scale-110 active:scale-95"
              style={{ left: `calc(${pct}% - 7px)` }}
            />
          </div>
        </div>
        <input
          type="number"
          step={step}
          value={str}
          onFocus={() => { focused.current = true }}
          onChange={(e) => {
            setStr(e.target.value)
            const n = parseFloat(e.target.value)
            if (!isNaN(n)) commit(n)
          }}
          onBlur={() => {
            focused.current = false
            const n = parseFloat(str)
            if (!isNaN(n)) {
              const c = Math.min(max, Math.max(min, n))
              commit(c)
              setStr(String(c))
            } else {
              setStr(String(numVal))
            }
          }}
          className="w-14 h-7 text-center font-mono text-[10px] bg-muted/40 border border-border/70 rounded-md
            px-1 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 hover:bg-muted/60 transition-all
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  )
}

// ── Label + content wrapper ───────────────────────────────────────────────────
function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">{label}</Label>
      {children}
    </div>
  )
}

// ── Full property grid (X, Y, Scale, Rotation, Opacity, Filter) ──────────────
interface PropGridProps {
  xVal: number | string; xUnit: "px" | "%"; onXUnit: (u: "px" | "%") => void; onX: (v: number | string) => void
  yVal: number | string; yUnit: "px" | "%"; onYUnit: (u: "px" | "%") => void; onY: (v: number | string) => void
  scale: number; onScale: (n: number) => void
  rotation: number; onRot: (n: number) => void
  rotationX: number; onRotX: (n: number) => void
  rotationY: number; onRotY: (n: number) => void
  skewX: number; onSkewX: (n: number) => void
  opacity: number; onOp: (n: number) => void
  filterType: string; onFilterType: (t: string) => void
  filterVal: number; onFilterVal: (n: number) => void
}

function PropGrid({ xVal, xUnit, onXUnit, onX, yVal, yUnit, onYUnit, onY, scale, onScale, rotation, onRot, rotationX, onRotX, rotationY, onRotY, skewX, onSkewX, opacity, onOp, filterType, onFilterType, filterVal, onFilterVal }: PropGridProps) {
  const filterOpt = filterOptions.find(f => f.value === filterType) || filterOptions[0]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <PosSliderField label="Offset X" value={xVal} unit={xUnit} onUnitChange={onXUnit} onChange={onX} />
        <PosSliderField label="Offset Y" value={yVal} unit={yUnit} onUnitChange={onYUnit} onChange={onY} />
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-3">
        <SliderField label="Scale" value={scale} min={0} max={5} step={0.05} onChange={onScale} />
        <SliderField label="Rotate" value={rotation} min={-360} max={360} step={1} onChange={onRot} suffix="°" />
        <SliderField label="Opacity" value={opacity} min={0} max={1} step={0.01} onChange={onOp} />
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-3">
        <SliderField label="Rotate X" value={rotationX} min={-360} max={360} step={1} onChange={onRotX} suffix="°" />
        <SliderField label="Rotate Y" value={rotationY} min={-360} max={360} step={1} onChange={onRotY} suffix="°" />
        <SliderField label="Skew X" value={skewX} min={-90} max={90} step={1} onChange={onSkewX} suffix="°" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 items-end">
        <Field label="Filter Type">
          <Select value={filterType} onValueChange={onFilterType}>
            <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <SliderField
          label="Filter Int."
          value={filterVal}
          min={filterOpt.min}
          max={filterOpt.max}
          step={filterOpt.step}
          onChange={onFilterVal}
          suffix={filterOpt.unit}
        />
      </div>
    </div>
  )
}

export default function AnimationControls() {
  const { config, onChange } = usePlaygroundStore(
    useShallow((s) => ({
      config: s.animationConfig,
      onChange: s.setAnimationConfig,
    })),
  )

  const [xUnit, setXUnit] = useState<"px" | "%">("px")
  const [yUnit, setYUnit] = useState<"px" | "%">("px")
  const [fromXUnit, setFromXUnit] = useState<"px" | "%">("px")
  const [fromYUnit, setFromYUnit] = useState<"px" | "%">("px")

  const set = useCallback((key: keyof AnimationConfig, value: unknown) => {
    onChange({ ...config, [key]: value })
  }, [config, onChange])

  const setFrom = useCallback((key: string, value: unknown) => {
    onChange({ ...config, fromValues: { ...config.fromValues, [key]: value } })
  }, [config, onChange])

  return (
    <div className="space-y-4">
      {/* Tween type + easing */}
      <div className="grid grid-cols-2 gap-3.5">
        <Field label="Tween Type">
          <Select value={config.tweenType} onValueChange={(v: "from" | "to" | "fromTo") => set("tweenType", v)}>
            <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="to">To (End State)</SelectItem>
              <SelectItem value="from">From (Start State)</SelectItem>
              <SelectItem value="fromTo">From-To</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Easing Curve">
          <Select value={config.ease} onValueChange={(v) => set("ease", v)}>
            <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {easingOptions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* Duration + Delay */}
      <div className="grid grid-cols-2 gap-3.5">
        <SliderField label="Duration" value={config.duration} min={0.1} max={10} step={0.1} onChange={n => set("duration", n)} suffix="s" />
        <SliderField label="Delay" value={config.delay} min={0} max={5} step={0.1} onChange={n => set("delay", n)} suffix="s" />
      </div>

      {/* Property grid — split for fromTo, single otherwise */}
      {config.tweenType === "fromTo" ? (
        <div className="space-y-4 pt-1">
          <div className="relative rounded-xl border border-blue-500/15 bg-blue-500/[0.02] p-4 pl-5 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:rounded-r-md before:bg-blue-500/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3.5">From (Initial Properties)</p>
            <PropGrid
              xVal={config.fromValues?.x ?? 0} xUnit={fromXUnit} onXUnit={setFromXUnit} onX={v => setFrom("x", v)}
              yVal={config.fromValues?.y ?? 0} yUnit={fromYUnit} onYUnit={setFromYUnit} onY={v => setFrom("y", v)}
              scale={config.fromValues?.scale ?? 1} onScale={n => setFrom("scale", n)}
              rotation={config.fromValues?.rotation ?? 0} onRot={n => setFrom("rotation", n)}
              rotationX={config.fromValues?.rotationX ?? 0} onRotX={n => setFrom("rotationX", n)}
              rotationY={config.fromValues?.rotationY ?? 0} onRotY={n => setFrom("rotationY", n)}
              skewX={config.fromValues?.skewX ?? 0} onSkewX={n => setFrom("skewX", n)}
              opacity={config.fromValues?.opacity ?? 1} onOp={n => setFrom("opacity", n)}
              filterType={config.fromValues?.filter?.type ?? "blur"}
              onFilterType={t => setFrom("filter", { type: t, value: config.fromValues?.filter?.value ?? 0 })}
              filterVal={config.fromValues?.filter?.value ?? 0}
              onFilterVal={n => setFrom("filter", { type: config.fromValues?.filter?.type ?? "blur", value: n })}
            />
          </div>
          <div className="relative rounded-xl border border-emerald-500/15 bg-emerald-500/[0.02] p-4 pl-5 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:rounded-r-md before:bg-emerald-500/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3.5">To (Target Properties)</p>
            <PropGrid
              xVal={config.x} xUnit={xUnit} onXUnit={setXUnit} onX={v => set("x", v)}
              yVal={config.y} yUnit={yUnit} onYUnit={setYUnit} onY={v => set("y", v)}
              scale={config.scale} onScale={n => set("scale", n)}
              rotation={config.rotation} onRot={n => set("rotation", n)}
              rotationX={config.rotationX} onRotX={n => set("rotationX", n)}
              rotationY={config.rotationY} onRotY={n => set("rotationY", n)}
              skewX={config.skewX} onSkewX={n => set("skewX", n)}
              opacity={config.opacity} onOp={n => set("opacity", n)}
              filterType={config.filter?.type ?? "blur"}
              onFilterType={t => set("filter", { type: t, value: config.filter?.value ?? 0 })}
              filterVal={config.filter?.value ?? 0}
              onFilterVal={n => set("filter", { type: config.filter?.type ?? "blur", value: n })}
            />
          </div>
        </div>
      ) : (
        <PropGrid
          xVal={config.x} xUnit={xUnit} onXUnit={setXUnit} onX={v => set("x", v)}
          yVal={config.y} yUnit={yUnit} onYUnit={setYUnit} onY={v => set("y", v)}
          scale={config.scale} onScale={n => set("scale", n)}
          rotation={config.rotation} onRot={n => set("rotation", n)}
          rotationX={config.rotationX} onRotX={n => set("rotationX", n)}
          rotationY={config.rotationY} onRotY={n => set("rotationY", n)}
          skewX={config.skewX} onSkewX={n => set("skewX", n)}
          opacity={config.opacity} onOp={n => set("opacity", n)}
          filterType={config.filter?.type ?? "blur"}
          onFilterType={t => set("filter", { type: t, value: config.filter?.value ?? 0 })}
          filterVal={config.filter?.value ?? 0}
          onFilterVal={n => set("filter", { type: config.filter?.type ?? "blur", value: n })}
        />
      )}

      {/* Repeat + Yoyo */}
      <div className="grid grid-cols-2 gap-3.5 items-end pt-1">
        <SliderField
          label="Repeat Loops"
          value={config.repeat}
          min={-1}
          max={20}
          step={1}
          onChange={n => set("repeat", Math.round(n))}
          suffix="-1 = ∞"
        />
        <div className="flex items-center justify-between h-7 px-2.5 rounded-md border border-border/80 bg-muted/40 hover:bg-muted/60 hover:border-border transition-all cursor-pointer">
          <Label htmlFor="yoyo" className="text-[11px] font-medium text-muted-foreground cursor-pointer">Yoyo Loop</Label>
          <Checkbox id="yoyo" checked={config.yoyo} onCheckedChange={(c) => set("yoyo", c as boolean)} className="h-3.5 w-3.5 rounded border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
        </div>
      </div>
    </div>
  )
}
