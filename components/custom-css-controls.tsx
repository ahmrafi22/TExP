"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { googleFonts, getFontCategories } from "@/lib/fonts"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { SelectField, ColorField, TextField, isColorLike } from "@/components/dial-controls"
import type { AnimationConfig } from "@/types/animation"

interface CustomCssControlsProps {
  /** Optional external binding — when omitted, reads/writes the playground store. */
  config?: AnimationConfig
  onChange?: (config: AnimationConfig) => void
}

export default function CustomCssControls({ config: propConfig, onChange: propOnChange }: CustomCssControlsProps = {}) {
  const storeConfig = usePlaygroundStore((s) => s.animationConfig)
  const storeOnChange = usePlaygroundStore((s) => s.setAnimationConfig)
  const config = propConfig ?? storeConfig
  const onChange = propOnChange ?? storeOnChange

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
        <div className="flex flex-col gap-1.5">
          <SelectField
            label="Font Size"
            value={config.customStyles.fontSize}
            options={[
              { value: "xs", label: "XS (12px)" },
              { value: "sm", label: "SM (14px)" },
              { value: "base", label: "Base (16px)" },
              { value: "lg", label: "LG (18px)" },
              { value: "xl", label: "XL (20px)" },
              { value: "2xl", label: "2XL (24px)" },
              { value: "3xl", label: "3XL (30px)" },
              { value: "4xl", label: "4XL (36px)" },
              { value: "5xl", label: "5XL (48px)" },
              { value: "6xl", label: "6XL (60px)" },
              { value: "7xl", label: "7XL (72px)" },
              { value: "8xl", label: "8XL (96px)" },
              { value: "9xl", label: "9XL (128px)" },
            ]}
            onChange={(value) => handleStyleChange("fontSize", value)}
          />

          <SelectField
            label="Font Weight"
            value={config.customStyles.fontWeight}
            options={[
              { value: "thin", label: "Thin (100)" },
              { value: "extralight", label: "Extra Light (200)" },
              { value: "light", label: "Light (300)" },
              { value: "normal", label: "Normal (400)" },
              { value: "medium", label: "Medium (500)" },
              { value: "semibold", label: "Semibold (600)" },
              { value: "bold", label: "Bold (700)" },
              { value: "extrabold", label: "Extra Bold (800)" },
              { value: "black", label: "Black (900)" },
            ]}
            onChange={(value) => handleStyleChange("fontWeight", value)}
          />

          {/* Grouped + per-font previewed list: DialKit's flat select can't express it, keep shadcn. */}
          <div>
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

          <SelectField
            label="Letter Spacing"
            value={config.customStyles.letterSpacing}
            options={[
              { value: "tighter", label: "Tighter" },
              { value: "tight", label: "Tight" },
              { value: "normal", label: "Normal" },
              { value: "wide", label: "Wide" },
              { value: "wider", label: "Wider" },
              { value: "widest", label: "Widest" },
            ]}
            onChange={(value) => handleStyleChange("letterSpacing", value)}
          />

          <SelectField
            label="Line Height"
            value={config.customStyles.lineHeight}
            options={[
              { value: "none", label: "None (1)" },
              { value: "tight", label: "Tight (1.25)" },
              { value: "snug", label: "Snug (1.375)" },
              { value: "normal", label: "Normal (1.5)" },
              { value: "relaxed", label: "Relaxed (1.625)" },
              { value: "loose", label: "Loose (2)" },
            ]}
            onChange={(value) => handleStyleChange("lineHeight", value)}
          />

          <SelectField
            label="Transform"
            value={config.customStyles.textTransform}
            options={[
              { value: "none", label: "None" },
              { value: "uppercase", label: "UPPERCASE" },
              { value: "lowercase", label: "lowercase" },
              { value: "capitalize", label: "Capitalize" },
            ]}
            onChange={(value) => handleStyleChange("textTransform", value)}
          />

          <SelectField
            label="Decoration"
            value={config.customStyles.textDecoration}
            options={[
              { value: "none", label: "None" },
              { value: "underline", label: "Underline" },
              { value: "line-through", label: "Line Through" },
              { value: "overline", label: "Overline" },
            ]}
            onChange={(value) => handleStyleChange("textDecoration", value)}
          />
        </div>
      </div>

      {/* Colors & Styles */}
      <div className="pt-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Color & Fill</h4>
        <div className="flex flex-col gap-1.5">
          <div>
            <div className="flex items-center justify-end mb-1">
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
            {isColorLike(config.customStyles.color) ? (
              <ColorField label="Text Color" value={config.customStyles.color} onChange={(v) => handleStyleChange("color", v)} />
            ) : (
              <TextField label="Text Color" value={config.customStyles.color} onChange={(v) => handleStyleChange("color", v)} placeholder="#ffffff" />
            )}
          </div>

          <div>
            <div className="flex items-center justify-end mb-1">
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
            {isColorLike(config.customStyles.background) ? (
              <ColorField label="Text Background" value={config.customStyles.background} onChange={(v) => handleStyleChange("background", v)} />
            ) : (
              <TextField label="Text Background" value={config.customStyles.background} onChange={(v) => handleStyleChange("background", v)} placeholder="transparent" />
            )}
          </div>
        </div>
      </div>

      {/* Overflow & Clipping Toggles */}
      <div className="pt-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Clipping & Layout</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors">
            <div className="min-w-0">
              <Label htmlFor="overflow-hidden" className="text-[11px] font-semibold text-foreground/90 cursor-pointer">Text Block Overflow</Label>
              <p className="text-[9px] text-muted-foreground leading-snug mt-0.5">Clips text children inside bounding box</p>
            </div>
            <Switch
              id="overflow-hidden"
              checked={config.customStyles.overflowHidden}
              onCheckedChange={(checked) => handleStyleChange("overflowHidden", checked)}
              className="data-[state=checked]:bg-primary shrink-0"
            />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors">
            <div className="min-w-0">
              <Label htmlFor="container-overflow" className="text-[11px] font-semibold text-foreground/90 cursor-pointer">Artboard Container Overflow</Label>
              <p className="text-[9px] text-muted-foreground leading-snug mt-0.5">Hides overflow on frame boundaries</p>
            </div>
            <Switch
              id="container-overflow"
              checked={config.customStyles.containerOverflow}
              onCheckedChange={(checked) => handleStyleChange("containerOverflow", checked)}
              className="data-[state=checked]:bg-primary shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
