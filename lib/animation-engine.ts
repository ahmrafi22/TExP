// Pure GSAP text-animation engine shared by the Text Animation Creator preview,
// the Timeline Animation Creator preview and every export path.
// Extracted verbatim from components/preview-canvas.tsx so both modes compose
// tweens from one single source of truth. No React / store imports here.

import { gsap } from "gsap"
import type { CSSProperties } from "react"
import type { AnimationConfig, SplitTextConfig } from "@/types/animation"
import { googleFonts } from "@/lib/fonts"

// ── Style mapping constants ───────────────────────────────────────────────────

export const fontSizeMap: Record<string, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",
}

export const fontWeightMap: Record<string, string> = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
}

export const letterSpacingMap: Record<string, string> = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
}

export const lineHeightMap: Record<string, string> = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
}

// ── Filter helpers ────────────────────────────────────────────────────────────

export function buildFilterString(filterConfig: { type: string; value: number }): string | null {
  const { type, value } = filterConfig
  if (value <= 0) return null
  // blur is px; brightness/contrast/saturate are percentages. A bare number for
  // brightness/contrast would be interpreted as a multiplier by CSS.
  const unit = type === "blur" ? "px" : "%"
  return `${type}(${value}${unit})`
}

// ── Custom CSS styles → inline style object ──────────────────────────────────

export function resolveFontFamily(fontFamily: string): string | null {
  if (!fontFamily || fontFamily === "inherit") return null
  if (fontFamily === "sans") return "ui-sans-serif, system-ui, sans-serif"
  if (fontFamily === "serif") return "ui-serif, Georgia, serif"
  if (fontFamily === "mono") return "ui-monospace, monospace"
  const googleFont = googleFonts.find((f) => f.key === fontFamily)
  if (googleFont) return `var(--font-${googleFont.key})`
  return fontFamily
}

export function computeTextStyles(
  customStyles: AnimationConfig["customStyles"],
): CSSProperties {
  const styles: CSSProperties = {}

  // Font size
  const fontSize = fontSizeMap[customStyles.fontSize] || customStyles.fontSize
  if (fontSize) styles.fontSize = fontSize

  // Font family
  const fontFamily = resolveFontFamily(customStyles.fontFamily)
  if (fontFamily) styles.fontFamily = fontFamily

  // Font weight
  const fontWeight = fontWeightMap[customStyles.fontWeight] || customStyles.fontWeight
  if (fontWeight) styles.fontWeight = fontWeight

  // Letter spacing
  const letterSpacing = letterSpacingMap[customStyles.letterSpacing] || customStyles.letterSpacing
  if (letterSpacing && letterSpacing !== "0em") styles.letterSpacing = letterSpacing

  // Line height
  const lineHeight = lineHeightMap[customStyles.lineHeight] || customStyles.lineHeight
  if (lineHeight && lineHeight !== "1.5") styles.lineHeight = lineHeight

  // Text decoration
  if (customStyles.textDecoration && customStyles.textDecoration !== "none") {
    styles.textDecoration = customStyles.textDecoration
  }

  // Text transform
  if (customStyles.textTransform && customStyles.textTransform !== "none") {
    styles.textTransform = customStyles.textTransform as CSSProperties["textTransform"]
  }

  // Background
  if (customStyles.background && customStyles.background !== "transparent") {
    styles.background = customStyles.background
  }

  // Color
  if (customStyles.color && customStyles.color !== "inherit") {
    styles.color = customStyles.color
  }

  return styles
}

// All resettable style keys — used to clear stale inline styles
export const allStyleKeys = [
  "fontSize", "fontFamily", "fontWeight", "letterSpacing",
  "lineHeight", "textDecoration", "textTransform", "background", "color",
] as const

// ── Split text DOM builder ────────────────────────────────────────────────────

/**
 * Removes any previously generated split DOM (the wrapper produced by
 * splitTextIntoElements). Safe to call when React owns the plain-text node —
 * it never touches other children.
 */
export function clearSplitElements(element: HTMLElement) {
  element.querySelectorAll(":scope > .split-root").forEach((wrapper) => wrapper.remove())
}

