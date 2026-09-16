"use client"

import { Slider } from "dialkit"
import type { AnimationConfig } from "@/types/animation"
import { useCallback, useState } from "react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { DialScope, SliderField, SelectField, ToggleField, TransitionField, type SliderFieldProps } from "@/components/dial-controls"
import { easeToCurve } from "@/lib/ease-presets"

// The Figma-style slider is now a DialKit control; re-exported here so the
// existing SliderField imports across the app keep resolving.
export { SliderField }
export type { SliderFieldProps }

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

// Appended to the SelectField options — the named GSAP eases above stay first.
const easeSelectOptions = [
  ...easingOptions.map((e) => ({ value: e, label: e })),
  { value: "custom", label: "Custom (Bézier)…" },
]

const filterOptions = [
  { value: "blur", label: "Blur", unit: "px", min: 0, max: 50, step: 0.5 },
  { value: "brightness", label: "Brightness", unit: "%", min: 0, max: 300, step: 1 },
  { value: "contrast", label: "Contrast", unit: "%", min: 0, max: 300, step: 1 },
  { value: "saturate", label: "Saturate", unit: "%", min: 0, max: 300, step: 1 },
]

// ── Position field: DialKit slider + px/% unit toggle ─────────────────────────
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

  const safe = Number.isFinite(numVal) ? Math.min(max, Math.max(min, numVal)) : 0
  const commit = (n: number) => onChange(unit === "%" ? `${n}%` : n)

  return (
    <DialScope className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <Slider label={label} value={safe} min={min} max={max} step={step} onChange={commit} unit={unit} />
      </div>
      <div className="flex shrink-0 bg-muted/60 p-0.5 rounded-md border border-border leading-none">
        <button
          type="button"
          onClick={() => { onUnitChange("px"); onChange(numVal) }}
          className={`px-1.5 py-0.5 text-[9px] font-medium rounded transition-all ${unit === "px" ? "bg-background text-foreground " : "text-muted-foreground/60 hover:text-foreground"}`}
        >px</button>
        <button
          type="button"
          onClick={() => { onUnitChange("%"); onChange(`${numVal}%`) }}
          className={`px-1.5 py-0.5 text-[9px] font-medium rounded transition-all ${unit === "%" ? "bg-background text-foreground " : "text-muted-foreground/60 hover:text-foreground"}`}
        >%</button>
      </div>
    </DialScope>
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
  skewY: number; onSkewY: (n: number) => void
  opacity: number; onOp: (n: number) => void
  filterType: string; onFilterType: (t: string) => void
  filterVal: number; onFilterVal: (n: number) => void
}

function PropGrid({ xVal, xUnit, onXUnit, onX, yVal, yUnit, onYUnit, onY, scale, onScale, rotation, onRot, rotationX, onRotX, rotationY, onRotY, skewX, onSkewX, skewY, onSkewY, opacity, onOp, filterType, onFilterType, filterVal, onFilterVal }: PropGridProps) {
  const filterOpt = filterOptions.find(f => f.value === filterType) || filterOptions[0]
  return (
    <div className="flex flex-col gap-1.5">
      <PosSliderField label="Offset X" value={xVal} unit={xUnit} onUnitChange={onXUnit} onChange={onX} />
      <PosSliderField label="Offset Y" value={yVal} unit={yUnit} onUnitChange={onYUnit} onChange={onY} />
      <SliderField label="Scale" value={scale} min={0} max={5} step={0.05} onChange={onScale} />
      <SliderField label="Rotate" value={rotation} min={-360} max={360} step={1} onChange={onRot} suffix="°" />
      <SliderField label="Rotate X" value={rotationX} min={-360} max={360} step={1} onChange={onRotX} suffix="°" />
      <SliderField label="Rotate Y" value={rotationY} min={-360} max={360} step={1} onChange={onRotY} suffix="°" />
      <SliderField label="Skew X" value={skewX} min={-90} max={90} step={1} onChange={onSkewX} suffix="°" />
      <SliderField label="Skew Y" value={skewY} min={-90} max={90} step={1} onChange={onSkewY} suffix="°" />
      <SliderField label="Opacity" value={opacity} min={0} max={1} step={0.01} onChange={onOp} />
      <SelectField
        label="Filter Type"
        value={filterType}
        options={filterOptions.map(f => ({ value: f.value, label: f.label }))}
        onChange={onFilterType}
      />
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
  )
}

interface AnimationControlsProps {
  /** Optional external binding — when omitted, reads/writes the playground store. */
  config?: AnimationConfig
  onChange?: (config: AnimationConfig) => void
}

