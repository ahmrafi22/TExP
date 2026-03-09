"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { AnimationConfig } from "@/types/animation"

interface CustomCssControlsProps {
  config: AnimationConfig
  onChange: (config: AnimationConfig) => void
}

export default function CustomCssControls({ config, onChange }: CustomCssControlsProps) {
  const handleStyleChange = (key: string, value: any) => {
    onChange({
      ...config,
      customStyles: {
        ...config.customStyles,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-4">
      {/* Typography Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Font Size</Label>
          <Select
            value={config.customStyles.fontSize}
            onValueChange={(value) => handleStyleChange("fontSize", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">XS (12px)</SelectItem>
              <SelectItem value="sm">SM (14px)</SelectItem>
              <SelectItem value="base">Base (16px)</SelectItem>
              <SelectItem value="lg">LG (18px)</SelectItem>
              <SelectItem value="xl">XL (20px)</SelectItem>
              <SelectItem value="2xl">2XL (24px)</SelectItem>
              <SelectItem value="3xl">3XL (30px)</SelectItem>
              <SelectItem value="4xl">4XL (36px)</SelectItem>
              <SelectItem value="5xl">5XL (48px)</SelectItem>
              <SelectItem value="6xl">6XL (60px)</SelectItem>
              <SelectItem value="7xl">7XL (72px)</SelectItem>
              <SelectItem value="8xl">8XL (96px)</SelectItem>
              <SelectItem value="9xl">9XL (128px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Font Weight</Label>
          <Select
            value={config.customStyles.fontWeight}
            onValueChange={(value) => handleStyleChange("fontWeight", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thin">Thin (100)</SelectItem>
              <SelectItem value="extralight">Extra Light (200)</SelectItem>
              <SelectItem value="light">Light (300)</SelectItem>
              <SelectItem value="normal">Normal (400)</SelectItem>
              <SelectItem value="medium">Medium (500)</SelectItem>
              <SelectItem value="semibold">Semibold (600)</SelectItem>
              <SelectItem value="bold">Bold (700)</SelectItem>
              <SelectItem value="extrabold">Extra Bold (800)</SelectItem>
              <SelectItem value="black">Black (900)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Font Family</Label>
          <Select
            value={config.customStyles.fontFamily}
            onValueChange={(value) => handleStyleChange("fontFamily", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inherit">Default</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Letter Spacing</Label>
          <Select
            value={config.customStyles.letterSpacing}
            onValueChange={(value) => handleStyleChange("letterSpacing", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tighter">Tighter</SelectItem>
              <SelectItem value="tight">Tight</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="wide">Wide</SelectItem>
              <SelectItem value="wider">Wider</SelectItem>
              <SelectItem value="widest">Widest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Line Height</Label>
          <Select
            value={config.customStyles.lineHeight}
            onValueChange={(value) => handleStyleChange("lineHeight", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (1)</SelectItem>
              <SelectItem value="tight">Tight (1.25)</SelectItem>
              <SelectItem value="snug">Snug (1.375)</SelectItem>
              <SelectItem value="normal">Normal (1.5)</SelectItem>
              <SelectItem value="relaxed">Relaxed (1.625)</SelectItem>
              <SelectItem value="loose">Loose (2)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Text Transform</Label>
          <Select
            value={config.customStyles.textTransform}
            onValueChange={(value) => handleStyleChange("textTransform", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="uppercase">UPPERCASE</SelectItem>
              <SelectItem value="lowercase">lowercase</SelectItem>
              <SelectItem value="capitalize">Capitalize</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Text Decoration</Label>
          <Select
            value={config.customStyles.textDecoration}
            onValueChange={(value) => handleStyleChange("textDecoration", value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="underline">Underline</SelectItem>
              <SelectItem value="line-through">Line Through</SelectItem>
              <SelectItem value="overline">Overline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3 pt-1">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Text Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              value={config.customStyles.color === "inherit" ? "#000000" : config.customStyles.color}
              onChange={(e) => handleStyleChange("color", e.target.value)}
              className="h-8 w-14 p-1 cursor-pointer"
            />
            <code className="text-[10px] text-muted-foreground font-mono flex-1 truncate">
              {config.customStyles.color}
            </code>
            <button
              onClick={() => handleStyleChange("color", "inherit")}
              className="h-7 px-2.5 text-[10px] font-medium rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            >
              Auto
            </button>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Text Background</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              value={config.customStyles.background === "transparent" ? "#ffffff" : config.customStyles.background}
              onChange={(e) => handleStyleChange("background", e.target.value)}
              className="h-8 w-14 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={config.customStyles.background}
              onChange={(e) => handleStyleChange("background", e.target.value)}
              className="h-8 text-xs flex-1"
              placeholder="transparent"
            />
          </div>
        </div>
      </div>

      {/* Overflow toggles */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Text Overflow Hidden</Label>
          <Switch
            checked={config.customStyles.overflowHidden}
            onCheckedChange={(checked) => handleStyleChange("overflowHidden", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Container Overflow Hidden</Label>
          <Switch
            checked={config.customStyles.containerOverflow}
            onCheckedChange={(checked) => handleStyleChange("containerOverflow", checked)}
          />
        </div>
      </div>
    </div>
  )
}
