import type { CustomEaseSpec } from "@/types/animation"
import { DEFAULT_BEZIER } from "@/lib/custom-ease"

/**
 * Single source of truth for mapping a named GSAP ease onto the DialKit curve
 * editor. The graph is always visible; named eases display as their cubic
 * bezier approximation (CSS-standard control points), while the oscillating
 * eases (elastic / bounce) map onto the editor's spring mode so the curve
 * shape genuinely matches the motion. Clicking a preset or selecting a named
 * ease moves the graph handles to these coordinates; dragging the graph
 * converts the ease to "custom".
 */

// Named GSAP eases → cubic-bezier approximations (CSS easing reference values).
export const NAMED_BEZIER: Record<string, [number, number, number, number]> = {
  none: [0, 0, 1, 1],
  "power1.in": [0.55, 0.085, 0.68, 0.53], "power1.out": [0.25, 0.46, 0.45, 0.94], "power1.inOut": [0.455, 0.03, 0.515, 0.955],
  "power2.in": [0.55, 0.055, 0.675, 0.19], "power2.out": [0.215, 0.61, 0.355, 1], "power2.inOut": [0.645, 0.045, 0.355, 1],
  "power3.in": [0.895, 0.03, 0.685, 0.22], "power3.out": [0.33, 1, 0.68, 1], "power3.inOut": [0.77, 0, 0.175, 1],
  "power4.in": [0.755, 0.05, 0.855, 0.06], "power4.out": [0.23, 1, 0.32, 1], "power4.inOut": [0.86, 0, 0.07, 1],
  "back.in": [0.6, -0.28, 0.735, 0.045], "back.out": [0.175, 0.885, 0.32, 1.275], "back.inOut": [0.68, -0.55, 0.265, 1.55],
  "circ.in": [0.6, 0.04, 0.98, 0.335], "circ.out": [0.075, 0.82, 0.165, 1], "circ.inOut": [0.785, 0.135, 0.15, 0.86],
  "expo.in": [0.95, 0.05, 0.795, 0.035], "expo.out": [0.19, 1, 0.22, 1], "expo.inOut": [1, 0, 0, 1],
  "sine.in": [0.47, 0, 0.745, 0.715], "sine.out": [0.39, 0.575, 0.565, 1], "sine.inOut": [0.445, 0.05, 0.55, 0.95],
}

export interface EaseCurve {
  spec: CustomEaseSpec
  /** Which DialKit editor mode renders the curve honestly. */
  mode: "easing" | "simple"
}

export function easeToCurve(ease: string, custom: CustomEaseSpec | undefined, duration: number): EaseCurve {
  if (ease === "custom") {
    return {
      spec: custom ?? { type: "easing", ease: DEFAULT_BEZIER },
      mode: custom?.type === "spring" ? "simple" : "easing",
    }
  }
  const d = Math.max(0.05, duration)
  if (ease.startsWith("elastic")) return { spec: { type: "spring", visualDuration: d, bounce: 0.6 }, mode: "simple" }
  if (ease.startsWith("bounce")) return { spec: { type: "spring", visualDuration: d, bounce: 0.85 }, mode: "simple" }
  return { spec: { type: "easing", ease: NAMED_BEZIER[ease] ?? DEFAULT_BEZIER }, mode: "easing" }
}
