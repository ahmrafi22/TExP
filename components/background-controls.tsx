"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { BackgroundConfig } from "@/types/animation"
import { Upload, Image as ImageIcon, X } from "lucide-react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"

export default function BackgroundControls() {
  const { config, onChange } = usePlaygroundStore(
    useShallow((s) => ({
      config: s.backgroundConfig,
      onChange: s.setBackgroundConfig,
    })),
  )

  const handleTypeChange = (type: "solid" | "gradient" | "image") => {
    if (type === "solid" && config.type !== "solid") {
      onChange({ ...config, type, color: "auto" })
    } else {
      onChange({ ...config, type })
    }
  }

  const handleColorChange = (color: string) => {
    onChange({ ...config, color })
  }

  const handleGradientChange = (gradient: Partial<BackgroundConfig["gradient"]>) => {
    const newGradient = { ...config.gradient, ...gradient }
    if (gradient.type && gradient.type !== config.gradient.type) {
      newGradient.direction = gradient.type === "radial" ? "circle" : "to right"
    }
    onChange({ ...config, gradient: newGradient })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange({ ...config, image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => onChange({ ...config, image: null })

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Background Style</Label>
        <Select value={config.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient Fill</SelectItem>
            <SelectItem value="image">Image Artboard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.type === "solid" && (
        <div className="space-y-3.5 pt-1.5 animate-fade-in duration-200">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/30 border border-border/60">
            <button
              type="button"
              onClick={() => handleColorChange("auto")}
              className={`flex-1 h-7 text-[11px] font-semibold rounded-md transition-all ${
                config.color === "auto"
                  ? "bg-background shadow-xs text-foreground"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              Auto (Theme)
            </button>
            <button
              type="button"
              onClick={() => handleColorChange("#ffffff")}
              className={`flex-1 h-7 text-[11px] font-semibold rounded-md transition-all ${
                config.color !== "auto"
                  ? "bg-background shadow-xs text-foreground"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              Custom HEX
            </button>
          </div>
          {config.color !== "auto" && (
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <Input
                  type="color"
                  value={config.color.startsWith("#") ? config.color : "#ffffff"}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="h-8 w-10 p-0 cursor-pointer rounded-md border border-border/80 bg-transparent"
                />
              </div>
              <Input
                type="text"
                value={config.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-8 text-xs font-mono flex-1 bg-muted/40 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary/50"
                placeholder="#ffffff"
              />
            </div>
          )}
        </div>
      )}

      {config.type === "gradient" && (
        <div className="space-y-4 pt-1.5 animate-fade-in duration-200">
          <div
            className="h-10 rounded-lg border border-border/60 shadow-inner relative overflow-hidden"
            style={{
              background: config.gradient.type === "radial"
                ? `radial-gradient(${config.gradient.direction}, ${config.gradient.colors.join(", ")})`
                : `linear-gradient(${config.gradient.direction}, ${config.gradient.colors.join(", ")})`,
            }}
            aria-label="Gradient preview"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:8px_8px] opacity-30 pointer-events-none" />
          </div>

          <div>
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Gradient Type</Label>
            <Select
              value={config.gradient.type}
              onValueChange={(type: "linear" | "radial") => handleGradientChange({ type })}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear Gradient</SelectItem>
                <SelectItem value="radial">Radial Gradient</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide">Color Start</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="color"
                  value={config.gradient.colors[0].startsWith("#") ? config.gradient.colors[0] : "#ffffff"}
                  onChange={(e) =>
                    handleGradientChange({ colors: [e.target.value, config.gradient.colors[1]] })
                  }
                  className="h-8 w-10 p-0 cursor-pointer rounded-md border border-border/80 bg-transparent"
                />
                <Input
                  type="text"
                  value={config.gradient.colors[0]}
                  onChange={(e) =>
                    handleGradientChange({ colors: [e.target.value, config.gradient.colors[1]] })
                  }
                  className="h-8 text-xs font-mono flex-1 bg-muted/40 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary/50"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide">Color End</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="color"
                  value={config.gradient.colors[1].startsWith("#") ? config.gradient.colors[1] : "#ffffff"}
                  onChange={(e) =>
                    handleGradientChange({ colors: [config.gradient.colors[0], e.target.value] })
                  }
                  className="h-8 w-10 p-0 cursor-pointer rounded-md border border-border/80 bg-transparent"
                />
                <Input
                  type="text"
                  value={config.gradient.colors[1]}
                  onChange={(e) =>
                    handleGradientChange({ colors: [config.gradient.colors[0], e.target.value] })
                  }
                  className="h-8 text-xs font-mono flex-1 bg-muted/40 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary/50"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-medium text-muted-foreground/95 tracking-wide mb-1.5 block">Direction & Spread</Label>
            <Select
              value={config.gradient.direction}
              onValueChange={(direction) => handleGradientChange({ direction })}
            >
              <SelectTrigger className="h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.gradient.type === "linear" ? (
                  <>
                    <SelectItem value="to right">To Right →</SelectItem>
                    <SelectItem value="to left">To Left ←</SelectItem>
                    <SelectItem value="to bottom">To Bottom ↓</SelectItem>
                    <SelectItem value="to top">To Top ↑</SelectItem>
                    <SelectItem value="to bottom right">To Bottom Right ↘</SelectItem>
                    <SelectItem value="to bottom left">To Bottom Left ↙</SelectItem>
                    <SelectItem value="to top right">To Top Right ↗</SelectItem>
                    <SelectItem value="to top left">To Top Left ↖</SelectItem>
                    <SelectItem value="45deg">45° Angle</SelectItem>
                    <SelectItem value="90deg">90° Angle</SelectItem>
                    <SelectItem value="135deg">135° Angle</SelectItem>
                    <SelectItem value="180deg">180° Angle</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="circle">Circle Center</SelectItem>
                    <SelectItem value="ellipse">Ellipse Shape</SelectItem>
                    <SelectItem value="circle at center">Circular (Absolute Center)</SelectItem>
                    <SelectItem value="circle at top">Circular (Top Origin)</SelectItem>
                    <SelectItem value="circle at bottom">Circular (Bottom Origin)</SelectItem>
                    <SelectItem value="circle at left">Circular (Left Origin)</SelectItem>
                    <SelectItem value="circle at right">Circular (Right Origin)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {config.type === "image" && (
        <div className="space-y-3 pt-1.5 animate-fade-in duration-200">
          {config.image ? (
            <div className="relative rounded-xl overflow-hidden border border-border/60 group shadow-md">
              <img
                src={config.image}
                alt="Background preview"
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/90 backdrop-blur-md border border-border/60 flex items-center justify-center text-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all shadow-md active:scale-95"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-32 rounded-xl border-2 border-dashed border-border/60 hover:border-border/100 bg-muted/10 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground/60">
              <ImageIcon className="h-6 w-6 text-muted-foreground/45" />
              <p className="text-[11px] font-medium">Select background image</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
          <Button
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            className="w-full h-8 text-xs bg-muted/40 border-border/80 hover:bg-muted/60 transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            {config.image ? "Replace Image" : "Choose Image File"}
          </Button>
        </div>
      )}
    </div>
  )
}
