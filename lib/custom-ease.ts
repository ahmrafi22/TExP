import type { CustomEaseSpec } from "@/types/animation"

/**
 * Framework-free math for the "Custom Bézier" ease mode.
 *
 * The playground store keeps a `CustomEaseSpec` (mirroring DialKit's
 * TransitionConfig minus duration, which the tween itself owns). This module
 * turns that spec into either a GSAP-compatible ease function (previews) or a
 * GSAP `CustomEase.create(...)` expression string (code export).
 */

export const DEFAULT_BEZIER: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

// ── Cubic Bézier (CSS cubic-bezier semantics: x = progress, y = eased value) ─

export function cubicBezierEase(x1: number, y1: number, x2: number, y2: number) {
  if (x1 === y1 && x2 === y2) return (t: number) => t

  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx

  return (progress: number) => {
    if (progress <= 0) return 0
    if (progress >= 1) return 1
    let t = progress
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - progress
      if (Math.abs(err) < 1e-6) return sampleY(t)
      const d = sampleDX(t)
      if (Math.abs(d) < 1e-6) break
      t -= err / d
    }
    let lo = 0
    let hi = 1
    t = progress
    for (let i = 0; i < 20; i++) {
      const x = sampleX(t)
      if (Math.abs(x - progress) < 1e-6) break
      if (x > progress) hi = t
      else lo = t
      t = (lo + hi) / 2
    }
    return sampleY(t)
  }
}

// ── Springs (Motion's closed-form damped oscillator) ─────────────────────────

export interface SpringPhysics {
  stiffness: number
  damping: number
  mass: number
}

type SpringSpec = Extract<CustomEaseSpec, { type: "spring" }>

/**
 * Resolve a spring spec to physics. The Time-mode form (visualDuration +
 * bounce) is converted with the same formula Motion uses:
 * root = 2π / (visualDuration × 1.2); damping = 2ζ√stiffness with ζ = 1−bounce.
 * When a tween `duration` is given it replaces visualDuration — the app's
 * Duration slider then drives the spring's shape in every mode.
 */
export function springPhysics(spec: SpringSpec, duration?: number): SpringPhysics {
  if (spec.stiffness !== undefined) {
    return { stiffness: spec.stiffness, damping: spec.damping ?? 10, mass: spec.mass ?? 1 }
  }
  const root = (2 * Math.PI) / ((duration ?? spec.visualDuration ?? 0.3) * 1.2)
  const stiffness = root * root
  const zeta = Math.min(1, Math.max(0.05, 1 - (spec.bounce ?? 0.2)))
  return { stiffness, damping: 2 * zeta * Math.sqrt(stiffness), mass: 1 }
}

/** Unit step response (0 → 1) of the spring at time t (seconds). */
function springValueAt({ stiffness, damping, mass }: SpringPhysics, t: number): number {
  const w0 = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  if (zeta < 0.999) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta)
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
  }
  if (zeta <= 1.001) return 1 - Math.exp(-w0 * t) * (1 + w0 * t)
  const s = w0 * Math.sqrt(zeta * zeta - 1)
  const ft = Math.min(s * t, 300)
  return 1 - Math.exp(-zeta * w0 * t) * (Math.cosh(ft) + ((zeta * w0) / s) * Math.sinh(ft))
}

/** Time until the spring rests within Motion's granular thresholds. */
function springSettleTime(ph: SpringPhysics): number {
  const dt = 1 / 60
  for (let t = dt; t <= 12; t += dt) {
    const v = springValueAt(ph, t)
    const next = springValueAt(ph, t + dt)
    if (Math.abs(1 - v) < 0.002 && Math.abs(next - v) < 0.0004) return t
  }
  return 12
}

// ── Public resolvers ─────────────────────────────────────────────────────────

/** GSAP function-ease for previews. `duration` shapes Time-mode springs. */
export function buildCustomEaseFn(spec?: CustomEaseSpec, duration?: number): (progress: number) => number {
  if (!spec || spec.type === "easing") {
    const [x1, y1, x2, y2] = spec?.ease ?? DEFAULT_BEZIER
    return cubicBezierEase(x1, y1, x2, y2)
  }
  const ph = springPhysics(spec, duration)
  const T = springSettleTime(ph)
  return (p: number) => springValueAt(ph, p * T)
}

const r4 = (n: number) => Math.round(n * 1e4) / 1e4

/** SVG path for GSAP CustomEase — exact cubic for béziers, sampled polyline for springs. */
export function customEasePath(spec?: CustomEaseSpec, duration?: number): string {
  if (!spec || spec.type === "easing") {
    const [x1, y1, x2, y2] = spec?.ease ?? DEFAULT_BEZIER
    return `M0,0 C${r4(x1)},${r4(y1)} ${r4(x2)},${r4(y2)} 1,1`
  }
  const ph = springPhysics(spec, duration)
  const T = springSettleTime(ph)
  const N = 96
  const pts: string[] = []
  for (let i = 1; i <= N; i++) {
    const p = i / N
    pts.push(`${r4(p)},${r4(springValueAt(ph, p * T))}`)
  }
  return `M0,0 L${pts.join(" L")}`
}

/** Runnable GSAP expression for generated code. */
export function customEaseExpression(spec?: CustomEaseSpec, duration?: number): string {
  return `CustomEase.create("custom", "${customEasePath(spec, duration)}")`
}
