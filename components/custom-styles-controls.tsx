"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { AnimationConfig } from "@/types/animation"

interface CustomStylesControlsProps {
  config: AnimationConfig
  onChange: (config: AnimationConfig) => void
}

const fontSizeOptions = [
  { value: "xs", label: "Extra Small" },
  { value: "sm", label: "Small" },
  { value: "base", label: "Base" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
  { value: "4xl", label: "4XL" },
  { value: "5xl", label: "5XL" },
  { value: "6xl", label: "6XL" },
  { value: "7xl", label: "7XL" },
  { value: "8xl", label: "8XL" },
  { value: "9xl", label: "9XL" },
]

const fontFamilyOptions = [
  { value: "inherit", label: "Inherit" },
  { value: "sans", label: "Sans Serif" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Monospace" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Courier New, monospace", label: "Courier New" },
]

const fontWeightOptions = [
  { value: "thin", label: "Thin (100)" },
  { value: "extralight", label: "Extra Light (200)" },
  { value: "light", label: "Light (300)" },
  { value: "normal", label: "Normal (400)" },
  { value: "medium", label: "Medium (500)" },
  { value: "semibold", label: "Semi Bold (600)" },
  { value: "bold", label: "Bold (700)" },
  { value: "extrabold", label: "Extra Bold (800)" },
  { value: "black", label: "Black (900)" },
]

const letterSpacingOptions = [
  { value: "tighter", label: "Tighter" },
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal" },
  { value: "wide", label: "Wide" },
  { value: "wider", label: "Wider" },
  { value: "widest", label: "Widest" },
]

const textTransformOptions = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "lowercase", label: "lowercase" },
  { value: "capitalize", label: "Capitalize" },
]

const textDecorationOptions = [
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "overline", label: "Overline" },
  { value: "line-through", label: "Line Through" },
]

const lineHeightOptions = [
  { value: "none", label: "None" },
  { value: "tight", label: "Tight" },
  { value: "snug", label: "Snug" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" },
  { value: "loose", label: "Loose" },
]

export default function CustomStylesControls({ config, onChange }: CustomStylesControlsProps) {
  const handleCustomStyleChange = (key: keyof AnimationConfig["customStyles"], value: string | boolean) => {
    onChange({
      ...config,
      customStyles: {
        ...config.customStyles,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Typography Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs">Font Size</Label>
          <Select
            value={config.customStyles.fontSize}
            onValueChange={(value) => handleCustomStyleChange("fontSize", value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Font Family</Label>
          <Select
            value={config.customStyles.fontFamily}
            onValueChange={(value) => handleCustomStyleChange("fontFamily", value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Font Weight</Label>
          <Select
            value={config.customStyles.fontWeight}
            onValueChange={(value) => handleCustomStyleChange("fontWeight", value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontWeightOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Spacing and Transform Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs">Letter Spacing</Label>
          <Select
            value={config.customStyles.letterSpacing}
            onValueChange={(value) => handleCustomStyleChange("letterSpacing", value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {letterSpacingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Text Transform</Label>
          <Select
            value={config.customStyles.textTransform}
            onValueChange={(value) => handleCustomStyleChange("textTransform", value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {textTransformOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Line Height</Label>
          <Select
            value={config.customStyles.lineHeight}
            onValueChange={(value) => handleCustomStyleChange("lineHeight", value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lineHeightOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Colors and Decoration Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs">Text Decoration</Label>
          <Select
            value={config.customStyles.textDecoration}
            onValueChange={(value) => handleCustomStyleChange("textDecoration", value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {textDecorationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Background Color</Label>
          <Input
            type="color"
            value={config.customStyles.background === "transparent" ? "#ffffff" : config.customStyles.background}
            onChange={(e) => handleCustomStyleChange("background", e.target.value)}
            className="w-full h-8"
          />
        </div>
      </div>

      {/* Options Row */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="overflowHidden" 
              checked={config.customStyles.overflowHidden} 
              onCheckedChange={(checked) => handleCustomStyleChange("overflowHidden", checked as boolean)} 
            />
            <Label htmlFor="overflowHidden" className="text-xs">
              Text Overflow Hidden
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="containerOverflow" 
              checked={config.customStyles.containerOverflow} 
              onCheckedChange={(checked) => handleCustomStyleChange("containerOverflow", checked as boolean)} 
            />
            <Label htmlFor="containerOverflow" className="text-xs">
              Container Overflow Hidden
            </Label>
          </div>
        </div>
        
        {config.customStyles.containerOverflow && (
          <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
            <strong>Container Overflow:</strong> Text will be clipped by container bounds. Animations appear to come from the container edge, not beyond it.
          </div>
        )}
      </div>
    </div>
  )
}
