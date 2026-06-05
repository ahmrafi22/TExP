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
        <Label className="text-[11px] text-muted-foreground mb-1 block">Background Type</Label>
        <Select value={config.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.type === "solid" && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/40 border border-border">
            <button
              onClick={() => handleColorChange("auto")}
              className={`flex-1 h-7 px-3 text-[11px] font-medium rounded-md transition-all ${
                config.color === "auto"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Auto (Theme)
            </button>
            <button
              onClick={() => handleColorChange("#ffffff")}
              className={`flex-1 h-7 px-3 text-[11px] font-medium rounded-md transition-all ${
                config.color !== "auto"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Custom
            </button>
          </div>
          {config.color !== "auto" && (
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Input
                  type="color"
                  value={config.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="h-9 w-12 p-0.5 cursor-pointer rounded-md overflow-hidden border border-input"
                />
              </div>
              <div className="flex-1 flex items-center h-9 px-2.5 rounded-md border border-input bg-muted/30 text-[11px] font-mono text-muted-foreground">
                {config.color.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      )}

      {config.type === "gradient" && (
        <div className="space-y-3">
          <div
            className="h-12 rounded-lg border border-border"
            style={{
              background: config.gradient.type === "radial"
                ? `radial-gradient(${config.gradient.direction}, ${config.gradient.colors.join(", ")})`
                : `linear-gradient(${config.gradient.direction}, ${config.gradient.colors.join(", ")})`,
            }}
            aria-label="Gradient preview"
          />
          <div>
            <Label className="text-[11px] text-muted-foreground mb-1 block">Gradient Type</Label>
            <Select
              value={config.gradient.type}
              onValueChange={(type: "linear" | "radial") => handleGradientChange({ type })}
            >
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Color 1</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="color"
                  value={config.gradient.colors[0]}
                  onChange={(e) =>
                    handleGradientChange({ colors: [e.target.value, config.gradient.colors[1]] })
                  }
                  className="h-9 w-10 p-0.5 cursor-pointer rounded-md overflow-hidden border border-input"
                />
                <div className="flex-1 h-9 px-2 flex items-center rounded-md border border-input bg-muted/30 text-[10px] font-mono text-muted-foreground truncate">
                  {config.gradient.colors[0].toUpperCase()}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Color 2</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="color"
                  value={config.gradient.colors[1]}
                  onChange={(e) =>
                    handleGradientChange({ colors: [config.gradient.colors[0], e.target.value] })
                  }
                  className="h-9 w-10 p-0.5 cursor-pointer rounded-md overflow-hidden border border-input"
                />
                <div className="flex-1 h-9 px-2 flex items-center rounded-md border border-input bg-muted/30 text-[10px] font-mono text-muted-foreground truncate">
                  {config.gradient.colors[1].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground mb-1 block">Direction</Label>
            <Select
              value={config.gradient.direction}
              onValueChange={(direction) => handleGradientChange({ direction })}
            >
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
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
                    <SelectItem value="45deg">45°</SelectItem>
                    <SelectItem value="90deg">90°</SelectItem>
                    <SelectItem value="135deg">135°</SelectItem>
                    <SelectItem value="180deg">180°</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="ellipse">Ellipse</SelectItem>
                    <SelectItem value="circle at center">Circle at Center</SelectItem>
                    <SelectItem value="circle at top">Circle at Top</SelectItem>
                    <SelectItem value="circle at bottom">Circle at Bottom</SelectItem>
                    <SelectItem value="circle at left">Circle at Left</SelectItem>
                    <SelectItem value="circle at right">Circle at Right</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {config.type === "image" && (
        <div className="space-y-2.5">
          {config.image ? (
            <div className="relative rounded-lg overflow-hidden border border-border group">
              <img
                src={config.image}
                alt="Background preview"
                className="w-full h-32 object-cover"
              />
              <button
                onClick={clearImage}
                className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
              <p className="text-[11px]">No image selected</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
          <Button
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            className="w-full h-8 text-xs"
          >
            <Upload className="w-3 h-3 mr-1.5" />
            {config.image ? "Replace Image" : "Choose Image"}
          </Button>
        </div>
      )}
    </div>
  )
}
