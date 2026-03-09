"use client"

import { useState, useRef } from "react"
import { Play, RotateCcw, Trash2, Code2, ChevronRight, Type, Paintbrush, Settings2, Sparkles, Image, PanelRightOpen, X } from "lucide-react"
import TexpLogo from "@/components/texp-logo"
import PreviewCanvas, { PreviewCanvasRef } from "@/components/preview-canvas"
import AnimationControls from "@/components/animation-controls"
import SplitTextControls from "@/components/split-text-controls"
import CustomCssControls from "@/components/custom-css-controls"
import BackgroundControls from "@/components/background-controls"
import TextInput from "@/components/text-input"
import CodeDialog from "@/components/code-dialog"
import type { AnimationConfig, BackgroundConfig } from "@/types/animation"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function GSAPPlayground() {
  const [text, setText] = useState("Hello GSAP!")
  const [isAnimating, setIsAnimating] = useState(false)
  const previewCanvasRef = useRef<PreviewCanvasRef>(null)

  const defaultAnimationConfig: AnimationConfig = {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 1,
    duration: 1,
    delay: 0,
    ease: "power1.out",
    tweenType: "to",
    stagger: 0,
    repeat: 0,
    yoyo: false,
    filter: { type: "blur", value: 0 },
    fromValues: {
      x: 0, y: 0, scale: 1, rotation: 0, opacity: 1,
      filter: { type: "blur", value: 0 },
    },
    customStyles: {
      fontSize: "4xl",
      fontFamily: "inherit",
      fontWeight: "bold",
      letterSpacing: "normal",
      background: "transparent",
      color: "inherit",
      textDecoration: "none",
      textTransform: "none",
      lineHeight: "normal",
      overflowHidden: false,
      containerOverflow: false,
    },
  }

  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>(defaultAnimationConfig)

  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>({
    type: "solid",
    color: "auto",
    gradient: {
      type: "linear",
      colors: ["#667eea", "#764ba2"],
      direction: "to right",
    },
    image: null,
  })

  const [splitTextConfig, setSplitTextConfig] = useState({
    enabled: false,
    type: "chars" as "chars" | "words",
    stagger: 0.1,
  })

  const [selectedFramework, setSelectedFramework] = useState<"vanilla" | "react" | "vue">("react")
  const [selectedLanguage, setSelectedLanguage] = useState<"js" | "ts">("ts")
  const [activeTab, setActiveTab] = useState<string>("animation")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const resetAllSettings = () => {
    setAnimationConfig(defaultAnimationConfig)
    setBackgroundConfig({
      type: "solid",
      color: "auto",
      gradient: {
        type: "linear",
        colors: ["#667eea", "#764ba2"],
        direction: "to right",
      },
      image: null,
    })
    setSplitTextConfig({ enabled: false, type: "chars", stagger: 0.1 })
    setText("Hello GSAP!")
    setIsAnimating(false)
    if (previewCanvasRef.current) previewCanvasRef.current.resetAnimation()
  }

  const playAnimation = () => {
    if (previewCanvasRef.current) {
      setIsAnimating(true)
      previewCanvasRef.current.playAnimation()
      setTimeout(() => setIsAnimating(false), 100)
    }
  }

  const resetAnimationProperties = () => {
    setAnimationConfig({
      ...animationConfig,
      x: 0, y: 0, scale: 1, rotation: 0, opacity: 1,
      duration: 1, delay: 0, ease: "power1.out", tweenType: "to",
      stagger: 0, repeat: 0, yoyo: false,
      filter: { type: "blur", value: 0 },
      fromValues: {
        x: 0, y: 0, scale: 1, rotation: 0, opacity: 1,
        filter: { type: "blur", value: 0 },
      },
    })
    setSplitTextConfig({ enabled: false, type: "chars", stagger: 0.1 })
    setIsAnimating(false)
    if (previewCanvasRef.current) previewCanvasRef.current.resetAnimation()
  }

  const resetCustomCSS = () => {
    setAnimationConfig({
      ...animationConfig,
      customStyles: { ...defaultAnimationConfig.customStyles },
    })
  }

  // Shared sidebar content used in both desktop sidebar and mobile sheet
  const sidebarContent = (
    <Tabs defaultValue="animation" onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
      <div className="px-3 pt-3 pb-0">
        <TabsList className="w-full grid grid-cols-2 h-10 relative">
          <span
            className="absolute inset-y-1 rounded-full bg-background shadow-sm transition-transform duration-300 ease-in-out"
            style={{
              width: 'calc(50% - 4px)',
              left: '2px',
              transform: activeTab === 'css' ? 'translateX(calc(100% + 4px))' : 'translateX(0)',
            }}
          />
          <TabsTrigger value="animation" className="text-xs gap-1.5 z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <Sparkles className="h-3.5 w-3.5" />
            Animation
          </TabsTrigger>
          <TabsTrigger value="css" className="text-xs gap-1.5 z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            <Paintbrush className="h-3.5 w-3.5" />
            CSS
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="animation" className="flex-1 overflow-y-auto custom-scrollbar mt-0 px-5 py-5">
        <div className="space-y-7">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <h3 className="text-sm font-semibold">Animation Properties</h3>
            </div>
            <AnimationControls config={animationConfig} onChange={setAnimationConfig} />
          </div>
          <Separator />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Split Text</h3>
              {splitTextConfig.enabled && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">ON</Badge>
              )}
            </div>
            <SplitTextControls config={splitTextConfig} onChange={setSplitTextConfig} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="css" className="flex-1 overflow-y-auto custom-scrollbar mt-0 px-5 py-5">
        <div className="space-y-7">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4 text-pink-500" />
                <h3 className="text-sm font-semibold">Text Style</h3>
              </div>
              <Button onClick={resetCustomCSS} size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground">
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
            <CustomCssControls config={animationConfig} onChange={setAnimationConfig} />
          </div>
          <Separator />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold">Background</h3>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {backgroundConfig.type === "solid" && backgroundConfig.color === "auto" ? "Auto" : backgroundConfig.type}
              </Badge>
            </div>
            <BackgroundControls config={backgroundConfig} onChange={setBackgroundConfig} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Development Banner */}
      <div className="bg-red-600 text-white text-center text-xs py-1.5 px-4 font-medium flex items-center justify-center gap-2 z-[60] shrink-0">
        <span>🚧 Development in progress — there might be some bugs.</span>
        <a
          href="https://github.com/ahmrafi22/TExP/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-red-100 transition-colors"
        >
          Report a bug
        </a>
      </div>

      {/* Header */}
      <header className="h-14 min-h-[3.5rem] flex items-center justify-between px-4 md:px-5 border-b border-border glass z-50">
        <div className="flex items-center gap-3">
          <TexpLogo className="h-7 w-auto text-black dark:text-white" />
        </div>

        <div className="flex items-center gap-2">
          <CodeDialog
            text={text}
            animationConfig={animationConfig}
            backgroundConfig={backgroundConfig}
            splitTextConfig={splitTextConfig}
            framework={selectedFramework}
            language={selectedLanguage}
            onFrameworkChange={setSelectedFramework}
            onLanguageChange={setSelectedLanguage}
          />
          <ThemeToggle />
          {/* Mobile settings toggle */}
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
                  Settings
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 flex flex-col min-h-0">
                {sidebarContent}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Text Input */}
          <div className="w-[90%] md:w-1/2 mx-auto mt-3 mb-2">
            <TextInput text={text} onChange={setText} />
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center px-3 md:px-4">
            <PreviewCanvas
              ref={previewCanvasRef}
              text={text}
              setText={setText}
              animationConfig={animationConfig}
              setAnimationConfig={setAnimationConfig}
              backgroundConfig={backgroundConfig}
              setBackgroundConfig={setBackgroundConfig}
              splitTextConfig={splitTextConfig}
              setSplitTextConfig={setSplitTextConfig}
              onResetAll={resetAllSettings}
            />
          </div>

          {/* Play / Reset / Clear buttons */}
          <div className="flex items-center justify-center gap-3 py-3">
            <Button
              onClick={playAnimation}
              disabled={isAnimating}
              size="lg"
              className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              title="Play"
            >
              <Play className="h-5 w-5" />
            </Button>
            <Button
              onClick={resetAnimationProperties}
              size="lg"
              variant="outline"
              className="h-12 w-12 rounded-full"
              title="Reset Animation"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              onClick={resetAllSettings}
              size="lg"
              variant="ghost"
              className="h-12 w-12 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Clear All"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Info bar */}
          <div className="pb-2 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">
              {animationConfig.tweenType === "fromTo" ? "fromTo" : animationConfig.tweenType} · {animationConfig.ease} · {animationConfig.duration}s
            </span>
          </div>
        </div>

        {/* Desktop Settings Sidebar — hidden on mobile */}
        <div className="hidden lg:flex w-[480px] min-w-[480px] border-l border-border bg-card flex-col">
          {sidebarContent}
        </div>
      </div>
    </div>
  )
}
