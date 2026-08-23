"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { SliderField } from "./animation-controls"
import type { SplitTextConfig } from "@/types/animation"

interface SplitTextControlsProps {
  /** Optional external binding — when omitted, reads/writes the playground store. */
  config?: SplitTextConfig
  setSplitTextConfig?: (config: SplitTextConfig) => void
}

export default function SplitTextControls({ config: propConfig, setSplitTextConfig: propSetter }: SplitTextControlsProps = {}) {
  const storeConfig = usePlaygroundStore((s) => s.splitTextConfig)
  const storeSetter = usePlaygroundStore((s) => s.setSplitTextConfig)
  const config = propConfig ?? storeConfig
  const setSplitTextConfig = propSetter ?? storeSetter

  const handleChange = (key: keyof typeof config, value: any) => {
    setSplitTextConfig({ ...config, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg border border-border/60">
        <div>
          <Label className="text-xs font-semibold tracking-wide text-foreground">Enable Split Text</Label>
          <p className="text-[10px] text-muted-foreground mt-0.5">Animate per character, word, or line</p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => handleChange("enabled", checked)}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {config.enabled && (
        <div className="space-y-4 pt-1.5 animate-fade-in duration-200">
          <div>
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Split Type</Label>
            <Select
              value={config.type}
              onValueChange={(value: "chars" | "words" | "lines") => handleChange("type", value)}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chars">Characters</SelectItem>
                <SelectItem value="words">Words</SelectItem>
                <SelectItem value="lines">Lines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SliderField
            label="Stagger Delay"
            value={config.stagger}
            min={0}
            max={1}
            step={0.01}
            onChange={(n) => handleChange("stagger", n)}
            suffix="seconds"
          />

          <div>
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Stagger Origin</Label>
            <Select
              value={config.staggerFrom}
              onValueChange={(value: "start" | "center" | "end" | "random" | "edges") => handleChange("staggerFrom", value)}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start (Left to Right)</SelectItem>
                <SelectItem value="center">Center (Outward)</SelectItem>
                <SelectItem value="end">End (Right to Left)</SelectItem>
                <SelectItem value="random">Randomized</SelectItem>
                <SelectItem value="edges">Edges (Inward)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
