"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { BackgroundConfig } from "@/types/animation"
import { Upload } from "lucide-react"

interface BackgroundControlsProps {
  config: BackgroundConfig
  onChange: (config: BackgroundConfig) => void
}

export default function BackgroundControls({ config, onChange }: BackgroundControlsProps) {
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

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Background Type</Label>
        <Select value={config.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.type === "solid" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleColorChange("auto")}
              className={`h-8 px-3 text-xs font-medium rounded-md transition-colors ${
                config.color === "auto"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Auto (Theme)
            </button>
            <button
              onClick={() => handleColorChange("#ffffff")}
              className={`h-8 w-8 rounded-md border-2 bg-white transition-colors ${
                config.color !== "auto" ? "border-primary" : "border-border"
              }`}
              title="Custom color"
            />
          </div>
          {config.color !== "auto" && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Color</Label>
              <Input
                type="color"
                value={config.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-8 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {config.type === "gradient" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Gradient Type</Label>
            <Select
              value={config.gradient.type}
              onValueChange={(type: "linear" | "radial") => handleGradientChange({ type })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Color 1</Label>
              <Input
                type="color"
                value={config.gradient.colors[0]}
                onChange={(e) =>
                  handleGradientChange({ colors: [e.target.value, config.gradient.colors[1]] })
                }
                className="w-full h-8 cursor-pointer"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Color 2</Label>
              <Input
                type="color"
                value={config.gradient.colors[1]}
                onChange={(e) =>
                  handleGradientChange({ colors: [config.gradient.colors[0], e.target.value] })
                }
                className="w-full h-8 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Direction</Label>
            <Select
              value={config.gradient.direction}
              onValueChange={(direction) => handleGradientChange({ direction })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.gradient.type === "linear" ? (
                  <>
                    <SelectItem value="to right">To Right</SelectItem>
                    <SelectItem value="to left">To Left</SelectItem>
                    <SelectItem value="to bottom">To Bottom</SelectItem>
                    <SelectItem value="to top">To Top</SelectItem>
                    <SelectItem value="to bottom right">To Bottom Right</SelectItem>
                    <SelectItem value="to bottom left">To Bottom Left</SelectItem>
                    <SelectItem value="to top right">To Top Right</SelectItem>
                    <SelectItem value="to top left">To Top Left</SelectItem>
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
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Upload Image</Label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
          <Button
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            className="w-full h-8 text-xs"
          >
            <Upload className="w-3 h-3 mr-1.5" />
            Choose Image
          </Button>
        </div>
      )}
    </div>
  )
}
