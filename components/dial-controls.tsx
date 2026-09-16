"use client"

import { ColorControl, DialStore, SelectControl, Slider, TextControl, Toggle, TransitionControl } from "dialkit"
import type { TransitionConfig } from "dialkit"
import { useTheme } from "next-themes"
import { useEffect, useState, type ReactNode } from "react"
import type { CustomEaseSpec } from "@/types/animation"

/**
 * DialKit controls must live inside a `.dialkit-root` element carrying the
 * active `data-theme` (its portaled popups copy tokens from the nearest root).
 * This wrapper mirrors the app's resolved next-themes value onto that root.
 */
export function DialScope({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { resolvedTheme } = useTheme()
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system")

  useEffect(() => {
    setTheme(resolvedTheme === "light" ? "light" : resolvedTheme === "dark" ? "dark" : "system")
  }, [resolvedTheme])

  return (
    <div className={`dialkit-root ${className}`} data-theme={theme}>
      {children}
    </div>
  )
}

// ── Slider (drop-in for the old Figma-style SliderField) ─────────────────────
export interface SliderFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (n: number) => void
  /** Unit rendered after the numeric readout, e.g. "s" or "°". */
  suffix?: string
  className?: string
}

export function SliderField({ label, value, min, max, step, onChange, suffix, className = "" }: SliderFieldProps) {
  const safe = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min
  return (
    <DialScope className={className}>
      <Slider label={label} value={safe} min={min} max={max} step={step} onChange={onChange} unit={suffix} />
    </DialScope>
  )
}

// ── Select (replaces the shadcn Select + Label combo) ────────────────────────
export interface SelectFieldProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  className?: string
}

export function SelectField({ label, value, options, onChange, className = "" }: SelectFieldProps) {
  return (
    <DialScope className={className}>
      <SelectControl label={label} value={value} options={options} onChange={onChange} />
    </DialScope>
  )
}

// ── Color picker (replaces <input type="color"> + hex text field) ────────────
export interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ColorField({ label, value, onChange, className = "" }: ColorFieldProps) {
  return (
    <DialScope className={className}>
      <ColorControl label={label} value={value} onChange={onChange} />
    </DialScope>
  )
}

/** True when DialKit's color parser can handle the value (hex / rgb / hsl / oklch / p3). */
export function isColorLike(value: string) {
  return /^(#|rgb|rgba|hsl|hsla|oklch|color\()/.test(value.trim())
}

// ── Text control (replaces label + shadcn Input) ─────────────────────────────
export interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function TextField({ label, value, onChange, placeholder, className = "" }: TextFieldProps) {
  return (
    <DialScope className={className}>
      <TextControl label={label} value={value} onChange={onChange} placeholder={placeholder} />
    </DialScope>
  )
}

// ── Toggle (replaces label + Checkbox / standalone Switch rows) ──────────────
export interface ToggleFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function ToggleField({ label, checked, onChange, className = "" }: ToggleFieldProps) {
  return (
    <DialScope className={className}>
      <Toggle label={label} checked={checked} onChange={onChange} />
    </DialScope>
  )
}

// ── Transition (Bézier / spring) editor ──────────────────────────────────────

/** Store spec → DialKit value. Duration is owned by the tween, not the spec. */
function specToTransition(spec: CustomEaseSpec | undefined, duration: number): TransitionConfig {
  if (spec?.type === "spring") {
    const { type, ...rest } = spec
    return { type, ...rest }
  }
  return { type: "easing", duration, ease: spec?.ease ?? [0.25, 0.1, 0.25, 1] }
}

function transitionToSpec(value: TransitionConfig): CustomEaseSpec {
  if (value.type === "easing") return { type: "easing", ease: value.ease }
  const { type, ...rest } = value
  return { type, ...rest }
}

export interface TransitionFieldProps {
  label: string
  spec?: CustomEaseSpec
  /** Tween duration — fed to the editor so its curve preview matches. */
  duration: number
  onSpecChange: (spec: CustomEaseSpec) => void
  panelId: string
  path: string
  className?: string
}

/**
 * DialKit's TransitionControl keeps its Easing/Time/Physics mode in DialStore
 * keyed by (panelId, path) — which only works for REGISTERED panels. Custom
 * layouts like ours must host a minimal panel themselves, or the Type
 * segmented control silently sticks in "simple" mode. The mode is also kept
 * in sync with the incoming spec type (spring specs open the spring editor),
 * while Duration stays with the app's own slider: the editor always renders
 * with hideDuration, and Time-mode springs derive their shape from it.
 */
export function TransitionField({
  label, spec, duration, onSpecChange, panelId, path, className = "",
}: TransitionFieldProps) {
  // DialKit's Folder/motion internals SSR-hydrate with mismatched attributes
  // (open state + animated height). The editor is purely interactive, so it
  // mounts client-side only — the store effects still run.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    DialStore.registerPanel(panelId, label, {})
    return () => DialStore.unregisterPanel(panelId)
  }, [panelId, path, label])

  // Follow the curve type: named elastic/bounce eases arrive as spring specs
  // and must open the spring editor, not a bezier that can't oscillate.
  const specType = spec?.type ?? "easing"
  useEffect(() => {
    DialStore.updateTransitionMode(panelId, path, specType === "spring" ? "simple" : "easing")
  }, [panelId, path, specType])

  return (
    <DialScope className={className}>
      {mounted && (
        <TransitionControl
          panelId={panelId}
          path={path}
          label={label}
          value={specToTransition(spec, duration)}
          onChange={(v) => onSpecChange(transitionToSpec(v))}
          hideDuration
        />
      )}
    </DialScope>
  )
}
