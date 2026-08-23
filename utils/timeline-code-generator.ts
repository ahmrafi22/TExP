// Exports a TimelineProject as runnable GSAP code + JSON.
// Mirrors the format/voice of utils/code-generator.ts (vanilla/react/vue × js/ts)
// while composing tweens from the SAME shared engine used by the live preview,
// so exported timing always matches what the creator shows.

import type {
  TimelineItem,
  TimelineProject,
} from "@/types/timeline"
import {
  buildFromVars,
  buildTweenVars,
  computeTextStyles,
  fontSizeMap,
  fontWeightMap,
  letterSpacingMap,
  lineHeightMap,
} from "@/lib/animation-engine"
import {
  computeLayout,
  serializePositionLiteral,
} from "@/utils/timeline-builder"

export interface TimelineCodeParams {
  project: TimelineProject
  framework: "vanilla" | "react" | "vue"
  language: "js" | "ts"
}

export function generateTimelineCode(params: TimelineCodeParams) {
  return {
    animation: generateTimelineAnimation(params),
    complete: generateTimelineComplete(params),
    json: generateTimelineJson(params.project),
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const FONT_FAMILY_LOOKUP: Record<string, string> = {
  inter: "'Inter'", roboto: "'Roboto'", openSans: "'Open Sans'", lato: "'Lato'",
  montserrat: "'Montserrat'", poppins: "'Poppins'", nunito: "'Nunito'", raleway: "'Raleway'",
  workSans: "'Work Sans'", dmSans: "'DM Sans'", outfit: "'Outfit'",
  plusJakartaSans: "'Plus Jakarta Sans'", spaceGrotesk: "'Space Grotesk'",
  urbanist: "'Urbanist'", quicksand: "'Quicksand'", rubik: "'Rubik'",
}

function quote(value: unknown): string {
  return typeof value === "string" ? `"${value}"` : String(value)
}

function serializeVars(vars: gsap.TweenVars, indent: string): string[] {
  const entries = Object.entries(vars).filter(([key, value]) => {
    if (key === "onComplete" || key === "delay") return false
    // Keep exported vars minimal — no default-value noise
    if (key === "repeat" && value === 0) return false
    if (key === "yoyo" && value === false) return false
    return true
  })
  return entries.map(([key, value], i) => {
    const comma = i < entries.length - 1 ? "," : ""
    if (typeof value === "object" && value !== null) {
      const inner = Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${quote(v)}`)
        .join(", ")
      return `${indent}${key}: { ${inner} }${comma}`
    }
    return `${indent}${key}: ${quote(value)}${comma}`
  })
}

function resolveFontFamilyForCode(fontFamily: string): string {
  if (fontFamily === "sans") return "ui-sans-serif, system-ui, sans-serif"
  if (fontFamily === "serif") return "ui-serif, Georgia, serif"
  if (fontFamily === "mono") return "ui-monospace, monospace"
  return FONT_FAMILY_LOOKUP[fontFamily] ?? fontFamily
}

function cssFromCustomStyles(item: TimelineItem): string {
  const s = item.animation.customStyles
  const block: string[] = []
  const fSize = fontSizeMap[s.fontSize] || s.fontSize
  block.push(`  font-size: ${fSize};`)
  block.push(`  font-weight: ${fontWeightMap[s.fontWeight] || s.fontWeight};`)
  const fontFamily = s.fontFamily !== "inherit" ? resolveFontFamilyForCode(s.fontFamily) : ""
  if (fontFamily) block.push(`  font-family: ${fontFamily};`)
  const ls = letterSpacingMap[s.letterSpacing] || s.letterSpacing
  if (ls !== "0em") block.push(`  letter-spacing: ${ls};`)
  const lh = lineHeightMap[s.lineHeight] || s.lineHeight
  if (lh !== "1.5") block.push(`  line-height: ${lh};`)
  if (s.color !== "inherit") block.push(`  color: ${s.color};`)
  if (s.background !== "transparent") block.push(`  background: ${s.background};`)
  if (s.textTransform !== "none") block.push(`  text-transform: ${s.textTransform};`)
  if (s.textDecoration !== "none") block.push(`  text-decoration: ${s.textDecoration};`)

  return `.timeline-item-${cssSafeId(item.id)} {\n  text-align: center;\n${block.join("\n")}\n}`
}

function cssSafeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "")
}

// ── Shared tl-construction body ───────────────────────────────────────────────

function splitPrepLines(project: TimelineProject, elRef: string, targetRef: string): string[] {
  const sorted = [...project.items].sort((a, b) => a.order - b.order)
  const lines: string[] = []
  sorted.forEach((item, idx) => {
    if (!item.splitTextConfig.enabled) return
    const type = item.splitTextConfig.type
    lines.push(`${targetRef}[${idx}] = new SplitText(${elRef}[${idx}], { type: "${type}" }).${type};`)
  })
  return lines
}

function buildTimelineBody(project: TimelineProject, elRef = "elRefs"): string[] {
  const layout = computeLayout(project)
  const startMap = new Map(layout.entries.map((e) => [e.item.id, e.start]))
  const sorted = [...project.items].sort((a, b) => a.order - b.order)

  const lines: string[] = []
  lines.push(`const tl = gsap.timeline({`)
  lines.push(`  repeat: ${project.repeat},`)
  lines.push(`  repeatDelay: ${project.repeatDelay},`)
  lines.push(`  yoyo: ${project.yoyo},`)
  lines.push(`});`)

  for (const l of project.labels) {
    lines.push(`tl.addLabel(${JSON.stringify(l.name)}, ${l.time});`)
  }

  sorted.forEach((item, idx) => {
    const vars = buildTweenVars(item.animation, item.splitTextConfig)
    vars.duration = item.duration
    if (item.ease) vars.ease = item.ease

    const pos = serializePositionLiteral(item.position, startMap.get(item.id) ?? 0, idx === 0)
    const target = `${elRef}[${idx}]`
    const method = item.animation.tweenType === "to" ? "to" : item.animation.tweenType === "from" ? "from" : "fromTo"

    if (method === "fromTo") {
      const fromVars = buildFromVars(item.animation)
      lines.push(`tl.fromTo(${target}, {`)
      lines.push(...serializeVars(fromVars, "  "))
      lines.push(`}, {`)
      lines.push(...serializeVars(vars, "  "))
      lines.push(`}, ${pos});`)
    } else {
      lines.push(`tl.${method}(${target}, {`)
      lines.push(...serializeVars(vars, "  "))
      lines.push(`}, ${pos});`)
    }
  })

  return lines
}

// ── Animation-only snippet ────────────────────────────────────────────────────

function generateTimelineAnimation(params: TimelineCodeParams): string {
  const { framework, language } = params
  const isTS = language === "ts"
  const hasSplit = params.project.items.some((i) => i.splitTextConfig.enabled)

  if (framework === "react") {
    const body = buildTimelineBody(params.project, "elRefs.current").join("\n")
    const prep = splitPrepLines(params.project, "elRefs.current", "elRefs.current").join("\n")
    return `// Import GSAP + useGSAP hook\nimport { gsap } from "gsap";\nimport { useGSAP } from "@gsap/react";\n` +
      (isTS ? `import { useRef } from "react";\n` : "") +
      (hasSplit ? `import { SplitText } from "gsap/SplitText";\n` : "") +
      `\nconst elRefs = useRef${isTS ? "<Array<HTMLDivElement | null>>" : ""}([]);\n\n` +
      `useGSAP(() => {\n` +
      (prep ? `${prep.split("\n").map((l) => `  ${l}`).join("\n")}\n\n` : ``) +
      `${body.split("\n").map((l) => `  ${l}`).join("\n")}\n}, []);\n`
  }

  if (framework === "vue") {
    const body = buildTimelineBody(params.project, "elRefs.value").join("\n")
    const prep = splitPrepLines(params.project, "elRefs.value", "elRefs.value").join("\n")
    return `import { gsap } from "gsap";\n${hasSplit ? `import { SplitText } from "gsap/SplitText";\n` : ``}import { onMounted, ref } from "vue";\n\n` +
      `const elRefs = ref${isTS ? "<Array<HTMLElement | null>>" : ""}([]);\n` +
      `function setElRef(idx${isTS ? ": number" : ""}, el${isTS ? ": Element | null" : ""}) { elRefs.value[idx] = el as HTMLElement; }\n\n` +
      `onMounted(() => {\n` +
      (prep ? `${prep.split("\n").map((l) => `  ${l}`).join("\n")}\n\n` : ``) +
      `${body.split("\n").map((l) => `  ${l}`).join("\n")}\n});\n`
  }

  // vanilla
  const body = buildTimelineBody(params.project, "elRefs").join("\n")
  const prep = splitPrepLines(params.project, "elRefs", "elRefs").join("\n")
  return `// Import GSAP\nimport { gsap } from "gsap";\n${hasSplit ? `import { SplitText } from "gsap/SplitText";\n` : ``}\n` +
    `// Resolve target elements by order\n` +
    `const elRefs = Array.from(document.querySelectorAll("[data-timeline-item]"));\n\n` +
    (prep ? `${prep}\n\n` : ``) +
    body + "\n"
}

// ── Complete component ────────────────────────────────────────────────────────

function generateTimelineComplete(params: TimelineCodeParams): string {
  const { framework, language } = params
  const isTS = language === "ts"
  const project = params.project
  const sorted = [...project.items].sort((a, b) => a.order - b.order)
  const css = sorted.map((item) => cssFromCustomStyles(item)).join("\n\n")

  if (framework === "vanilla") {
    const items = sorted.map((item, i) => `  <div class="timeline-item" data-timeline-item="${i}">${escapeHtml(item.text)}</div>`).join("\n")
    const prep = splitPrepLines(project, "elRefs", "elRefs").join("\n")
    const splitImport = project.items.some((i) => i.splitTextConfig.enabled)
    return `// ===== HTML Structure =====\n<div class="timeline">\n${items}\n</div>\n\n// ===== Animation =====\nimport { gsap } from "gsap";\n${splitImport ? `import { SplitText } from "gsap/SplitText";\n` : ``}\nconst elRefs = Array.from(document.querySelectorAll("[data-timeline-item]"));\n\n${prep ? `${prep}\n\n` : ``}${buildTimelineBody(project, "elRefs").join("\n")}\n\n// ===== CSS =====\n${css}`
  }

  if (framework === "react") {
    const hasSplit = project.items.some((i) => i.splitTextConfig.enabled)
    const items = sorted.map((item, i) => {
      const styles = inlineStyles(item)
      return `        <div ref={(el) => { elRefs.current[${i}] = el }} className="timeline-item" data-timeline-item="${i}" style={${styles}}>\n          ${item.text}\n        </div>`
    }).join("\n")

    const prep = splitPrepLines(project, "elRefs.current", "elRefs.current").map((l) => `    ${l}`).join("\n")
    const body = buildTimelineBody(project, "elRefs.current").map((l) => `    ${l}`).join("\n")

    return `import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
${hasSplit ? `import { SplitText } from "gsap/SplitText";\n` : ""}
export default function Timeline${isTS ? ": React.FC" : ""}() {
  const elRefs = useRef${isTS ? "<Array<HTMLDivElement | null>>" : ""}([]);

  useGSAP(() => {
${prep ? `${prep}\n\n` : ``}${body}
  }, []);

  return (
    <div className="timeline">
${items}
    </div>
  );
}
${cssForCode(css)}`
  }

  // vue
  const hasSplit = project.items.some((i) => i.splitTextConfig.enabled)
  const itemTemplate = sorted.map((item, i) => {
    const styles = inlineStyles(item)
    return `  <div :ref="(el) => setElRef(${i}, el)" class="timeline-item" data-timeline-item="${i}" :style="${styles}">${escapeHtml(item.text)}</div>`
  }).join("\n")

  const prep = splitPrepLines(project, "elRefs.value", "elRefs.value").map((l) => `    ${l}`).join("\n")
  const body = buildTimelineBody(project, "elRefs.value").map((l) => `    ${l}`).join("\n")

  return `<template>
  <div class="timeline">
${itemTemplate}
  </div>
</template>

<script${isTS ? ' lang="ts"' : ""}>
import { defineComponent, onMounted, ref } from "vue";
import { gsap } from "gsap";
${hasSplit ? `import { SplitText } from "gsap/SplitText";\n` : ""}
export default defineComponent({
  name: "TimelineSequence",
  setup() {
    const elRefs = ref${isTS ? "<Array<HTMLElement | null>>" : ""}([]);
    function setElRef(idx${isTS ? ": number" : ""}, el${isTS ? ": Element | null" : ""}) {
      elRefs.value[idx] = el as HTMLElement;
    }
    onMounted(() => {
${prep ? `${prep}\n\n` : ``}${body}
    });
    return { elRefs, setElRef };
  }
});
</script>

<style>
${css}
</style>`
}

function inlineStyles(item: TimelineItem): string {
  const st = computeTextStyles(item.animation.customStyles)
  const parts: string[] = []
  for (const [k, v] of Object.entries(st)) {
    // Single quotes — these objects are embedded in double-quoted HTML
    // attributes (:style="…") in the generated Vue templates.
    parts.push(`${k}: '${v}'`)
  }
  return `{ ${parts.join(", ")} }`
}

function cssForCode(css: string): string {
  return `\n// CSS:\n${css}`
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

// ── JSON export ───────────────────────────────────────────────────────────────

export function generateTimelineJson(project: TimelineProject): string {
  return JSON.stringify(project, null, 2)
}
