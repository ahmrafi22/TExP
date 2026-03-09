"use client"

import { useState, useRef } from "react"
import { Play, RotateCcw, Trash2, Code2, ChevronRight, Type, Paintbrush, Settings2, Sparkles, Image } from "lucide-react"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

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

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-14 min-h-[3.5rem] flex items-center justify-between px-5 border-b border-border glass z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <Type className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">
              TEXP
            </h1>
          </div>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="h-12 min-h-[3rem] flex items-center justify-between px-4 border-b border-border bg-card/50">
            <div className="flex items-center gap-2">
              <Button
                onClick={playAnimation}
                disabled={isAnimating}
                size="sm"
                className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <Play className="h-3.5 w-3.5" />
                {isAnimating ? "Playing..." : "Play"}
              </Button>
              <Button
                onClick={resetAnimationProperties}
                size="sm"
                variant="outline"
                className="h-8 gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
              <Button
                onClick={resetAllSettings}
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {animationConfig.tweenType === "fromTo" ? "fromTo" : animationConfig.tweenType} · {animationConfig.ease} · {animationConfig.duration}s
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-4 min-h-0">
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

          {/* Text Input Bar */}
          <div className="px-4 pb-4">
            <TextInput text={text} onChange={setText} />
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="w-[360px] min-w-[360px] border-l border-border bg-card flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Accordion type="multiple" defaultValue={["animation", "style"]} className="w-full">
              {/* Animation Properties */}
              <AccordionItem value="animation" className="border-b border-border">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    Animation
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <AnimationControls
                    config={animationConfig}
                    onChange={setAnimationConfig}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Split Text */}
              <AccordionItem value="split" className="border-b border-border">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Type className="h-4 w-4 text-blue-500" />
                    Split Text
                    {splitTextConfig.enabled && (
                      <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0">ON</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <SplitTextControls
                    config={splitTextConfig}
                    onChange={setSplitTextConfig}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Text Styling */}
              <AccordionItem value="style" className="border-b border-border">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Paintbrush className="h-4 w-4 text-pink-500" />
                    Text Style
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex justify-end mb-3">
                    <Button
                      onClick={resetCustomCSS}
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-muted-foreground"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset Styles
                    </Button>
                  </div>
                  <CustomCssControls
                    config={animationConfig}
                    onChange={setAnimationConfig}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Background */}
              <AccordionItem value="background" className="border-b border-border">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Image className="h-4 w-4 text-amber-500" />
                    Background
                    <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0">
                      {backgroundConfig.type === "solid" && backgroundConfig.color === "auto" ? "Auto" : backgroundConfig.type}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <BackgroundControls
                    config={backgroundConfig}
                    onChange={setBackgroundConfig}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
