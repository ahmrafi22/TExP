
"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { AnimationConfig } from "@/types/animation"
import { useState, useEffect } from "react"

interface AnimationControlsProps {
  config: AnimationConfig
  onChange: (config: AnimationConfig) => void
}

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
  { value: "blur", label: "Blur", unit: "px" },
  { value: "brightness", label: "Brightness", unit: "%" },
  { value: "contrast", label: "Contrast", unit: "%" },
  { value: "saturate", label: "Saturate", unit: "%" },
]

// Reusable number input change handler
function createNumberHandler(
  allowNegative: boolean,
  onValid: (num: number) => void,
  setLocal: (v: string) => void,
  isInt = false
) {
  return (value: string) => {
    setLocal(value)
    if (value === "" || value === "-" || value === "." || value === "-.") return
    if (/^\d+\.$/.test(value) || /^-\d+\.$/.test(value)) return
    const pattern = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/
    if (!pattern.test(value) || !/\d/.test(value)) return
    const num = isInt ? parseInt(value) : parseFloat(value)
    if (isNaN(num)) return
    if (!allowNegative && num < 0) return
    onValid(num)
  }
}

export default function AnimationControls({ config, onChange }: AnimationControlsProps) {
  const [xUnit, setXUnit] = useState<"px" | "%">("px")
  const [yUnit, setYUnit] = useState<"px" | "%">("px")
  const [xVal, setXVal] = useState("")
  const [yVal, setYVal] = useState("")
  const [scaleVal, setScaleVal] = useState("")
  const [rotVal, setRotVal] = useState("")
  const [opVal, setOpVal] = useState("")
  const [durVal, setDurVal] = useState("")
  const [delayVal, setDelayVal] = useState("")
  const [repeatVal, setRepeatVal] = useState("")
  const [filterVal, setFilterVal] = useState("")
  
  // From values
  const [fromXUnit, setFromXUnit] = useState<"px" | "%">("px")
  const [fromYUnit, setFromYUnit] = useState<"px" | "%">("px")
  const [fromXVal, setFromXVal] = useState("")
  const [fromYVal, setFromYVal] = useState("")
  const [fromScaleVal, setFromScaleVal] = useState("")
  const [fromRotVal, setFromRotVal] = useState("")
  const [fromOpVal, setFromOpVal] = useState("")
  const [fromFilterVal, setFromFilterVal] = useState("")

  // Sync local state from config
  useEffect(() => {
    const parseUnit = (v: any): [string, "px" | "%"] => {
      if (typeof v === "string") {
        const isP = v.includes("%")
        return [v.replace(/[^\d.-]/g, "") || "", isP ? "%" : "px"]
      }
      return [v === 0 ? "" : String(v), "px"]
    }

    const [xv, xu] = parseUnit(config.x)
    setXVal(xv === "0" ? "" : xv); setXUnit(xu)
    const [yv, yu] = parseUnit(config.y)
    setYVal(yv === "0" ? "" : yv); setYUnit(yu)

    setScaleVal(config.scale === 1 ? "" : String(config.scale))
    setRotVal(config.rotation === 0 ? "" : String(config.rotation))
    setOpVal(config.opacity === 1 ? "" : String(config.opacity))
    setDurVal(config.duration === 1 ? "" : String(config.duration))
    setDelayVal(config.delay === 0 ? "" : String(config.delay))
    setRepeatVal(config.repeat === 0 ? "" : String(config.repeat))
    setFilterVal(config.filter?.value === 0 ? "" : String(config.filter?.value || ""))

    if (config.fromValues) {
      const [fxv, fxu] = parseUnit(config.fromValues.x)
      setFromXVal(fxv === "0" ? "" : fxv); setFromXUnit(fxu)
      const [fyv, fyu] = parseUnit(config.fromValues.y)
      setFromYVal(fyv === "0" ? "" : fyv); setFromYUnit(fyu)
      setFromScaleVal(config.fromValues.scale === 1 ? "" : String(config.fromValues.scale || ""))
      setFromRotVal(config.fromValues.rotation === 0 ? "" : String(config.fromValues.rotation || ""))
      setFromOpVal(config.fromValues.opacity === 1 ? "" : String(config.fromValues.opacity || ""))
      setFromFilterVal(config.fromValues.filter?.value === 0 ? "" : String(config.fromValues.filter?.value || ""))
    } else {
      setFromXVal(""); setFromYVal(""); setFromScaleVal(""); setFromRotVal(""); setFromOpVal(""); setFromFilterVal("")
    }
  }, [config])

  const set = (key: keyof AnimationConfig, value: any) => onChange({ ...config, [key]: value })
  const setFrom = (key: string, value: any) => onChange({ ...config, fromValues: { ...config.fromValues, [key]: value } })

  const handleXChange = createNumberHandler(true, (n) => set("x", xUnit === "%" ? `${n}%` : n), setXVal)
  const handleYChange = createNumberHandler(true, (n) => set("y", yUnit === "%" ? `${n}%` : n), setYVal)
  const handleFromXChange = createNumberHandler(true, (n) => setFrom("x", fromXUnit === "%" ? `${n}%` : n), setFromXVal)
  const handleFromYChange = createNumberHandler(true, (n) => setFrom("y", fromYUnit === "%" ? `${n}%` : n), setFromYVal)

  const handleXUnitChange = (u: "px" | "%") => {
    setXUnit(u)
    const v = xVal === "" ? 0 : parseFloat(xVal)
    set("x", u === "%" ? `${v}%` : v)
  }
  const handleYUnitChange = (u: "px" | "%") => {
    setYUnit(u)
    const v = yVal === "" ? 0 : parseFloat(yVal)
    set("y", u === "%" ? `${v}%` : v)
  }
  const handleFromXUnitChange = (u: "px" | "%") => {
    setFromXUnit(u)
    const v = fromXVal === "" ? 0 : parseFloat(fromXVal)
    setFrom("x", u === "%" ? `${v}%` : v)
  }
  const handleFromYUnitChange = (u: "px" | "%") => {
    setFromYUnit(u)
    const v = fromYVal === "" ? 0 : parseFloat(fromYVal)
    setFrom("y", u === "%" ? `${v}%` : v)
  }

  const getFilterUnit = () => filterOptions.find(f => f.value === (config.filter?.type || "blur"))?.unit || "px"

  // Compact input with label
  const Field = ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
    <div className={className}>
      <Label className="text-[11px] text-muted-foreground mb-1 block">{label}</Label>
      {children}
    </div>
  )

  // Unit toggle button pair
  const UnitToggle = ({ unit, onChange: onU }: { unit: "px" | "%"; onChange: (u: "px" | "%") => void }) => (
    <div className="flex shrink-0">
      <Button variant={unit === "px" ? "default" : "outline"} size="sm" className="h-8 px-2 text-[10px] rounded-r-none" onClick={() => onU("px")}>px</Button>
      <Button variant={unit === "%" ? "default" : "outline"} size="sm" className="h-8 px-2 text-[10px] rounded-l-none" onClick={() => onU("%")}>%</Button>
    </div>
  )

  // Position + unit input
  const PosField = ({ label, val, onChange: onC, unit, onUnitChange }: { label: string; val: string; onChange: (v: string) => void; unit: "px" | "%"; onUnitChange: (u: "px" | "%") => void }) => (
    <Field label={label}>
      <div className="flex gap-1">
        <Input type="text" value={val} onChange={(e) => onC(e.target.value)} className="h-8 text-xs flex-1 min-w-0" placeholder="0" />
        <UnitToggle unit={unit} onChange={onUnitChange} />
      </div>
    </Field>
  )

  const renderPropertyGrid = (
    xv: string, xC: (v: string) => void, xu: "px" | "%", xU: (u: "px" | "%") => void,
    yv: string, yC: (v: string) => void, yu: "px" | "%", yU: (u: "px" | "%") => void,
    sv: string, sC: (v: string) => void,
    rv: string, rC: (v: string) => void,
    ov: string, oC: (v: string) => void,
    fv: string, fC: (v: string) => void,
    ftChange: (t: string) => void,
    ft: string,
    isFrom = false
  ) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <PosField label="X Position" val={xv} onChange={xC} unit={xu} onUnitChange={xU} />
        <PosField label="Y Position" val={yv} onChange={yC} unit={yu} onUnitChange={yU} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Scale">
          <Input type="text" value={sv} onChange={(e) => sC(e.target.value)} className="h-8 text-xs" placeholder="1" />
        </Field>
        <Field label="Rotation (°)">
          <Input type="text" value={rv} onChange={(e) => rC(e.target.value)} className="h-8 text-xs" placeholder="0" />
        </Field>
        <Field label="Opacity">
          <Input type="text" value={ov} onChange={(e) => oC(e.target.value)} className="h-8 text-xs" placeholder="1" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Filter">
          <Select value={ft} onValueChange={ftChange}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {filterOptions.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label={`Value (${getFilterUnit()})`}>
          <Input type="text" value={fv} onChange={(e) => fC(e.target.value)} className="h-8 text-xs" placeholder="0" />
        </Field>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Core settings */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tween Type">
          <Select value={config.tweenType} onValueChange={(v: "from" | "to" | "fromTo") => set("tweenType", v)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="to">To</SelectItem>
              <SelectItem value="from">From</SelectItem>
              <SelectItem value="fromTo">FromTo</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Easing">
          <Select value={config.ease} onValueChange={(v) => set("ease", v)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {easingOptions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Duration (s)">
          <Input
            type="text" value={durVal}
            onChange={createNumberHandler(false, (n) => set("duration", n), setDurVal)}
            className="h-8 text-xs" placeholder="1"
          />
        </Field>
        <Field label="Delay (s)">
          <Input
            type="text" value={delayVal}
            onChange={createNumberHandler(false, (n) => set("delay", n), setDelayVal)}
            className="h-8 text-xs" placeholder="0"
          />
        </Field>
      </div>

      {/* fromTo layout */}
      {config.tweenType === "fromTo" ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3">
            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-3">From Values</p>
            {renderPropertyGrid(
              fromXVal, handleFromXChange, fromXUnit, handleFromXUnitChange,
              fromYVal, handleFromYChange, fromYUnit, handleFromYUnitChange,
              fromScaleVal, createNumberHandler(false, (n) => setFrom("scale", n), setFromScaleVal),
              fromRotVal, createNumberHandler(true, (n) => setFrom("rotation", n), setFromRotVal),
              fromOpVal, createNumberHandler(false, (n) => setFrom("opacity", n), setFromOpVal),
              fromFilterVal,
              (v: string) => {
                setFromFilterVal(v)
                if (v === "" || v === ".") return
                if (!/^\d*\.?\d*$/.test(v) || !/\d/.test(v)) return
                const n = parseFloat(v)
                if (!isNaN(n) && n >= 0) setFrom("filter", { ...config.fromValues?.filter, value: n })
              },
              (t: string) => setFrom("filter", { type: t, value: config.fromValues?.filter?.value || 0 }),
              config.fromValues?.filter?.type || "blur",
              true
            )}
          </div>

          <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-3">To Values</p>
            {renderPropertyGrid(
              xVal, handleXChange, xUnit, handleXUnitChange,
              yVal, handleYChange, yUnit, handleYUnitChange,
              scaleVal, createNumberHandler(false, (n) => set("scale", n), setScaleVal),
              rotVal, createNumberHandler(true, (n) => set("rotation", n), setRotVal),
              opVal, createNumberHandler(false, (n) => set("opacity", n), setOpVal),
              filterVal,
              (v: string) => {
                setFilterVal(v)
                if (v === "" || v === ".") return
                if (!/^\d*\.?\d*$/.test(v) || !/\d/.test(v)) return
                const n = parseFloat(v)
                if (!isNaN(n) && n >= 0) set("filter", { ...config.filter, value: n })
              },
              (t: string) => set("filter", { type: t, value: config.filter?.value || 0 }),
              config.filter?.type || "blur"
            )}
          </div>
        </div>
      ) : (
        /* Regular from/to */
        renderPropertyGrid(
          xVal, handleXChange, xUnit, handleXUnitChange,
          yVal, handleYChange, yUnit, handleYUnitChange,
          scaleVal, createNumberHandler(false, (n) => set("scale", n), setScaleVal),
          rotVal, createNumberHandler(true, (n) => set("rotation", n), setRotVal),
          opVal, createNumberHandler(false, (n) => set("opacity", n), setOpVal),
          filterVal,
          (v: string) => {
            setFilterVal(v)
            if (v === "" || v === ".") return
            if (!/^\d*\.?\d*$/.test(v) || !/\d/.test(v)) return
            const n = parseFloat(v)
            if (!isNaN(n) && n >= 0) set("filter", { ...config.filter, value: n })
          },
          (t: string) => set("filter", { type: t, value: config.filter?.value || 0 }),
          config.filter?.type || "blur"
        )
      )}

      {/* Repeat & Yoyo */}
      <div className="grid grid-cols-2 gap-3 items-end">
        <Field label="Repeat">
          <Input
            type="text" value={repeatVal}
            onChange={createNumberHandler(false, (n) => set("repeat", n), setRepeatVal, true)}
            className="h-8 text-xs" placeholder="0"
          />
        </Field>
        <div className="flex items-center gap-2 h-8">
          <Checkbox id="yoyo" checked={config.yoyo} onCheckedChange={(c) => set("yoyo", c as boolean)} />
          <Label htmlFor="yoyo" className="text-xs cursor-pointer">Yoyo</Label>
        </div>
      </div>
    </div>
  )
}