export function splitTextIntoElements(element: HTMLElement, type: string) {
  const textContent = element.textContent || ""
  element.innerHTML = ""

  // Everything lives inside ONE removable wrapper so callers can tear the
  // split DOM down later without touching siblings owned by React.
  const root = document.createElement("span")
  root.className = "split-root"
  // display:contents → layout identical to unwrapped children
  root.style.display = "contents"
  element.appendChild(root)
  const host: HTMLElement = root

  if (type === "chars") {
    // Array.from iterates code points, so astral characters (emoji etc.)
    // stay intact instead of being split into lone surrogates.
    Array.from(textContent).forEach((char) => {
      const span = document.createElement("span")
      span.className = "char"
      span.style.display = "inline-block"
      span.textContent = char === " " ? "\u00A0" : char
      host.appendChild(span)
    })
  } else if (type === "words" || type === "lines") {
    const words = textContent.split(/\s+/).filter(Boolean)
    const wordSpans = words.map((word) => {
      const span = document.createElement("span")
      span.className = "word"
      span.style.display = "inline-block"
      span.textContent = word
      return span
    })

    if (type === "words") {
      wordSpans.forEach((span, index) => {
        host.appendChild(span)
        if (index < wordSpans.length - 1) {
          host.appendChild(document.createTextNode(" "))
        }
      })
    } else {
      // Two-pass line detection: lay all words out flat, then group runs of
      // words sharing the same vertical offset into block-level .line wrappers.
      // Must run AFTER final styles are applied so measurements are correct.
      const tops: number[] = []
      for (const span of wordSpans) {
        host.appendChild(span)
        host.appendChild(document.createTextNode(" "))
        tops.push(span.offsetTop)
      }

      let currentLine: HTMLDivElement | null = null
      let currentTop: number | null = null
      wordSpans.forEach((span, index) => {
        if (currentTop === null || tops[index] !== currentTop) {
          currentLine = document.createElement("div")
          currentLine.className = "line"
          currentLine.style.display = "block"
          currentTop = tops[index]
          host.insertBefore(currentLine, span)
        }
        // Move the word (and its trailing space) inside the current line wrapper
        const next = span.nextSibling
        currentLine!.appendChild(span)
        if (next && next.nodeType === Node.TEXT_NODE) {
          currentLine!.appendChild(next)
        }
      })
    }
  }
}

export function getSplitSelector(type: string): string {
  if (type === "chars") return ".char"
  if (type === "lines") return ".line"
  return ".word"
}

// ── Element preparation (reset + styles + split) ─────────────────────────────

/**
 * Resets any previous tween state on the element, re-applies its custom styles
 * and re-builds the split-text DOM when enabled. Exact behaviour previously
 * inlined in PreviewCanvas's play/reset paths.
 */
export function resetAndPrepareElement(
  element: HTMLElement,
  styles: CSSProperties,
  textValue: string,
  splitConfig: Pick<SplitTextConfig, "enabled" | "type">,
) {
  gsap.killTweensOf(element)
  gsap.killTweensOf(element.children)
  const existingSplits = element.querySelectorAll(".char, .word, .line")
  if (existingSplits.length > 0) gsap.killTweensOf(existingSplits)

  gsap.set(element, {
    clearProps: "transform,opacity,filter,rotationX,rotationY,skewX,skewY",
  })
  gsap.set(element, {
    x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, skewX: 0, skewY: 0, opacity: 1, filter: "none",
  })

  Object.assign(element.style, styles)

  if (splitConfig.enabled) {
    element.textContent = textValue
    splitTextIntoElements(element, splitConfig.type)
  } else {
    // Remove leftover split DOM without touching siblings owned by React
    clearSplitElements(element)
  }
}

// ── Tween variables assembly ─────────────────────────────────────────────────

function buildStagger(splitConfig: SplitTextConfig): number | { each: number; from: string } | undefined {
  if (!(splitConfig.enabled && splitConfig.stagger > 0)) return undefined
  if (splitConfig.staggerFrom && splitConfig.staggerFrom !== "start") {
    return { each: splitConfig.stagger, from: splitConfig.staggerFrom }
  }
  return splitConfig.stagger
}

