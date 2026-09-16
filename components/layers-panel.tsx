"use client"

import React from "react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { Layers, Type, Sparkles, Box, Eye, Activity, Zap, Sliders, Image } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const TWEEN_LABELS: Record<string, string> = { to: "To", from: "From", fromTo: "From → To" }
const SPLIT_LABELS: Record<string, string> = { chars: "character", words: "word", lines: "line" }

export default function LayersPanel() {
  const text = usePlaygroundStore((s) => s.text)
  const splitTextConfig = usePlaygroundStore((s) => s.splitTextConfig)
  const animationConfig = usePlaygroundStore((s) => s.animationConfig)
  const isAnimating = usePlaygroundStore((s) => s.isAnimating)

  const activeTransforms: { label: string; value: string | number }[] = []
  if (animationConfig.x !== 0) activeTransforms.push({ label: "X", value: animationConfig.x })
  if (animationConfig.y !== 0) activeTransforms.push({ label: "Y", value: animationConfig.y })
  if (animationConfig.scale !== 1) activeTransforms.push({ label: "Scale", value: animationConfig.scale })
  if (animationConfig.rotation !== 0) activeTransforms.push({ label: "Rot", value: `${animationConfig.rotation}°` })
  if (animationConfig.rotationX !== 0) activeTransforms.push({ label: "RotX", value: `${animationConfig.rotationX}°` })
  if (animationConfig.rotationY !== 0) activeTransforms.push({ label: "RotY", value: `${animationConfig.rotationY}°` })
  if (animationConfig.skewX !== 0) activeTransforms.push({ label: "SkewX", value: `${animationConfig.skewX}°` })
  if (animationConfig.skewY !== 0) activeTransforms.push({ label: "SkewY", value: `${animationConfig.skewY}°` })
  if (animationConfig.opacity !== 1) activeTransforms.push({ label: "Opacity", value: animationConfig.opacity })
  if (animationConfig.filter.value > 0) {
    activeTransforms.push({
      label: "Filter",
      value: `${animationConfig.filter.type}(${animationConfig.filter.value}${animationConfig.filter.type === "blur" ? "px" : "%"})`,
    })
  }

  // The pieces the text actually splits into (mirrors what the engine targets)
  const splitTargets = splitTextConfig.type === "chars"
    ? Array.from(text)
    : text.split(/\s+/).filter(Boolean)

  const bg = animationConfig.customStyles.background
  const bgLabel = bg !== "transparent" && bg !== "auto" ? bg : "Default"

  const easeLabel = animationConfig.ease === "custom"
    ? (animationConfig.customEase?.type === "spring" ? "spring" : "bezier")
    : animationConfig.ease

  const stat = "flex items-baseline justify-between gap-2 min-w-0"
  const statLabel = "text-[9px] uppercase tracking-wider text-muted-foreground shrink-0"
  const statValue = "text-[10px] font-mono font-medium text-foreground tnum truncate"

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header — single compact row */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          Layers
        </span>
        {isAnimating && (
          <Badge variant="outline" className="h-4 text-[9px] px-1 bg-primary/10 text-ring border-primary/30 gap-1 animate-pulse font-mono">
            <Activity className="h-2.5 w-2.5" />
            LIVE
          </Badge>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-1.5 custom-scrollbar">
        {/* Canvas + Background — two thin rows, no cards */}
        <div className="flex items-center justify-between text-[10px] leading-none py-0.5">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Box className="h-3 w-3 text-muted-foreground" /> Canvas
          </span>
          <span className="font-mono text-muted-foreground tnum">1920 × 1080</span>
        </div>
        <div className="flex items-center justify-between text-[10px] leading-none py-0.5">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Image className="h-3 w-3 text-muted-foreground" /> Background
          </span>
          <span className="font-mono text-muted-foreground max-w-[120px] truncate" title={bgLabel}>
            {bgLabel}
          </span>
        </div>

        {/* Text Layer — the only card */}
        <div className="rounded-lg border border-border bg-background p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
              <Type className="h-3 w-3 text-muted-foreground" />
              Text Layer
            </span>
            <Eye className="h-3 w-3 text-muted-foreground" aria-label="Visible" />
          </div>

          {/* The text itself */}
          <p className="font-sans text-[12px] font-semibold text-foreground leading-snug break-words px-2 py-1.5 rounded bg-muted/40 border border-border/50">
            “{text || "…"}”
          </p>

          {/* Style at a glance — one chip row */}
          <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono">
            <span className="bg-muted/50 border border-border/60 px-1.5 py-px rounded text-foreground uppercase">
              {animationConfig.customStyles.fontSize}
            </span>
            <span className="bg-muted/50 border border-border/60 px-1.5 py-px rounded text-foreground capitalize">
              {animationConfig.customStyles.fontWeight}
            </span>
            {splitTextConfig.enabled && (
              <span className="bg-primary/10 border border-primary/30 px-1.5 py-px rounded text-ring">
                split: {splitTextConfig.type}
              </span>
            )}
          </div>

          {/* Animation summary */}
          <div className="rounded-md bg-muted/25 border border-border/50 px-2 py-1.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-ring">
                <Sparkles className="h-2.5 w-2.5" />
                Animation
              </span>
              <Badge variant="secondary" className="h-4 text-[8px] px-1 uppercase font-mono">
                {TWEEN_LABELS[animationConfig.tweenType] ?? animationConfig.tweenType}
              </Badge>
            </div>

            {/* Dense label → value rows */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              <div className={stat}>
                <span className={statLabel}>Dur</span>
                <span className={statValue}>{animationConfig.duration}s</span>
              </div>
              <div className={stat}>
                <span className={statLabel}>Ease</span>
                <span className={statValue} title={easeLabel}>{easeLabel}</span>
              </div>
              {animationConfig.delay > 0 && (
                <div className={stat}>
                  <span className={statLabel}>Delay</span>
                  <span className={statValue}>{animationConfig.delay}s</span>
                </div>
              )}
              {animationConfig.repeat !== 0 && (
                <div className={stat}>
                  <span className={statLabel}>Repeat</span>
                  <span className={statValue}>
                    {animationConfig.repeat === -1 ? "∞" : `×${animationConfig.repeat}`}{animationConfig.yoyo ? " yoyo" : ""}
                  </span>
                </div>
              )}
            </div>

            {activeTransforms.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {activeTransforms.map((t, i) => (
                  <span key={i} className="text-[9px] font-mono bg-background border border-border/60 px-1 py-px rounded">
                    <span className="text-muted-foreground">{t.label}</span>{" "}
                    <span className="text-foreground">{t.value}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Targets */}
          <div className="border-t border-border/60 pt-1.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-ring">
                <Zap className="h-2.5 w-2.5" />
                Targets
              </span>
              <span className="text-[9px] font-mono bg-muted px-1.5 py-px rounded text-muted-foreground tnum">
                {splitTextConfig.enabled
                  ? splitTextConfig.type === "lines" ? "by line" : `${splitTargets.length} pieces`
                  : "1 piece"}
              </span>
            </div>

            {splitTextConfig.enabled ? (
              <>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  Each <span className="text-foreground font-medium">{SPLIT_LABELS[splitTextConfig.type] ?? splitTextConfig.type}</span> animates separately
                  {splitTextConfig.stagger > 0 && <> — <span className="text-foreground font-mono tnum">{splitTextConfig.stagger}s</span> apart, from the <span className="text-foreground font-medium">{splitTextConfig.staggerFrom}</span></>}.
                </p>
                {splitTextConfig.type === "lines" ? (
                  <p className="text-[9px] text-muted-foreground">
                    Lines are detected from the rendered layout.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar">
                    {splitTargets.map((item, idx) => (
                      <span key={idx} className="text-[9px] font-mono bg-muted/40 border border-border/50 rounded px-1 py-px tnum">
                        <span className="text-muted-foreground">{idx + 1}</span>{" "}
                        <span className="text-foreground">“{item === " " ? "\u2423" : item}”</span>
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-[10px] text-muted-foreground leading-snug">
                The whole text animates as <span className="text-foreground font-medium">one unit</span>. Turn on <span className="text-foreground font-medium">Split Text</span> to animate per character, word, or line.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
