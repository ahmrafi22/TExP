"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { SliderField, SelectField } from "@/components/dial-controls"
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
        <div className="flex flex-col gap-1.5 pt-1.5 animate-fade-in duration-200">
          <SelectField
            label="Split Type"
            value={config.type}
            options={[
              { value: "chars", label: "Characters" },
              { value: "words", label: "Words" },
              { value: "lines", label: "Lines" },
            ]}
            onChange={(value) => handleChange("type", value)}
          />

          <SliderField
            label="Stagger Delay"
            value={config.stagger}
            min={0}
            max={1}
            step={0.01}
            onChange={(n) => handleChange("stagger", n)}
            suffix="s"
          />

          <SelectField
            label="Stagger Origin"
            value={config.staggerFrom}
            options={[
              { value: "start", label: "Start (Left to Right)" },
              { value: "center", label: "Center (Outward)" },
              { value: "end", label: "End (Right to Left)" },
              { value: "random", label: "Randomized" },
              { value: "edges", label: "Edges (Inward)" },
            ]}
            onChange={(value) => handleChange("staggerFrom", value)}
          />
        </div>
      )}
    </div>
  )
}
