"use client"

import { useRef, useCallback, useEffect } from "react"
import { Play, RotateCcw, Trash2, Settings2, Sparkles, Paintbrush, Wand2, History, Layers, Undo2, Redo2, HelpCircle } from "lucide-react"
import TexpLogo from "@/components/texp-logo"
import PreviewCanvas, { PreviewCanvasRef } from "@/components/preview-canvas"
import AnimationControls from "@/components/animation-controls"
import SplitTextControls from "@/components/split-text-controls"
import CustomCssControls from "@/components/custom-css-controls"
import BackgroundControls from "@/components/background-controls"
import PresetSelector from "@/components/preset-selector"
import TextInput from "@/components/text-input"
import CodeDialog from "@/components/code-dialog"
import TimelineExportDialog from "@/components/timeline-export-dialog"
import ThemeToggle from "@/components/theme-toggle"
import HistoryPanel from "@/components/history-panel"
import LayersPanel from "@/components/layers-panel"
import ModeSwitcher from "@/components/mode-switcher"
import TimelineCreator from "@/components/timeline-creator"
import OnboardingTour, { startTour } from "@/components/onboarding-tour"
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
    undo,
    redo,
    historyIndex,
    history,
    activeMode,
  } = usePlaygroundStore(
    useShallow((s) => ({
      isAnimating: s.isAnimating,
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
      undo: s.undo,
      redo: s.redo,
      historyIndex: s.historyIndex,
      history: s.history,
      activeMode: s.activeMode,
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
    // The canvas owns the isAnimating flag (set/cleared around the real tween),
    // so no artificial timers here — the button's disabled state follows it.
    previewCanvasRef.current?.playAnimation()
  }, [])

  // Keyboard shortcut listener for Undo / Redo (text mode only — the timeline
  // has its own shortcuts and no playground history)
  useEffect(() => {
    if (activeMode !== "text") return
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
  }, [undo, redo, activeMode])

  // Space → play (text mode), matching the timeline transport shortcut
  useEffect(() => {
    if (activeMode !== "text") return
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return
      if (e.code === "Space") {
        e.preventDefault()
        previewCanvasRef.current?.playAnimation()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [activeMode])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Left Sidebar Content (Figma Left Panel)
  const leftSidebarContent = (
    <Tabs defaultValue="layers" onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
      <div id="tour-left-tabs" className="px-2 pt-2 pb-0">
        <TabsList className="w-full grid grid-cols-3 gap-1 bg-muted/25 border border-ring/45 rounded-lg p-1 h-auto">
          <TabsTrigger
            value="layers"
            title="Layers panel"
            className="h-10 rounded-md border cursor-pointer text-[11px] font-medium text-muted-foreground border-border bg-muted/50 transition-colors duration-150 hover:bg-accent hover:text-foreground hover:border-muted-foreground/40 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-ring/70 data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)] data-[state=active]:[&>svg]:text-ring"
          >
            <Layers className="h-3.5 w-3.5" />
            Layers
          </TabsTrigger>
          <TabsTrigger
            value="presets"
            title="Animation presets"
            className="h-10 rounded-md border cursor-pointer text-[11px] font-medium text-muted-foreground border-border bg-muted/50 transition-colors duration-150 hover:bg-accent hover:text-foreground hover:border-muted-foreground/40 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-ring/70 data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)] data-[state=active]:[&>svg]:text-ring"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Presets
          </TabsTrigger>
          <TabsTrigger
            value="history"
            title="Action history"
            className="h-10 rounded-md border cursor-pointer text-[11px] font-medium text-muted-foreground border-border bg-muted/50 transition-colors duration-150 hover:bg-accent hover:text-foreground hover:border-muted-foreground/40 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-ring/70 data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)] data-[state=active]:[&>svg]:text-ring"
          >
            <History className="h-3.5 w-3.5" />
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
              <Wand2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">Animation Presets</h3>
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
        <TabsList className="w-full grid grid-cols-2 gap-1 bg-muted/25 border border-ring/45 rounded-lg p-1 h-auto">
          <TabsTrigger
            value="animate"
            title="Tween, easing and split-text controls"
            className="h-10 rounded-md border cursor-pointer text-xs font-medium text-muted-foreground border-border bg-muted/50 transition-colors duration-150 hover:bg-accent hover:text-foreground hover:border-muted-foreground/40 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-ring/70 data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)] data-[state=active]:[&>svg]:text-ring"
          >
            <Sparkles className="h-4 w-4" />
            Animation &amp; Split
          </TabsTrigger>
          <TabsTrigger
            value="design"
            title="Typography and artboard background"
            className="h-10 rounded-md border cursor-pointer text-xs font-medium text-muted-foreground border-border bg-muted/50 transition-colors duration-150 hover:bg-accent hover:text-foreground hover:border-muted-foreground/40 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:border-ring/70 data-[state=active]:shadow-[inset_0_-2px_0_0_var(--primary)] data-[state=active]:[&>svg]:text-ring"
          >
            <Paintbrush className="h-4 w-4" />
            Style &amp; Background
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="animate" className="flex-1 overflow-y-auto custom-scrollbar mt-0 px-4 py-5 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-foreground">GSAP Animation</h3>
              <p className="text-[9px] text-muted-foreground font-medium leading-none mt-1">Control tweens and easing curves</p>
            </div>
            <Button onClick={handleResetAnimation} size="sm" variant="ghost" className="h-7 px-2.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-md">
              <RotateCcw className="h-3 w-3 mr-1.5" /> Reset
            </Button>
          </div>
          <AnimationControls />
        </div>
        <Separator className="bg-border/50" />
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-foreground">Split Text Engine</h3>
                {splitTextEnabled && <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-primary/10 text-ring border-primary/30 rounded font-mono font-semibold">ACTIVE</Badge>}
              </div>
              <p className="text-[9px] text-muted-foreground font-medium leading-none mt-1">Divide typography into sub-elements</p>
            </div>
          </div>
          <SplitTextControls />
        </div>
      </TabsContent>

      <TabsContent value="design" className="flex-1 overflow-y-auto custom-scrollbar mt-0 px-4 py-5 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-foreground">Typography &amp; CSS</h3>
              <p className="text-[9px] text-muted-foreground font-medium leading-none mt-1">Customize font scales and attributes</p>
            </div>
            <Button onClick={resetCustomCSS} size="sm" variant="ghost" className="h-7 px-2.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-md">
              <RotateCcw className="h-3 w-3 mr-1.5" /> Reset
            </Button>
          </div>
          <CustomCssControls />
        </div>
        <Separator className="bg-border/50" />
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-foreground">Artboard Background</h3>
              <p className="text-[9px] text-muted-foreground font-medium leading-none mt-1">Define backdrop fills and templates</p>
            </div>
          </div>
          <BackgroundControls />
        </div>
      </TabsContent>
    </Tabs>
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background select-none">
      <OnboardingTour />
      {/* Figma Top Header Bar */}
      <header className="relative h-12 min-h-[3rem] flex items-center justify-between px-3 border-b border-border bg-card z-50">
        <div id="tour-header" className="flex items-center gap-3">
          <TexpLogo className="h-6 w-auto text-foreground" />
          <div className="h-4 w-px bg-border" />
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono tnum text-muted-foreground">v0.3.1</span>
        </div>

        {/* Centered workspace mode switcher — true navbar center (desktop) */}
        <div id="tour-mode" className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <ModeSwitcher />
        </div>

        {/* Right Header Actions */}
        <div id="tour-header-actions" className="flex items-center gap-2">
          {/* Undo / Redo — directly left of the code buttons (text mode only) */}
          {activeMode === "text" && (
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
          )}
          {activeMode === "text" ? <CodeDialog /> : <TimelineExportDialog />}
          <ThemeToggle />

          {/* Replay the onboarding tour */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => startTour()}
            title="Take the tour"
            aria-label="Replay onboarding tour"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

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
                  <Settings2 className="h-4 w-4" />
                  Inspector &amp; Layers
                </SheetTitle>
              </SheetHeader>
              {/* Mode switching lives here on smaller screens */}
              <div className="lg:hidden px-5 pt-3">
                <ModeSwitcher />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                {rightInspectorContent}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {activeMode === "text" ? (
        <>
      {/* Figma 3-Column Workspace Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar (Layers / Presets / History) */}
        <div className="hidden lg:flex w-[300px] min-w-[300px] border-r border-border bg-card flex-col">
          {leftSidebarContent}
        </div>

        {/* Center Canvas — full-bleed, borderless artboard */}
        <div id="tour-canvas" className="flex-1 min-h-0 relative">
          {/* Top text input bar */}
          <div id="tour-text-input" className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[85%] sm:w-[420px]">
            <TextInput />
          </div>

          <PreviewCanvas ref={previewCanvasRef} />

          {/* Floating transport bar — the one pill-shaped element in the system */}
          <div id="tour-transport" className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-card/95 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-float">
            <Button
              onClick={playAnimation}
              disabled={isAnimating}
              size="sm"
              title="Play (Space)"
              className="h-9 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-1.5 transition-colors"
            >
              <Play className="h-4 w-4 fill-current" />
              Play
            </Button>
            <div className="h-4 w-px bg-border" />
            <Button
              onClick={handleResetAnimation}
              size="sm"
              variant="ghost"
              className="h-8 px-3 rounded-full text-xs gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
              title="Reset animation properties"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              onClick={handleResetAll}
              size="sm"
              variant="ghost"
              className="h-8 px-3 rounded-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
              title="Clear all settings"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="hidden sm:inline text-[11px] text-muted-foreground font-mono tnum">
              {tweenType} · {ease} · {duration}s
            </span>
          </div>
        </div>

        {/* Right Sidebar Inspector */}
        <div className="hidden lg:flex w-[340px] min-w-[340px] border-l border-border bg-card flex-col">
          {rightInspectorContent}
        </div>
      </div>
        </>
      ) : (
        <TimelineCreator />
      )}
    </div>
  )
}
