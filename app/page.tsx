"use client"

import { useRef, useCallback, useEffect } from "react"
import { Play, RotateCcw, Trash2, Type, Paintbrush, Settings2, Sparkles, Image, Wand2, History, Layers, ZoomIn, ZoomOut, RotateCcw as ResetZoom, Undo2, Redo2 } from "lucide-react"
import TexpLogo from "@/components/texp-logo"
import PreviewCanvas, { PreviewCanvasRef } from "@/components/preview-canvas"
import AnimationControls from "@/components/animation-controls"
import SplitTextControls from "@/components/split-text-controls"
import CustomCssControls from "@/components/custom-css-controls"
import BackgroundControls from "@/components/background-controls"
import PresetSelector from "@/components/preset-selector"
import TextInput from "@/components/text-input"
import CodeDialog from "@/components/code-dialog"
import ThemeToggle from "@/components/theme-toggle"
import HistoryPanel from "@/components/history-panel"
import LayersPanel from "@/components/layers-panel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { usePlaygroundStore } from "@/store/use-playground-store"
import { useShallow } from "zustand/react/shallow"

export default function GSAPPlayground() {
  const previewCanvasRef = useRef<PreviewCanvasRef>(null)

  const {
    isAnimating,
    setIsAnimating,
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    splitTextEnabled,
    backgroundType,
    backgroundColorVal,
    tweenType,
    ease,
    duration,
    zoomLevel,
    setZoomLevel,
    undo,
    redo,
    historyIndex,
    history,
  } = usePlaygroundStore(
    useShallow((s) => ({
      isAnimating: s.isAnimating,
      setIsAnimating: s.setIsAnimating,
      activeTab: s.activeTab,
      setActiveTab: s.setActiveTab,
      sidebarOpen: s.sidebarOpen,
      setSidebarOpen: s.setSidebarOpen,
      splitTextEnabled: s.splitTextConfig.enabled,
      backgroundType: s.backgroundConfig.type,
      backgroundColorVal: s.backgroundConfig.color,
      tweenType: s.animationConfig.tweenType,
      ease: s.animationConfig.ease,
      duration: s.animationConfig.duration,
      zoomLevel: s.zoomLevel,
      setZoomLevel: s.setZoomLevel,
      undo: s.undo,
      redo: s.redo,
      historyIndex: s.historyIndex,
      history: s.history,
    })),
  )

  const resetAllSettings = usePlaygroundStore((s) => s.resetAllSettings)
  const resetAnimationProperties = usePlaygroundStore((s) => s.resetAnimationProperties)
  const resetCustomCSS = usePlaygroundStore((s) => s.resetCustomCSS)

  const handleResetAll = useCallback(() => {
    resetAllSettings()
    previewCanvasRef.current?.resetAnimation()
  }, [resetAllSettings])

  const handleResetAnimation = useCallback(() => {
    resetAnimationProperties()
    previewCanvasRef.current?.resetAnimation()
  }, [resetAnimationProperties])

  const playAnimation = useCallback(() => {
    if (previewCanvasRef.current) {
      setIsAnimating(true)
      previewCanvasRef.current.playAnimation()
      setTimeout(() => setIsAnimating(false), 100)
    }
  }, [setIsAnimating])

  // Keyboard shortcut listener for Undo / Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault()
          redo()
        } else {
          e.preventDefault()
          undo()
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Left Sidebar Content (Figma Left Panel)
  const leftSidebarContent = (
    <Tabs defaultValue="layers" onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
      <div className="px-2 pt-2 pb-0">
        <TabsList className="w-full grid grid-cols-3 h-9 bg-muted/60">
          <TabsTrigger value="layers" className="text-[11px] gap-1 data-[state=active]:bg-background">
            <Layers className="h-3 w-3 text-blue-500" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="presets" className="text-[11px] gap-1 data-[state=active]:bg-background">
            <Wand2 className="h-3 w-3 text-violet-500" />
            Presets
          </TabsTrigger>
          <TabsTrigger value="history" className="text-[11px] gap-1 data-[state=active]:bg-background">
            <History className="h-3 w-3 text-amber-500" />
            History
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden mt-1">
        <TabsContent value="layers" className="h-full m-0 data-[state=active]:flex flex-col">
          <LayersPanel />
        </TabsContent>
        <TabsContent value="presets" className="h-full m-0 data-[state=active]:flex flex-col overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-violet-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">Animation Presets</h3>
            </div>
            <PresetSelector canvasRef={previewCanvasRef} />
          </div>
        </TabsContent>
        <TabsContent value="history" className="h-full m-0 data-[state=active]:flex flex-col">
          <HistoryPanel />
        </TabsContent>
      </div>
    </Tabs>
  )

  // Right Inspector Content (Figma Right Panel)
  const rightInspectorContent = (
    <Tabs defaultValue="animate" className="flex flex-col flex-1 min-h-0">
      <div className="px-3 pt-3 pb-0">
        <TabsList className="w-full grid grid-cols-2 h-9 bg-muted/40 p-0.5 rounded-lg border border-border/40">
          <TabsTrigger value="animate" className="text-xs gap-1.5 rounded-md py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            Animation & Split
          </TabsTrigger>
          <TabsTrigger value="design" className="text-xs gap-1.5 rounded-md py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all">
            <Paintbrush className="h-3.5 w-3.5 text-pink-500" />
            Style & Background
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="animate" className="flex-1 overflow-y-auto custom-scrollbar mt-0 px-4 py-5 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/15 to-violet-500/5 border border-violet-500/15 flex items-center justify-center shadow-xs">
                <Sparkles className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">GSAP Animation</h3>
                <p className="text-[9px] text-muted-foreground font-medium leading-none mt-0.5">Control tweens and easing curves</p>
              </div>
            </div>
            <Button onClick={handleResetAnimation} size="sm" variant="ghost" className="h-7 px-2.5 text-[10px] font-semibold text-muted-foreground/85 hover:text-foreground hover:bg-muted/60 transition-all rounded-md">
              <RotateCcw className="h-3 w-3 mr-1.5" /> Reset
            </Button>
          </div>
          <AnimationControls />
        </div>
        <Separator className="bg-border/50" />
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-500/15 flex items-center justify-center shadow-xs">
              <Type className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Split Text Engine</h3>
                {splitTextEnabled && <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-blue-500/10 text-blue-500 border-none rounded font-semibold">ACTIVE</Badge>}
              </div>
              <p className="text-[9px] text-muted-foreground font-medium leading-none mt-0.5">Divide typography into sub-elements</p>
            </div>
          </div>
          <SplitTextControls />
        </div>
      </TabsContent>

      <TabsContent value="design" className="flex-1 overflow-y-auto custom-scrollbar mt-0 px-4 py-5 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/15 to-pink-500/5 border border-pink-500/15 flex items-center justify-center shadow-xs">
                <Paintbrush className="h-4 w-4 text-pink-500" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Typography & CSS</h3>
                <p className="text-[9px] text-muted-foreground font-medium leading-none mt-0.5">Customize font scales and attributes</p>
              </div>
            </div>
            <Button onClick={resetCustomCSS} size="sm" variant="ghost" className="h-7 px-2.5 text-[10px] font-semibold text-muted-foreground/85 hover:text-foreground hover:bg-muted/60 transition-all rounded-md">
              <RotateCcw className="h-3 w-3 mr-1.5" /> Reset
            </Button>
          </div>
          <CustomCssControls />
        </div>
        <Separator className="bg-border/50" />
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/15 flex items-center justify-center shadow-xs">
              <Image className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Artboard Background</h3>
              <p className="text-[9px] text-muted-foreground font-medium leading-none mt-0.5">Define backdrop fills and templates</p>
            </div>
          </div>
          <BackgroundControls />
        </div>
      </TabsContent>
    </Tabs>
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background select-none">
      {/* Figma Top Header Bar */}
      <header className="h-12 min-h-[3rem] flex items-center justify-between px-3 border-b border-border bg-card z-50">
        <div className="flex items-center gap-3">
          <TexpLogo className="h-6 w-auto text-primary" />
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="text-foreground font-semibold">Untitled Artboard</span>
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">v1.5</span>
          </div>

          <div className="h-4 w-px bg-border hidden md:block" />

          {/* Quick Undo / Redo in Header */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="h-7 w-7 p-0"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="h-7 w-7 p-0"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Center Canvas Zoom Toolbar */}
        <div className="hidden lg:flex items-center gap-1 bg-muted/60 border border-border/80 px-2 py-1 rounded-md text-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
            className="h-6 w-6 p-0"
            title="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="w-12 text-center font-mono text-[11px]">{zoomLevel}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
            className="h-6 w-6 p-0"
            title="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <div className="h-3 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoomLevel(100)}
            className="h-6 px-1.5 text-[10px]"
            title="Reset zoom"
          >
            100%
          </Button>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <CodeDialog />
          <ThemeToggle />

          {/* Mobile Settings Drawer */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 lg:hidden">
                <Settings2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90vw] sm:w-[440px] p-0 flex flex-col">
              <SheetHeader className="px-5 pt-4 pb-0">
                <SheetTitle className="text-sm font-semibold flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-violet-500" />
                  Inspector & Layers
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 flex flex-col min-h-0">
                {rightInspectorContent}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Figma 3-Column Workspace Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar (Layers / Presets / History) */}
        <div className="hidden lg:flex w-[300px] min-w-[300px] border-r border-border bg-card flex-col">
          {leftSidebarContent}
        </div>

        {/* Center Artboard Canvas Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-background relative canvas-grid">
          {/* Top text input bar */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[85%] sm:w-[420px]">
            <TextInput />
          </div>

          {/* Artboard Frame */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            <div
              className="transition-transform duration-200 ease-out origin-center flex flex-col shadow-2xl rounded-xl border border-border bg-card overflow-hidden"
              style={{
                width: `${Math.round(800 * (zoomLevel / 100))}px`,
                height: `${Math.round(500 * (zoomLevel / 100))}px`,
                minWidth: "320px",
                minHeight: "240px",
              }}
            >
              <div className="h-7 bg-muted/80 border-b border-border px-3 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Artboard Frame (1920×1080)</span>
                <span>{zoomLevel}%</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
                <PreviewCanvas ref={previewCanvasRef} />
              </div>
            </div>
          </div>

          {/* Floating Figma Play / Reset Action Bar at Bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-lg">
            <Button
              onClick={playAnimation}
              disabled={isAnimating}
              size="sm"
              className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium gap-1.5 shadow-sm"
            >
              <Play className="h-4 w-4 fill-current" />
              Play
            </Button>
            <div className="h-4 w-px bg-border" />
            <Button
              onClick={handleResetAnimation}
              size="sm"
              variant="ghost"
              className="h-8 px-3 rounded-full text-xs gap-1"
              title="Reset animation properties"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              onClick={handleResetAll}
              size="sm"
              variant="ghost"
              className="h-8 px-3 rounded-full text-xs text-destructive hover:text-destructive gap-1"
              title="Clear all settings"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="hidden sm:inline text-[11px] text-muted-foreground font-mono">
              {tweenType} · {ease} · {duration}s
            </span>
          </div>
        </div>

        {/* Right Sidebar Inspector */}
        <div className="hidden lg:flex w-[340px] min-w-[340px] border-l border-border bg-card flex-col">
          {rightInspectorContent}
        </div>
      </div>
    </div>
  )
}
