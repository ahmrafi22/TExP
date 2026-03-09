"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface SplitTextConfig {
  enabled: boolean
  type: "chars" | "words"
  stagger: number
}

interface SplitTextControlsProps {
  config: SplitTextConfig
  onChange: (config: SplitTextConfig) => void
}

export default function SplitTextControls({ config, onChange }: SplitTextControlsProps) {
  const handleChange = (key: keyof SplitTextConfig, value: any) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">Enable Split Text</Label>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => handleChange("enabled", checked)}
        />
      </div>

      {config.enabled && (
        <div className="space-y-3 pt-1">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Split Type</Label>
            <Select
              value={config.type}
              onValueChange={(value: "chars" | "words") => handleChange("type", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chars">Characters</SelectItem>
                <SelectItem value="words">Words</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Stagger Delay (s)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={config.stagger}
              onChange={(e) => handleChange("stagger", Number(e.target.value))}
              className="h-8 text-xs"
              placeholder="0.1"
            />
          </div>
        </div>
      )}
    </div>
  )
}
