"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useRef } from "react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"

export default function SplitTextControls() {
  const { config, setSplitTextConfig } = usePlaygroundStore(
    useShallow((s) => ({
      config: s.splitTextConfig,
      setSplitTextConfig: s.setSplitTextConfig,
    })),
  )

  const handleChange = (key: keyof typeof config, value: any) => {
    setSplitTextConfig({ ...config, [key]: value })
  }

  const [staggerStr, setStaggerStr] = useState(String(config.stagger))
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setStaggerStr(String(config.stagger))
  }, [config.stagger])

  const staggerVal = isNaN(parseFloat(staggerStr)) ? 0 : parseFloat(staggerStr)
  const clamped = Math.min(1, Math.max(0, staggerVal))
  const pct = (clamped / 1) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-medium">Enable Split Text</Label>
          <p className="text-[10px] text-muted-foreground mt-0.5">Animate per character/word</p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => handleChange("enabled", checked)}
        />
      </div>

      {config.enabled && (
        <div className="space-y-3 pt-1">
          <div>
            <Label className="text-[11px] text-muted-foreground mb-1 block">Split Type</Label>
            <Select
              value={config.type}
              onValueChange={(value: "chars" | "words" | "lines") => handleChange("type", value)}
            >
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="chars">Characters</SelectItem>
                <SelectItem value="words">Words</SelectItem>
                <SelectItem value="lines">Lines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] text-muted-foreground">Stagger Delay</Label>
              <span className="text-[10px] text-muted-foreground/60">seconds</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 h-8 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={clamped}
                  onChange={(e) => {
                    const n = parseFloat(e.target.value)
                    handleChange("stagger", n)
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className="w-full h-[4px] rounded-full relative pointer-events-none"
                  style={{ background: `linear-gradient(to right, hsl(var(--primary)) ${pct}%, hsl(var(--muted)) ${pct}%)` }}
                >
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full bg-primary border-2 border-background shadow-md pointer-events-none transition-[left] duration-75"
                    style={{ left: `calc(${pct}% - 7px)` }}
                  />
                </div>
              </div>
              <input
                type="number"
                step={0.01}
                min={0}
                value={staggerStr}
                onFocus={() => { focused.current = true }}
                onChange={(e) => {
                  setStaggerStr(e.target.value)
                  const n = parseFloat(e.target.value)
                  if (!isNaN(n) && n >= 0) handleChange("stagger", Math.min(1, n))
                }}
                onBlur={() => {
                  focused.current = false
                  const n = parseFloat(staggerStr)
                  if (!isNaN(n)) {
                    const c = Math.min(1, Math.max(0, n))
                    handleChange("stagger", c)
                    setStaggerStr(String(c))
                  } else {
                    setStaggerStr(String(config.stagger))
                  }
                }}
                className="w-[58px] h-8 text-center text-[11px] bg-muted/50 border border-input rounded-md px-1 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div>
            <Label className="text-[11px] text-muted-foreground mb-1 block">Stagger From</Label>
            <Select
              value={config.staggerFrom}
              onValueChange={(value: "start" | "center" | "end" | "random" | "edges") => handleChange("staggerFrom", value)}
            >
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="edges">Edges</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
