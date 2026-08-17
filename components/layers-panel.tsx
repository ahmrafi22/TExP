"use client"

import React from "react"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { Layers, Type, Sparkles, Box, Eye, Activity, Play, Zap, Sliders, Palette } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
  if (animationConfig.opacity !== 1) activeTransforms.push({ label: "Opacity", value: animationConfig.opacity })
  if (animationConfig.filter.value > 0) {
    activeTransforms.push({
      label: "Filter",
      value: `${animationConfig.filter.type}(${animationConfig.filter.value}${animationConfig.filter.type === "blur" ? "px" : "%"})`,
    })
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Layers className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider">Layers & Elements</h3>
            <p className="text-[10px] text-muted-foreground">DOM nodes & animation properties</p>
          </div>
        </div>
        {isAnimating && (
          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 gap-1 animate-pulse">
            <Activity className="h-3 w-3" />
            Playing
          </Badge>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs custom-scrollbar">
        {/* Artboard Root Node */}
        <div className="p-3 rounded-lg border border-border/80 bg-background/50 space-y-2.5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-2 font-semibold text-foreground">
              <Box className="h-3.5 w-3.5 text-violet-500" />
              Canvas Artboard
            </span>
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">1920 × 1080</span>
          </div>

          <div className="pl-3 border-l border-border/60 ml-2 space-y-2">
            {/* Background Layer */}
            <div className="p-2 rounded-md border border-border/60 bg-background/60 flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-sans font-medium text-foreground">Background</span>
              </span>
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                {animationConfig.customStyles.background !== "transparent" ? animationConfig.customStyles.background : "Default / Solid"}
              </span>
            </div>

            {/* Text Element Node */}
            <div className="p-3 rounded-md border border-border bg-background space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Type className="h-3.5 w-3.5 text-blue-500" />
                  &lt;div class="text-target"&gt;
                </span>
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              {/* Text content & styles */}
              <div className="pl-3 border-l border-border/60 ml-1 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-muted-foreground">Text:</span>
                  <span className="text-foreground font-sans font-medium truncate max-w-[150px]">"{text}"</span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-muted-foreground">Style:</span>
                  <span className="text-foreground">{animationConfig.customStyles.fontSize} · {animationConfig.customStyles.fontWeight}</span>
                </div>
              </div>

              {/* Attached Animation Properties Card */}
              <div className="mt-2 p-2.5 rounded bg-muted/40 border border-border/70 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-violet-500">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    GSAP Properties
                  </span>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 uppercase font-mono">
                    {animationConfig.tweenType}
                  </Badge>
                </div>

                {/* Timing & Ease */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-muted-foreground font-mono">
                  <div className="bg-background/80 p-1.5 rounded border border-border/40 flex justify-between">
                    <span>Duration:</span>
                    <span className="text-foreground font-medium">{animationConfig.duration}s</span>
                  </div>
                  <div className="bg-background/80 p-1.5 rounded border border-border/40 flex justify-between">
                    <span>Ease:</span>
                    <span className="text-foreground font-medium truncate max-w-[65px]">{animationConfig.ease}</span>
                  </div>
                  {animationConfig.delay > 0 && (
                    <div className="bg-background/80 p-1.5 rounded border border-border/40 flex justify-between">
                      <span>Delay:</span>
                      <span className="text-foreground font-medium">{animationConfig.delay}s</span>
                    </div>
                  )}
                  {animationConfig.repeat !== 0 && (
                    <div className="bg-background/80 p-1.5 rounded border border-border/40 flex justify-between">
                      <span>Repeat:</span>
                      <span className="text-foreground font-medium">{animationConfig.repeat}{animationConfig.yoyo ? " (yoyo)" : ""}</span>
                    </div>
                  )}
                </div>

                {/* Active Transform Parameters */}
                {activeTransforms.length > 0 && (
                  <div className="pt-1.5 border-t border-border/50 space-y-1">
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Sliders className="h-2.5 w-2.5" />
                      <span>Active Transforms</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {activeTransforms.map((t, i) => (
                        <span key={i} className="text-[9px] bg-background border border-border px-1.5 py-0.5 rounded text-foreground font-mono">
                          <span className="text-muted-foreground">{t.label}:</span> {t.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Split Text Sublayers / Targets */}
              <div className="mt-2 pt-2 border-t border-border/60 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-500">
                    <Zap className="h-3 w-3" />
                    Target Elements
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {splitTextConfig.enabled ? `Split .${splitTextConfig.type}` : "Single target"}
                  </span>
                </div>

                {splitTextConfig.enabled ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
                      <span>Stagger: {splitTextConfig.stagger}s</span>
                      <span>From: {splitTextConfig.staggerFrom}</span>
                    </div>
                    <div className="pl-2 space-y-1 text-[10px] text-muted-foreground max-h-36 overflow-y-auto custom-scrollbar">
                      {text.split(splitTextConfig.type === "chars" ? "" : " ").map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 px-1.5 rounded bg-muted/30 hover:bg-muted/60 border border-border/40">
                          <span className="text-blue-500">.{splitTextConfig.type === "chars" ? "char" : "word"}[{idx}]</span>
                          <span className="font-sans font-medium text-foreground">"{item === " " ? "␣" : item}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground bg-muted/20 p-1.5 rounded border border-border/40 italic">
                    Single DOM element target: &lt;div&gt;
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
