"use client"

import type { BackgroundConfig } from "@/types/animation"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"
import { DialScope, SelectField, ColorField } from "@/components/dial-controls"
import { ImageControl } from "dialkit"

const backgroundStyles = [
  { value: "solid", label: "Solid Color" },
  { value: "gradient", label: "Gradient Fill" },
  { value: "image", label: "Image Artboard" },
]

const linearDirections = [
  { value: "to right", label: "To Right →" },
  { value: "to left", label: "To Left ←" },
  { value: "to bottom", label: "To Bottom ↓" },
  { value: "to top", label: "To Top ↑" },
  { value: "to bottom right", label: "To Bottom Right ↘" },
  { value: "to bottom left", label: "To Bottom Left ↙" },
  { value: "to top right", label: "To Top Right ↗" },
  { value: "to top left", label: "To Top Left ↖" },
  { value: "45deg", label: "45° Angle" },
  { value: "90deg", label: "90° Angle" },
  { value: "135deg", label: "135° Angle" },
  { value: "180deg", label: "180° Angle" },
]

const radialDirections = [
  { value: "circle", label: "Circle Center" },
  { value: "ellipse", label: "Ellipse Shape" },
  { value: "circle at center", label: "Circular (Absolute Center)" },
  { value: "circle at top", label: "Circular (Top Origin)" },
  { value: "circle at bottom", label: "Circular (Bottom Origin)" },
  { value: "circle at left", label: "Circular (Left Origin)" },
  { value: "circle at right", label: "Circular (Right Origin)" },
]

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

  return (
    <div className="flex flex-col gap-1.5">
      <SelectField
        label="Background Style"
        value={config.type}
        options={backgroundStyles}
        onChange={(v) => handleTypeChange(v as "solid" | "gradient" | "image")}
      />

      {config.type === "solid" && (
        <div className="flex flex-col gap-2 pt-1.5 animate-fade-in duration-200">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/30 border border-border/60">
            <button
              type="button"
              onClick={() => handleColorChange("auto")}
              className={`flex-1 h-7 text-[11px] font-semibold rounded-md transition-all ${
                config.color === "auto"
                  ? "bg-background text-foreground"
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
                  ? "bg-background text-foreground"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              Custom HEX
            </button>
          </div>
          {config.color !== "auto" && (
            <ColorField label="Solid Color" value={config.color} onChange={handleColorChange} />
          )}
        </div>
      )}

      {config.type === "gradient" && (
        <div className="flex flex-col gap-2 pt-1.5 animate-fade-in duration-200">
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

          <SelectField
            label="Gradient Type"
            value={config.gradient.type}
            options={[
              { value: "linear", label: "Linear Gradient" },
              { value: "radial", label: "Radial Gradient" },
            ]}
            onChange={(type) => handleGradientChange({ type: type as "linear" | "radial" })}
          />

          <ColorField
            label="Color Start"
            value={config.gradient.colors[0]}
            onChange={(v) => handleGradientChange({ colors: [v, config.gradient.colors[1]] })}
          />
          <ColorField
            label="Color End"
            value={config.gradient.colors[1]}
            onChange={(v) => handleGradientChange({ colors: [config.gradient.colors[0], v] })}
          />

          <SelectField
            label="Direction & Spread"
            value={config.gradient.direction}
            options={config.gradient.type === "linear" ? linearDirections : radialDirections}
            onChange={(direction) => handleGradientChange({ direction })}
          />
        </div>
      )}

      {config.type === "image" && (
        <DialScope className="pt-1.5 animate-fade-in duration-200">
          <ImageControl
            label="Background Image"
            value={config.image ?? ""}
            onChange={(v) => onChange({ ...config, image: v || null })}
          />
        </DialScope>
      )}
    </div>
  )
}