/**
 * Builds the GSAP tween vars ("to" side) from a full AnimationConfig +
 * SplitTextConfig. Values at their defaults are intentionally omitted —
 * identical semantics to the original inline implementation.
 *
 * `onComplete` is deliberately NOT included; callers attach their own.
 */
export function buildTweenVars(
  config: AnimationConfig,
  splitConfig: SplitTextConfig,
): gsap.TweenVars {
  const vars: Record<string, unknown> = {
    duration: config.duration,
    delay: config.delay,
    ease: config.ease,
    repeat: config.repeat,
    yoyo: config.yoyo,
  }

  const stagger = buildStagger(splitConfig)
  if (stagger !== undefined) vars.stagger = stagger

  if (config.x !== 0) vars.x = config.x
  if (config.y !== 0) vars.y = config.y
  if (config.scale !== 1) vars.scale = config.scale
  if (config.rotation !== 0) vars.rotation = config.rotation
  if (config.rotationX !== 0) vars.rotationX = config.rotationX
  if (config.rotationY !== 0) vars.rotationY = config.rotationY
  if (config.skewX !== 0) vars.skewX = config.skewX
  if (config.skewY !== 0) vars.skewY = config.skewY
  if (config.opacity !== 1) vars.opacity = config.opacity

  const filterStr = buildFilterString(config.filter)
  if (filterStr) vars.filter = filterStr

  return vars as gsap.TweenVars
}

/**
 * Builds the "from" side vars for fromTo tweens (defaults omitted).
 */
export function buildFromVars(config: AnimationConfig): gsap.TweenVars {
  const fromProps: Record<string, unknown> = {}
  const fv = config.fromValues
  if (!fv) return fromProps as gsap.TweenVars

  if (fv.x !== undefined && fv.x !== 0) fromProps.x = fv.x
  if (fv.y !== undefined && fv.y !== 0) fromProps.y = fv.y
  if (fv.scale !== undefined && fv.scale !== 1) fromProps.scale = fv.scale
  if (fv.rotation !== undefined && fv.rotation !== 0) fromProps.rotation = fv.rotation
  if (fv.rotationX !== undefined && fv.rotationX !== 0) fromProps.rotationX = fv.rotationX
  if (fv.rotationY !== undefined && fv.rotationY !== 0) fromProps.rotationY = fv.rotationY
  if (fv.skewX !== undefined && fv.skewX !== 0) fromProps.skewX = fv.skewX
  if (fv.skewY !== undefined && fv.skewY !== 0) fromProps.skewY = fv.skewY
  if (fv.opacity !== undefined && fv.opacity !== 1) fromProps.opacity = fv.opacity
  if (fv.filter) {
    const fromFilter = buildFilterString(fv.filter)
    if (fromFilter) fromProps.filter = fromFilter
  }

  return fromProps as gsap.TweenVars
}

/**
 * Resolves the target elements for a text animation based on split config.
 * Returns null when split is requested but produced no targets.
 */
export function resolveTargets(
  element: HTMLElement,
  splitConfig: SplitTextConfig,
): HTMLElement | Element[] | null {
  if (!splitConfig.enabled) return element
  const splits = Array.from(element.querySelectorAll(getSplitSelector(splitConfig.type)))
  return splits.length > 0 ? splits : null
}

/**
 * Runs a complete text animation tween (to / from / fromTo) against the given
 * targets using the exact tween-generation logic of the playground preview.
 * Returns the created tween.
 */
export function runTextTween(
  targets: gsap.TweenTarget,
  config: AnimationConfig,
  splitConfig: SplitTextConfig,
  onComplete?: () => void,
): gsap.core.Tween {
  const vars = buildTweenVars(config, splitConfig)
  if (onComplete) vars.onComplete = onComplete

  if (config.tweenType === "fromTo" && config.fromValues) {
    return gsap.fromTo(targets, buildFromVars(config), vars)
  }
  if (config.tweenType === "from") {
    return gsap.from(targets, vars)
  }
  return gsap.to(targets, vars)
}
