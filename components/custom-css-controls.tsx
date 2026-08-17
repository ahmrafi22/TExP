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
      {/* Typography Grid */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Text Hierarchy</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Font Size</Label>
            <Select
              value={config.customStyles.fontSize}
              onValueChange={(value) => handleStyleChange("fontSize", value)}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
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
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Font Weight</Label>
            <Select
              value={config.customStyles.fontWeight}
              onValueChange={(value) => handleStyleChange("fontWeight", value)}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
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

          <div className="col-span-2">
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Font Family</Label>
            <Select
              value={config.customStyles.fontFamily}
              onValueChange={(value) => handleStyleChange("fontFamily", value)}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectGroup>
                  <SelectLabel className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Generic</SelectLabel>
                  <SelectItem value="inherit">Default (System Sans)</SelectItem>
                  <SelectItem value="serif">Serif (Elegant)</SelectItem>
                  <SelectItem value="sans">Sans-serif (Modern)</SelectItem>
                  <SelectItem value="mono">Monospace (Technical)</SelectItem>
                </SelectGroup>
                {getFontCategories().map((category) => (
                  <SelectGroup key={category}>
                    <SelectLabel className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold pt-2">{category}</SelectLabel>
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
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Letter Spacing</Label>
            <Select
              value={config.customStyles.letterSpacing}
              onValueChange={(value) => handleStyleChange("letterSpacing", value)}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
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
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Line Height</Label>
            <Select
              value={config.customStyles.lineHeight}
              onValueChange={(value) => handleStyleChange("lineHeight", value)}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
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
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Transform</Label>
            <Select
              value={config.customStyles.textTransform}
              onValueChange={(value) => handleStyleChange("textTransform", value)}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
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

          <div>
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Decoration</Label>
            <Select
              value={config.customStyles.textDecoration}
              onValueChange={(value) => handleStyleChange("textDecoration", value)}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
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
      </div>

      {/* Colors & Styles */}
      <div className="pt-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Color & Fill</h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide">Text Color</Label>
              <button
                type="button"
                onClick={() => handleStyleChange("color", "inherit")}
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded transition-all ${
                  textColorIsInherit
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted"
                }`}
              >
                Auto (Theme)
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <Input
                  type="color"
                  value={textColorIsInherit ? "#ffffff" : (config.customStyles.color.startsWith("#") ? config.customStyles.color : "#ffffff")}
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                  className="h-8 w-10 p-0 cursor-pointer rounded-md border border-border/80 bg-transparent disabled:opacity-40"
                  disabled={textColorIsInherit}
                />
                {textColorIsInherit && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md pointer-events-none">
                    <Pipette className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Input
                type="text"
                value={config.customStyles.color}
                onChange={(e) => handleStyleChange("color", e.target.value)}
                disabled={textColorIsInherit}
                className="h-8 text-xs font-mono flex-1 bg-muted/40 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary/50"
                placeholder="inherit"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide">Text Background</Label>
              <button
                type="button"
                onClick={() => handleStyleChange("background", "transparent")}
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded transition-all ${
                  textBgIsTransparent
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted"
                }`}
              >
                Transparent
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <Input
                  type="color"
                  value={textBgIsTransparent ? "#ffffff" : (config.customStyles.background.startsWith("#") ? config.customStyles.background : "#ffffff")}
                  onChange={(e) => handleStyleChange("background", e.target.value)}
                  className="h-8 w-10 p-0 cursor-pointer rounded-md border border-border/80 bg-transparent disabled:opacity-40"
                  disabled={textBgIsTransparent}
                />
                {textBgIsTransparent && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md pointer-events-none">
                    <Palette className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Input
                type="text"
                value={config.customStyles.background}
                onChange={(e) => handleStyleChange("background", e.target.value)}
                className="h-8 text-xs font-mono flex-1 bg-muted/40 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary/50"
                placeholder="transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overflow & Clipping Toggles */}
      <div className="pt-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Clipping & Layout</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between h-9 px-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all">
            <div>
              <Label htmlFor="overflow-hidden" className="text-[11px] font-semibold text-foreground/90 cursor-pointer">Text Block Overflow</Label>
              <p className="text-[9px] text-muted-foreground leading-tight">Clips text children inside bounding box</p>
            </div>
            <Switch
              id="overflow-hidden"
              checked={config.customStyles.overflowHidden}
              onCheckedChange={(checked) => handleStyleChange("overflowHidden", checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <div className="flex items-center justify-between h-9 px-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all">
            <div>
              <Label htmlFor="container-overflow" className="text-[11px] font-semibold text-foreground/90 cursor-pointer">Artboard Container Overflow</Label>
              <p className="text-[9px] text-muted-foreground leading-tight">Hides overflow on frame boundaries</p>
            </div>
            <Switch
              id="container-overflow"
              checked={config.customStyles.containerOverflow}
              onCheckedChange={(checked) => handleStyleChange("containerOverflow", checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