export default function AnimationControls({ config: propConfig, onChange: propOnChange }: AnimationControlsProps = {}) {
  // Always subscribe — falls back to store binding when no props are supplied,
  // so the Text Animation Creator path keeps working unchanged.
  const storeConfig = usePlaygroundStore((s) => s.animationConfig)
  const storeOnChange = usePlaygroundStore((s) => s.setAnimationConfig)
  const config = propConfig ?? storeConfig
  const onChange = propOnChange ?? storeOnChange

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
    <div className="flex flex-col gap-1.5">
      {/* Tween type + easing */}
      <SelectField
        label="Tween Type"
        value={config.tweenType}
        options={[
          { value: "to", label: "To (End State)" },
          { value: "from", label: "From (Start State)" },
          { value: "fromTo", label: "From-To" },
        ]}
        onChange={(v) => set("tweenType", v)}
      />
      {/* The curve editor is always visible: it mirrors the selected ease
          (bezier handles / spring mode) and dragging it converts to custom. */}
      <TransitionField
        label="Curve Editor"
        spec={easeToCurve(config.ease, config.customEase, config.duration).spec}
        duration={config.duration}
        onSpecChange={(s) => onChange({ ...config, ease: "custom", customEase: s })}
        panelId="texp-animation"
        path="customEase"
      />
      {/* Presets as a dropdown under the graph — picking one moves the graph
          handles to that ease's exact curve (spring mode for elastic/bounce). */}
      <SelectField
        label="Ease Presets"
        value={config.ease}
        options={easeSelectOptions}
        onChange={(v) => set("ease", v)}
      />

      {/* Duration + Delay */}
      <SliderField label="Duration" value={config.duration} min={0.1} max={10} step={0.1} onChange={n => set("duration", n)} suffix="s" />
      <SliderField label="Delay" value={config.delay} min={0} max={5} step={0.1} onChange={n => set("delay", n)} suffix="s" />

      {/* Property grid — split for fromTo, single otherwise */}
      {config.tweenType === "fromTo" ? (
        <div className="flex flex-col gap-4 pt-1">
          <div className="relative rounded-md border border-border/70 p-4 pl-5 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-0.5 before:rounded-r before:bg-muted-foreground/50">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-3.5">From — Initial Properties</p>
            <PropGrid
              xVal={config.fromValues?.x ?? 0} xUnit={fromXUnit} onXUnit={setFromXUnit} onX={v => setFrom("x", v)}
              yVal={config.fromValues?.y ?? 0} yUnit={fromYUnit} onYUnit={setFromYUnit} onY={v => setFrom("y", v)}
              scale={config.fromValues?.scale ?? 1} onScale={n => setFrom("scale", n)}
              rotation={config.fromValues?.rotation ?? 0} onRot={n => setFrom("rotation", n)}
              rotationX={config.fromValues?.rotationX ?? 0} onRotX={n => setFrom("rotationX", n)}
              rotationY={config.fromValues?.rotationY ?? 0} onRotY={n => setFrom("rotationY", n)}
              skewX={config.fromValues?.skewX ?? 0} onSkewX={n => setFrom("skewX", n)}
              skewY={config.fromValues?.skewY ?? 0} onSkewY={n => setFrom("skewY", n)}
              opacity={config.fromValues?.opacity ?? 1} onOp={n => setFrom("opacity", n)}
              filterType={config.fromValues?.filter?.type ?? "blur"}
              onFilterType={t => setFrom("filter", { type: t, value: config.fromValues?.filter?.value ?? 0 })}
              filterVal={config.fromValues?.filter?.value ?? 0}
              onFilterVal={n => setFrom("filter", { type: config.fromValues?.filter?.type ?? "blur", value: n })}
            />
          </div>
          <div className="relative rounded-md border border-primary/30 bg-primary/[0.04] p-4 pl-5 before:absolute before:left-0 before:top-4 before:bottom-4 before:w-0.5 before:rounded-r before:bg-primary">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-ring mb-3.5">To — Target Properties</p>
            <PropGrid
              xVal={config.x} xUnit={xUnit} onXUnit={setXUnit} onX={v => set("x", v)}
              yVal={config.y} yUnit={yUnit} onYUnit={setYUnit} onY={v => set("y", v)}
              scale={config.scale} onScale={n => set("scale", n)}
              rotation={config.rotation} onRot={n => set("rotation", n)}
              rotationX={config.rotationX} onRotX={n => set("rotationX", n)}
              rotationY={config.rotationY} onRotY={n => set("rotationY", n)}
              skewX={config.skewX} onSkewX={n => set("skewX", n)}
              skewY={config.skewY} onSkewY={n => set("skewY", n)}
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
          skewY={config.skewY} onSkewY={n => set("skewY", n)}
          opacity={config.opacity} onOp={n => set("opacity", n)}
          filterType={config.filter?.type ?? "blur"}
          onFilterType={t => set("filter", { type: t, value: config.filter?.value ?? 0 })}
          filterVal={config.filter?.value ?? 0}
          onFilterVal={n => set("filter", { type: config.filter?.type ?? "blur", value: n })}
        />
      )}

      {/* Repeat + Yoyo */}
      <SliderField
        label="Repeat Loops"
        value={config.repeat}
        min={-1}
        max={20}
        step={1}
        onChange={n => set("repeat", Math.round(n))}
        suffix="-1 = ∞"
      />
      <ToggleField label="Yoyo Loop" checked={config.yoyo} onChange={(c) => set("yoyo", c)} />
    </div>
  )
}
