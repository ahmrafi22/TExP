"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { googleFonts, getFontCategories } from "@/lib/fonts"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"
import { Palette, Pipette } from "lucide-react"

export default function CustomCssControls() {
  const { config, onChange } = usePlaygroundStore(
    useShallow((s) => ({
      config: s.animationConfig,
      onChange: s.setAnimationConfig,
    })),
  )

  const handleStyleChange = (key: string, value: any) => {
    onChange({
      ...config,
      customStyles: {
        ...config.customStyles,
        [key]: value,
      },
    })
  }

  const textColorIsInherit = config.customStyles.color === "inherit"
  const textBgIsTransparent = config.customStyles.background === "transparent"

  return (
    <div className="space-y-4">
      {/* Typography Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[11px] text-muted-foreground mb-1 block">Font Size</Label>
          <Select
            value={config.customStyles.fontSize}
            onValueChange={(value) => handleStyleChange("fontSize", value)}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
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
          <Label className="text-[11px] text-muted-foreground mb-1 block">Font Weight</Label>
          <Select
            value={config.customStyles.fontWeight}
            onValueChange={(value) => handleStyleChange("fontWeight", value)}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
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

        <div className="col-span-2">
          <Label className="text-[11px] text-muted-foreground mb-1 block">Font Family</Label>
          <Select
            value={config.customStyles.fontFamily}
            onValueChange={(value) => handleStyleChange("fontFamily", value)}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectGroup>
                <SelectLabel className="text-[10px]">Generic</SelectLabel>
                <SelectItem value="inherit">Default</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="sans">Sans-serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
              </SelectGroup>
              {getFontCategories().map((category) => (
                <SelectGroup key={category}>
                  <SelectLabel className="text-[10px]">{category}</SelectLabel>
                  {googleFonts
                    .filter((f) => f.category === category)
                    .map((font) => (
                      <SelectItem key={font.key} value={font.key} style={{ fontFamily: `var(--font-${font.key})` }}>
                        {font.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[11px] text-muted-foreground mb-1 block">Letter Spacing</Label>
          <Select
            value={config.customStyles.letterSpacing}
            onValueChange={(value) => handleStyleChange("letterSpacing", value)}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
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
          <Label className="text-[11px] text-muted-foreground mb-1 block">Line Height</Label>
          <Select
            value={config.customStyles.lineHeight}
            onValueChange={(value) => handleStyleChange("lineHeight", value)}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
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
          <Label className="text-[11px] text-muted-foreground mb-1 block">Text Transform</Label>
          <Select
            value={config.customStyles.textTransform}
            onValueChange={(value) => handleStyleChange("textTransform", value)}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="uppercase">UPPERCASE</SelectItem>
              <SelectItem value="lowercase">lowercase</SelectItem>
              <SelectItem value="capitalize">Capitalize</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[11px] text-muted-foreground mb-1 block">Text Decoration</Label>
          <Select
            value={config.customStyles.textDecoration}
            onValueChange={(value) => handleStyleChange("textDecoration", value)}
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
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
      <div className="space-y-2.5 pt-1">
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[11px] text-muted-foreground">Text Color</Label>
            <button
              onClick={() => handleStyleChange("color", "inherit")}
              className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {textColorIsInherit ? "✓ Auto" : "Use Auto"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <Input
                type="color"
                value={textColorIsInherit ? "#000000" : config.customStyles.color}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                className="h-9 w-12 p-0.5 cursor-pointer rounded-md overflow-hidden border border-input"
                disabled={textColorIsInherit}
              />
              {textColorIsInherit && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md pointer-events-none">
                  <Pipette className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 h-9 px-2.5 flex items-center rounded-md border border-input bg-muted/30 text-[11px] font-mono text-muted-foreground">
              {config.customStyles.color}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[11px] text-muted-foreground">Text Background</Label>
            <button
              onClick={() => handleStyleChange("background", "transparent")}
              className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {textBgIsTransparent ? "✓ Transparent" : "Clear"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <Input
                type="color"
                value={textBgIsTransparent ? "#ffffff" : config.customStyles.background}
                onChange={(e) => handleStyleChange("background", e.target.value)}
                className="h-9 w-12 p-0.5 cursor-pointer rounded-md overflow-hidden border border-input"
                disabled={textBgIsTransparent}
              />
              {textBgIsTransparent && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md pointer-events-none">
                  <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
            <Input
              type="text"
              value={config.customStyles.background}
              onChange={(e) => handleStyleChange("background", e.target.value)}
              className="h-9 text-xs flex-1 font-mono"
              placeholder="transparent"
            />
          </div>
        </div>
      </div>

      {/* Overflow toggles */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between h-9 px-3 rounded-md border border-input bg-muted/30 hover:bg-muted/50 transition-colors">
          <div>
            <Label htmlFor="overflow-hidden" className="text-[11px] font-medium cursor-pointer">Text Overflow</Label>
            <p className="text-[10px] text-muted-foreground leading-tight">Clips animated text</p>
          </div>
          <Switch
            id="overflow-hidden"
            checked={config.customStyles.overflowHidden}
            onCheckedChange={(checked) => handleStyleChange("overflowHidden", checked)}
          />
        </div>
        <div className="flex items-center justify-between h-9 px-3 rounded-md border border-input bg-muted/30 hover:bg-muted/50 transition-colors">
          <div>
            <Label htmlFor="container-overflow" className="text-[11px] font-medium cursor-pointer">Container Overflow</Label>
            <p className="text-[10px] text-muted-foreground leading-tight">Hides box edges</p>
          </div>
          <Switch
            id="container-overflow"
            checked={config.customStyles.containerOverflow}
            onCheckedChange={(checked) => handleStyleChange("containerOverflow", checked)}
          />
        </div>
      </div>
    </div>
  )
}
